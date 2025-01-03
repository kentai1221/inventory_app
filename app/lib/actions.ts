'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { auth } from '@/auth';
import type { User } from '@/app/lib/definitions';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        const rememberMe = formData.get('rememberMe') === 'on';
        await signIn('credentials', {
            ...Object.fromEntries(formData),
            rememberMe,
        });
    } catch (error:any) {
        if (error instanceof AuthError) {
        switch (error.type) {
            case 'CredentialsSignin':
                return 'Invalid credentials.';
            default:
                return 'Something went wrong.';
        }
        }
        throw error;
    }
}

export async function getUserAuth(email: string, password: string, rememberMe:boolean): Promise<User | undefined> {
    try {
      let response = await fetch(`${process.env.BACKEND_URL}/api/auth/local`, {
          method: 'POST',
          body: JSON.stringify({
              identifier: email,
              password: password,
          }),
          headers: {
              'Content-type': 'application/json'
          }
      })
  
      if (!response.ok) {
          //throw new Error(`HTTP error! status: ${response.status}`);
          return undefined;
      }
      let data;
      data = await response.json();

      const response_me = await fetch(`${process.env.BACKEND_URL}/api/users/me?populate=*`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.jwt}`,
        },
      });
      
      const me = await response_me.json();
      //console.log(rememberMe)
      let exp = new Date(new Date().getTime() + 60*60*1000).toISOString(); 
      if(rememberMe){
        exp = new Date(new Date().getTime() + 30*24*60*60*1000).toISOString(); 
      }

      return {
          id:data.jwt,
          branches:me.branches? me.branches:null,
          name:data.user.username,
          email:data.user.email,
          image: me.image && me.image.url ? `${process.env.BACKEND_URL}${me.image.url}` : "",
          emailVerified:data.user.createdAt,
          session_expiry: exp
      };
    }catch (error) {
        throw new Error('Error: ' + error);
    }
  }

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an status.',
    }),
    date: z.string(),
});

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
    payload?: FormData;
};

export type FormState = {
    message?: string | null;
    payload?: FormData;
};

export async function modifyPhoto(prevState: State, formData: FormData) {
    
    const session = await auth();
    const jwt = session?.user?.id;
   
    if (!jwt) {
        return {
            message: 'failed',
            payload: formData,
        };
    }

    const id = formData.get('id');

    const file = formData.get('file') as File;

    if (!file || file.size === 0) {
        return {
            message: 'failed',
            payload: formData,
        };
    }

    formData.append('files', file);

    try {
        // Step 1: Upload the image
        const response_upload = await fetch(`${process.env.BACKEND_URL}/api/upload`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${jwt}`, // Include JWT for authentication
            },
            body: formData, // Ensure FormData contains the `files` key
        });

        if (!response_upload.ok) {
            const errorDetails = await response_upload.text();
            console.error('Upload Error Details:', errorDetails);
            return {
                message: `failed`,
                payload: formData,
            };
        }

        const uploadResult = await response_upload.json();
        const uploadedFileId = uploadResult[0]?.id; // Assuming the first file is the uploaded file

        if (!uploadedFileId) {
            return {
                message: `failed`,
                payload: formData,
            };
        }

        //console.log(uploadedFileId)
        // Step 2: Update the user's media relationship
        const response_update = await fetch(`${process.env.BACKEND_URL}/api/products/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json', // Content-Type for JSON data
            },
            body: JSON.stringify({
                data:{
                    image: uploadedFileId, // Relate the uploaded file's ID to the user
                }
            }),
        });

        if (!response_update.ok) {
            const errorDetails = await response_update.text();
            return {
                message: errorDetails,
                payload: formData,
            };
            throw new Error(`Failed to associate image with user. Status: ${response_update.status}`);
        }

        revalidatePath(`/product/${id}/edit`);

        return {
            message: 'success',
        };
    } catch (error: any) {
        return {
            message: 'failed',
            error: error.message,
        };
    }
}

export async function changePwd(prevState: FormState, formData: FormData){
 
    const session = await auth();
    const jwt = session?.user?.id;
  
    if (!jwt) {
      throw new Error('JWT is missing or invalid. Authorization failed.');
    }

    if(formData.get('password2').length<6){
        return {
            message: 'fail',
            payload: formData,
        };
    }

    try {
        let response = await fetch(`${process.env.BACKEND_URL}/api/auth/change-password`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify({
              currentPassword: formData.get('password1'),
              password: formData.get('password2'),
              passwordConfirmation: formData.get('password3')
            })
        })

        if (!response.ok) {
            return {
                message: 'fail',
                payload: formData,
            };
        }
        
    } catch (error) {
        return {
            message: 'fail',
            payload: formData,
        };
    }
    
    return {
        message: 'success',
        payload: formData,
    };
}

export async function createBrand(prevState: State, formData: FormData): Promise<{
    message: string;
    payload?: FormData;
    error?: string;
}> {
    
    const session = await auth();
    const jwt = session?.user?.id;
   
    if (!jwt) {
        return {
            message: 'failed',
            error: 'JWT is missing or invalid',
        };
    }

    const name = formData?.get('name');
    const status = formData?.get('status');

    if (!name || !status) {
        return {
            message: 'failed',
            error: 'Form data validation failed',
        };
    }

    try {
       
        const response = await fetch(`${process.env.BACKEND_URL}/api/brands`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: {
                    name: name,
                    "brand_status":status=="false"?false:true
                },
            }),
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            return {
                message: `failed`,
                payload: formData,
                error: errorDetails,
            };
        }

        revalidatePath(`/brand`);
        return {
            message: 'success',
            payload: formData,
        };
    } catch (error: any) {
        return {
            message: 'failed',
            error: error.message,
        };
    }
}


export async function updateBrand(id: string, formData: FormData) : Promise<{
    message: string;
    payload?: FormData;
    error?: string;
}> {

    const session = await auth();
    const jwt = session?.user?.id;
  
    if (!jwt) {
      throw new Error('JWT is missing or invalid. Authorization failed.');
    }


    let response = await fetch(`${process.env.BACKEND_URL}/api/brands/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            'data': {
                'name':formData.get('name'),
                'brand_status':formData.get('status')
            }
        }),
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${jwt}`,
        }
    })

    if (!response.ok) {
        const errorDetails = await response.text();
         console.log(errorDetails)
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    let data;
    try {
        data = await response.json();
    } catch (error) {
        throw new Error('Failed to parse JSON response: ' + error);
    }

    redirect(`/brand/${id}/edit?done=1`);
}

export async function deleteBrand(id: string) {

    const session = await auth();
    const jwt = session?.user?.id;
  
    if (!jwt) {
      throw new Error('JWT is missing or invalid. Authorization failed.');
    }

   
    try {
        let response = await fetch(`${process.env.BACKEND_URL}/api/brands/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${jwt}`,
            }
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
    } catch (error) {
        return { message: 'Failed to delete brand.' };
    }

    revalidatePath('/brand');
}


//Category
export async function createCategory(prevState: State, formData: FormData): Promise<{
    message: string;
    payload?: FormData;
    error?: string;
}> {
    
    const session = await auth();
    const jwt = session?.user?.id;
   
    if (!jwt) {
        return {
            message: 'failed',
            error: 'JWT is missing or invalid',
        };
    }

    const name = formData?.get('name');
    const status = formData?.get('status');

    if (!name || !status) {
        return {
            message: 'failed',
            error: 'Form data validation failed',
        };
    }

    try {
       
        const response = await fetch(`${process.env.BACKEND_URL}/api/categories`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: {
                    name: name,
                    "category_status":status=="false"?false:true
                },
            }),
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            return {
                message: `failed`,
                payload: formData,
                error: errorDetails,
            };
        }

        revalidatePath(`/category`);
        return {
            message: 'success',
            payload: formData,
        };
    } catch (error: any) {
        return {
            message: 'failed',
            error: error.message,
        };
    }
}


export async function updateCategory(id: string, formData: FormData) : Promise<{
    message: string;
    payload?: FormData;
    error?: string;
}> {

    const session = await auth();
    const jwt = session?.user?.id;
  
    if (!jwt) {
      throw new Error('JWT is missing or invalid. Authorization failed.');
    }


    let response = await fetch(`${process.env.BACKEND_URL}/api/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            'data': {
                'name':formData.get('name'),
                'category_status':formData.get('status')
            }
        }),
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${jwt}`,
        }
    })

    if (!response.ok) {
        const errorDetails = await response.text();
         console.log(errorDetails)
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    let data;
    try {
        data = await response.json();
    } catch (error) {
        throw new Error('Failed to parse JSON response: ' + error);
    }

    redirect(`/category/${id}/edit?done=1`);
}

export async function deleteCategory(id: string) {

    const session = await auth();
    const jwt = session?.user?.id;
  
    if (!jwt) {
      throw new Error('JWT is missing or invalid. Authorization failed.');
    }

   
    try {
        let response = await fetch(`${process.env.BACKEND_URL}/api/categories/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${jwt}`,
            }
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
    } catch (error) {
        return { message: 'Failed to delete category.' };
    }

    revalidatePath('/category');
}

//Product
export async function createProduct(prevState: State, formData: FormData): Promise<{
    message: string;
    payload?: FormData;
    error?: string;
}> {
    
    const session = await auth();
    const jwt = session?.user?.id;
   
    if (!jwt) {
        return {
            message: 'failed',
            error: 'JWT is missing or invalid',
        };
    }

    const name = formData?.get('name');
    const status = formData?.get('status');

    if (!name || !status) {
        return {
            message: 'failed',
            error: 'Form data validation failed',
        };
    }

    try {
       
        const response = await fetch(`${process.env.BACKEND_URL}/api/products`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: {
                    name: name,
                    "product_status":status=="false"?false:true
                },
            }),
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            return {
                message: `failed`,
                payload: formData,
                error: errorDetails,
            };
        }

        const jsonResponse = await response.json();
        formData.set('pid',jsonResponse.data.documentId);

        return {
            message: 'success',
            payload: formData,
        };
    } catch (error: any) {
        return {
            message: 'failed',
            error: error.message,
        };
    }
}


export async function updateProduct(prevState: State, formData: FormData) : Promise<{
    message: string;
    payload?: FormData;
    error?: string;
}> {

    const session = await auth();
    const jwt = session?.user?.id;
  
    if (!jwt) {
        return {
            message: 'failed',
            payload: formData,
        };
    }

    const id = formData.get('id');
    const name = formData.get('name');
    const status = formData.get('status')||true;
    const price = Number(formData.get('price'))||0;
    const quantity = Number(formData.get('quantity'))||0;
    const brand = formData.get('brand');
    const category = formData.get('category');
    const code = formData.get('code');

    if(!name || !brand || !category){
        return {
            message: `failed`,
            payload: formData,
        };
    }

    let response = await fetch(`${process.env.BACKEND_URL}/api/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            'data': {
                'name':name,
                'product_status':status,
                'price':price,
                'quantity':quantity,
                'code':code,
                brand: { connect:[{documentId:brand}] },
                category: { connect:[{documentId:category}] },
            }
        }),
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${jwt}`,
        }
    })

    if (!response.ok) {
        const errorDetails = await response.text();
        //console.log(errorDetails)
        return {
            message: 'failed',
            payload: formData,
        };
    }
    
    let data;
    try {
        data = await response.json();
    } catch (error) {
        return {
            message: 'failed',
            payload: formData,
        };
    }

    revalidatePath(`/product/${id}/edit`);

    return {
        message: 'success',
    };
    redirect(`/product/${id}/edit?done=1`);
}

export async function deleteProduct(id: string) {

    const session = await auth();
    const jwt = session?.user?.id;
  
    if (!jwt) {
      throw new Error('JWT is missing or invalid. Authorization failed.');
    }

   
    try {
        let response = await fetch(`${process.env.BACKEND_URL}/api/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${jwt}`,
            }
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
    } catch (error) {
        return { message: 'Failed to delete product.' };
    }

    revalidatePath('/product');
}

//Order
export async function createOrder(prevState: State, formData: FormData): Promise<{
    message: string;
    payload?: FormData;
    error?: string;
  }> {
    const session = await auth();
    const jwt = session?.user?.id;
  
    if (!jwt) {
      return {
        message: 'failed',
        error: 'JWT is missing or invalid',
      };
    }
  
    const name = formData.get("name");
    const contact = formData.get("contact");
    const order_date = formData.get("order_date");
    const payment_type = formData.get("payment_type");
    const status = formData.get("status");
    const productRows = formData.get("productRows");
    const amount = formData.get("order_total");
    
  
    if (!name || !contact || !order_date || !payment_type || !status || !productRows) {
        return {
            message: "failed",
            error: "Form data validation failed",
        };
    }
  
    // Parse product rows back into an array
    let products;
    try {
      products = JSON.parse(productRows.toString());
    } catch (err) {
      return {
        message: 'failed',
        error: 'Failed to parse product data',
      };
    }
  
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/orders`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            name,
            contact,
            order_date,
            payment_type,
            amount,
            payment_status: status === "false" ? false : true,
          },
        }),
      });
  
      if (!response.ok) {
        const errorDetails = await response.text();
        return {
          message: 'failed',
          payload: formData,
          error: errorDetails,
        };
      }
      const res = await response.json();

      products.forEach(async (row:any) => {
        
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/order-products`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: {
                        product:{
                            connect: [row.productId],
                        },
                        order: {
                            connect: [res.data.documentId],
                        },
                        quantity:Number(row.quantity),
                        price:Number(row.price),
                        total:(Number(row.price)*Number(row.quantity))
                    },
                }),
            });

            if (!response.ok) {
                const errorDetails = await response.text();
                return {
                    message: `failed`,
                    payload: formData,
                    error: errorDetails,
                };
            }
        } catch (error: any) {
            return {
                message: 'failed',
                error: error.message,
            };
        }

        try {
            // Fetch the current product details to get the quantity
            const productResponse = await fetch(
              `${process.env.BACKEND_URL}/api/products/${row.productId}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${jwt}`,
                  "Content-Type": "application/json",
                },
              }
            );
        
            if (!productResponse.ok) {
              const errorDetails = await productResponse.text();
              return {
                message: `failed`,
                payload: formData,
                error: `Failed to fetch product details: ${errorDetails}`,
              };
            }
        
            const productData = await productResponse.json();
            const currentQuantity = productData.data.quantity;
            
            // Perform the subtraction
            const updatedQuantity = currentQuantity - Number(row.quantity);
        
            // Update the product quantity
            const updateResponse = await fetch(
              `${process.env.BACKEND_URL}/api/products/${row.productId}`,
              {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${jwt}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  data: {
                    quantity: updatedQuantity,
                  },
                }),
              }
            );

            if (!updateResponse.ok) {
              const errorDetails = await updateResponse.text();
              console.log(errorDetails)
              return {
                message: `failed`,
                payload: formData,
                error: `Failed to update product quantity: ${errorDetails}`,
              };
            }
          } catch (error: any) {
            return {
              message: "failed",
              error: error.message,
            };
          }

      });

      formData.set('oid',res.data.documentId);
      return {
        message: 'success',
        payload: formData,
      };
    } catch (error: any) {
      return {
        message: 'failed',
        error: error.message,
      };
    }
  }
  
export async function updateOrder(prevState: State, formData: FormData) : Promise<{
    message: string;
    payload?: FormData;
    error?: string;
}> {

    const session = await auth();
    const jwt = session?.user?.id;
  
    if (!jwt) {
        return {
            message: 'failed',
            payload: formData,
        };
    }

    const id = formData.get('id');
    let response = await fetch(`${process.env.BACKEND_URL}/api/orders/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            'data': {
                'name':formData.get('name'),
                'contact':formData.get('contact'),
                'payment_type':formData.get('payment_type'),
                'payment_status':formData.get('status')
            }
        }),
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${jwt}`,
        }
    })

    if (!response.ok) {
        const errorDetails = await response.text();
        return {
            message: 'failed',
            payload: formData,
        };
    }
    
    let data;
    try {
        data = await response.json();
    } catch (error) {
        return {
            message: 'failed',
            payload: formData,
        };
    }
    revalidatePath(`/order/${id}/edit`);

    return {
        message: 'success',
    };
}

export async function deleteOrder(id: string) {

    const session = await auth();
    const jwt = session?.user?.id;
  
    if (!jwt) {
      throw new Error('JWT is missing or invalid. Authorization failed.');
    }

   
    try {
        let response = await fetch(`${process.env.BACKEND_URL}/api/orders/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${jwt}`,
            }
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
    } catch (error) {
        return { message: 'Failed to delete order.' };
    }

    revalidatePath('/order');
}