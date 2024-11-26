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
        invalid_type_error: 'Please select an invoice status.',
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

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(prevState: State, formData: FormData) {

    const session = await auth();
    const jwt = session?.user?.id;
  
    if (!jwt) {
      throw new Error('JWT is missing or invalid. Authorization failed.');
    }

    // const rawFormData = {
    //     customerId: formData.get('customerId'),
    //     amount: formData.get('amount'),
    //     status: formData.get('status'),
    // };

    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Create Invoice.',
          payload: formData,
        };
      }

    const { customerId, amount, status } = validatedFields.data;
    const date = new Date().toISOString().split('T')[0];

    let response = await fetch(`${process.env.BACKEND_URL}/api/invoices`, {
        method: 'POST',
        body: JSON.stringify({
            'data': {
                customer:{
                    id:customerId,
                },
                amount:amount,
                invoice_status:status,
                date:(new Date().toISOString()).toString(),
            }
        }),
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${jwt}`,
        }
    })

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    let data;
    try {
        data = await response.json();
    } catch (error) {
        throw new Error('Failed to parse JSON response: ' + error);
    }
    
    revalidatePath('/invoices');
    redirect('/invoices');

    // Loop all form data
    //   for (const pair of formData.entries()) {
    //     console.log(pair[0], pair[1]);
    //   }
    
    //console.log(rawFormData);
}

export async function updateInvoice(id: string, formData: FormData) {

    const session = await auth();
    const jwt = session?.user?.id;
  
    if (!jwt) {
      throw new Error('JWT is missing or invalid. Authorization failed.');
    }


    let response = await fetch(`${process.env.BACKEND_URL}/api/invoices/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            'data': {
                customer:{
                    id:formData.get('customerId'),
                },
                amount:Number(formData.get('amount')),
                invoice_status:formData.get('status'),
            }
        }),
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${jwt}`,
        }
    })

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    let data;
    try {
        data = await response.json();
    } catch (error) {
        throw new Error('Failed to parse JSON response: ' + error);
    }

    revalidatePath('/invoices');
    redirect('/invoices');
}


export async function deleteInvoice(id: string) {

    const session = await auth();
    const jwt = session?.user?.id;
  
    if (!jwt) {
      throw new Error('JWT is missing or invalid. Authorization failed.');
    }

    
    //throw new Error('Failed to Delete Invoice');
    
    try {
        let response = await fetch(`${process.env.BACKEND_URL}/api/invoices/${id}`, {
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
        return { message: 'Failed to Delete Invoice.' };
    }

    revalidatePath('/invoices');
}

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
        const response_update = await fetch(`${process.env.BACKEND_URL}/api/trainees/${id}`, {
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

        revalidatePath(`/trainee/${id}/edit`);

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

export async function updateTrainee(id: string, formData: FormData) : Promise<{
    message: string;
    payload?: FormData;
    error?: string;
}> {

    const session = await auth();
    const jwt = session?.user?.id;
  
    if (!jwt) {
      throw new Error('JWT is missing or invalid. Authorization failed.');
    }


    let response = await fetch(`${process.env.BACKEND_URL}/api/trainees/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            'data': {
                'name_tc':formData.get('name_chi'),
                'name_en':formData.get('name_en'),
                'hkid':formData.get('hkid'),
                'gender':formData.get('gender'),
                'address':formData.get('address'),
                'email':formData.get('email'),
                'phone':formData.get('phone'),
                'birth':formData.get('birthday')||null,
                'join_date':formData.get('join_date')||null,
                'age':formData.get('age')?Number(formData.get('age')):null,
                'trainee_no':formData.get('trainee_no'),
                'ehealth_applied':formData.get('ehealth')=='true'?true:false,
                'intellectual_level':formData.get('intellectual_level'),
                'diet_type':formData.get('diet_type'),
                'diagnosis':formData.get('diagnosis'),
                'food_allergy':formData.get('food_allergy'),
                'drug_allergy':formData.get('drug_allergy'),
                'surgery_record':formData.get('surgery_record'),
                'injection_record':formData.get('injection_record'),
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

    //revalidatePath(`/trainee/${id}/edit`);
    redirect(`/trainee/${id}/edit?done=1`);
}


export async function createGuardian(prevState: State, formData: FormData): Promise<{
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

    // Extract trainee ID and other data from FormData
    const id = formData.get('id');
    const name = formData.get('gname');
    const phone = formData.get('phone');
    const relationship = formData.get('relationship');

    if (!id || !name || !phone || !relationship) {
        return {
            message: 'failed',
            error: 'Form data validation failed',
        };
    }

    try {
       
        const response = await fetch(`${process.env.BACKEND_URL}/api/guardians`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: {
                    name,
                    phone,
                    relationship,
                    trainee: {
                        connect: [id],
                    },
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

        revalidatePath(`/trainee/${id}/edit`);

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

export async function deleteGuardian(prevState: State, formData: FormData): Promise<{
    message: string;
    payload?: FormData;
    error?: string;
}> {

    const session = await auth();
    const jwt = session?.user?.id;
    const id = formData.get('id');
    const gid = formData.get('gid');
  
    if (!jwt) {
      throw new Error('JWT is missing or invalid. Authorization failed.');
    }
    
    try {
        let response = await fetch(`${process.env.BACKEND_URL}/api/guardians/${gid}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${jwt}`,
            }
        })

        if (!response.ok) {
            const errorDetails = await response.text();
            return {
                message: `failed`,
                payload: formData,
                error: errorDetails,
            };
        }

        revalidatePath(`/trainee/${id}/edit`);
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

export async function createTrainee(prevState: State, formData: FormData): Promise<{
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

    const trainee_no = formData?.get('trainee_no');
    const branch = formData?.get('branch');

    if (!trainee_no || !branch) {
        return {
            message: 'failed',
            error: 'Form data validation failed',
        };
    }
    const qs = require('qs');
    const query = qs.stringify({
        filters: {
            trainee_no : trainee_no,
            branch: {
                documentId: { $in: branch },
            },
        },
        populate: {
          branch: {
            populate: true
          }
        }
      });

    try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/trainees?${query}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwt}`,
            },
          });
        const json = await response.json();
        if(json.data.length>0){
            return {
                message: 'exist'
            };
        }
        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}: ${json.message}`);
        }
    } catch (error: any) {
        return {
            message: 'failed',
            error: error.message,
        };
    }

    try {
       
        const response = await fetch(`${process.env.BACKEND_URL}/api/trainees`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: {
                    trainee_no,
                    branch: {
                        connect: [branch],
                    },
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
        formData.set('tid',jsonResponse.data.documentId);
        //revalidatePath(`/trainee/${jsonResponse.data.documentId}/edit`);
        //console.log(jsonResponse.data.documentId)
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

export async function deleteTrainee(id: string) {

    const session = await auth();
    const jwt = session?.user?.id;
  
    if (!jwt) {
      throw new Error('JWT is missing or invalid. Authorization failed.');
    }

   
    try {
        let response = await fetch(`${process.env.BACKEND_URL}/api/trainees/${id}`, {
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
        return { message: 'Failed to delete trainee.' };
    }

    revalidatePath('/trainee');
}
