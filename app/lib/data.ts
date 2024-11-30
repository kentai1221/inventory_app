import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';
const qs = require('qs');
import { auth } from '@/auth';


export async function fetchMe(id:string) {

  const session = await auth();
  const jwt = session?.user?.id;

  if (!jwt) {
    throw new Error('JWT is missing or invalid. Authorization failed.');
  }

  try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/users/me?populate=*`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
        });
      const me = await response.json();
  
      /*if (!response.ok) {
          throw new Error(`API error`);
      }*/

      return me;
      
  } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch invoice data.');
  }

}

export async function fetchInvoiceById(id:string) {

  const session = await auth();
  const jwt = session?.user?.id;

  if (!jwt) {
    throw new Error('JWT is missing or invalid. Authorization failed.');
  }

  try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/invoices/${id}?populate=customer`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
        });
      const invoice = await response.json();
  
      /*if (!response.ok) {
          throw new Error(`API error`);
      }*/

      return invoice.data;
      
  } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch invoice data.');
  }

}

export async function fetchCustomers() {
  const session = await auth();
  const jwt = session?.user?.id;

  if (!jwt) {
    throw new Error('JWT is missing or invalid. Authorization failed.');
  }

  try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/customers?sort[0]=name:asc`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
        });
      const json = await response.json();

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}: ${json.message}`);
      }

      // if (typeof json === 'number') {
      //const customers = json;
      // }

      return json.data

  } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch customers.');
  }

}

export async function fetchRevenue() {

  const session = await auth();
  const jwt = session?.user?.id;

  if (!jwt) {
    throw new Error('JWT is missing or invalid. Authorization failed.');
  }
  
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/revenues`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      });
    const json = await response.json();

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}: ${json.message}`);
    }

    //console.log('Fetching revenue data...');
    //await new Promise((resolve) => setTimeout(resolve, 3000)); //Delay
    return json.data

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }

}

export async function fetchLatestInvoices(){

  const session = await auth();
  const jwt = session?.user?.id;

  if (!jwt) {
    throw new Error('JWT is missing or invalid. Authorization failed.');
  }

  const query = qs.stringify({
    populate: {
      customer: {
        //fields: ['name','image_url'],
        populate: true
      }
    },
    pagination:{
      start: 0,
      limit: 6
    }
  });
  

  try {

    const response = await fetch(`${process.env.BACKEND_URL}/api/invoices?${query}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      });
    const json = await response.json();

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}: ${json.message}`);
    }

    const latestInvoices = json.data.map((invoice: LatestInvoiceRaw) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));

    return latestInvoices
    
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch latest invoices data.');
  }

}

export async function fetchTotalPaidInvoices(){

  const session = await auth();
  const jwt = session?.user?.id;

  if (!jwt) {
    throw new Error('JWT is missing or invalid. Authorization failed.');
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/invoice/count?invoice_status=paid`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      });
    const json = await response.json();

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}: ${json.message}`);
    }

    // if (typeof json === 'number') {
    //totalPaidInvoices = json;
    // }

    return json.totalAmount

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total paid invoices data.');
  }
  
}

export async function fetchTotalPendingInvoices(){

  const session = await auth();
  const jwt = session?.user?.id;

  if (!jwt) {
    throw new Error('JWT is missing or invalid. Authorization failed.');
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/invoice/count?invoice_status=pending`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      });
    const json = await response.json();

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}: ${json.message}`);
    }

    // if (typeof json === 'number') {
    //totalPendingInvoices = json;
    // }

    return json.totalAmount

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch Pending Invoices.');
  }

}

export async function fetchNumOfInvoices() {

  const session = await auth();
  const jwt = session?.user?.id;

  if (!jwt) {
    throw new Error('JWT is missing or invalid. Authorization failed.');
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/invoice/count`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      });
    const json = await response.json();

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}: ${json.message}`);
    }

    // if (typeof json === 'number') {
    //numberOfInvoices = json;
    // }
    return json.count

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch Num Of Invoices.');
  }
  
}

export async function fetchNumOfCustomer() {

  const session = await auth();
  const jwt = session?.user?.id;

  if (!jwt) {
    throw new Error('JWT is missing or invalid. Authorization failed.');
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/customer/count`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      });
    const numberOfCustomers = await response.json();

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}: ${numberOfCustomers.message}`);
    }

    if (typeof numberOfCustomers === 'number') {
      return numberOfCustomers
    }else{
      return 0
    }

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch Num Of Customer.');
  }
  
}

export async function fetchTotalPage(queryStr:string,pageSize:number) {

  const session = await auth();
  const jwt = session?.user?.id;

  if (!jwt) {
    throw new Error('JWT is missing or invalid. Authorization failed.');
  }

  const query = qs.stringify({
    query:queryStr
  });

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/invoice/search?${query}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      });
    
    if (!response.ok) {
      throw new Error(`API error`);
    }

    const totalItems = await response.json();
    const totalPages = Math.ceil(Number(totalItems) / pageSize);
    return {
      totalPages: totalPages,
      totalItems: totalItems
    };
    
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices data.');
  }
}

export async function fetchInvoices(queryStr:string,pageNo:number,pageSize:number) {

  const session = await auth();
  const jwt = session?.user?.id;

  if (!jwt) {
    throw new Error('JWT is missing or invalid. Authorization failed.');
  }

  const query = qs.stringify({
    query:queryStr,
    limit:pageSize,
    start:(pageNo-1)*pageSize,
  });

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/invoice/search?${query}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      });
    const invoices = await response.json();

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}: ${invoices.message}`);
    }

    return invoices

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices data.');
  }

}

export async function fetchBrandById(id:string) {

  const session = await auth();
  const jwt = session?.user?.id;

  if (!jwt) {
    throw new Error('JWT is missing or invalid. Authorization failed.');
  }

  try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/brands/${id}?populate=*`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
        });
      const brand = await response.json();

      return brand.data;
      
  } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch brand data.');
  }

}


export async function fetchBrand(queryStr:string,pageNo:number,pageSize:number) {

  const session = await auth();
  const jwt = session?.user?.id;

  if (!jwt) {
    throw new Error('JWT is missing or invalid. Authorization failed.');
  }

  const query = qs.stringify({
    query:queryStr,
    limit:pageSize,
    start:(pageNo-1)*pageSize,
  });

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/brand/search?${query}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      });
    const brand = await response.json();

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}: ${brand.message}`);
    }

    return brand

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch brand data.');
  }

}

export async function fetchBrandTotalPage(queryStr:string,pageSize:number) {

  const session = await auth();
  const jwt = session?.user?.id;

  if (!jwt) {
    throw new Error('JWT is missing or invalid. Authorization failed.');
  }

  const query = qs.stringify({
    query:queryStr
  });

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/brand/search?${query}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      });
    
    if (!response.ok) {
      throw new Error(`API error`);
    }

    const totalItems = await response.json();
    const totalPages = Math.ceil(Number(totalItems) / pageSize);
    return {
      totalPages: totalPages,
      totalItems: totalItems
    };
    
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch brand data.');
  }
}

//Category

export async function fetchCategoryById(id:string) {

  const session = await auth();
  const jwt = session?.user?.id;

  if (!jwt) {
    throw new Error('JWT is missing or invalid. Authorization failed.');
  }

  try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/products/${id}?populate=*`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
        });
      const category = await response.json();

      return category.data;
      
  } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch category data.');
  }

}


export async function fetchCategory(queryStr:string,pageNo:number,pageSize:number) {

  const session = await auth();
  const jwt = session?.user?.id;

  if (!jwt) {
    throw new Error('JWT is missing or invalid. Authorization failed.');
  }

  const query = qs.stringify({
    query:queryStr,
    limit:pageSize,
    start:(pageNo-1)*pageSize,
  });

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/category/search?${query}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      });
    const category = await response.json();

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}: ${category.message}`);
    }

    return category

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch category data.');
  }

}

export async function fetchCategoryTotalPage(queryStr:string,pageSize:number) {

  const session = await auth();
  const jwt = session?.user?.id;

  if (!jwt) {
    throw new Error('JWT is missing or invalid. Authorization failed.');
  }

  const query = qs.stringify({
    query:queryStr
  });

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/category/search?${query}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      });
    
    if (!response.ok) {
      throw new Error(`API error`);
    }

    const totalItems = await response.json();
    const totalPages = Math.ceil(Number(totalItems) / pageSize);
    return {
      totalPages: totalPages,
      totalItems: totalItems
    };
    
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch category data.');
  }
}

//Product

export async function fetchProductById(id:string) {

  const session = await auth();
  const jwt = session?.user?.id;

  if (!jwt) {
    throw new Error('JWT is missing or invalid. Authorization failed.');
  }

  try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/products/${id}?populate=*`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
        });
      const product = await response.json();

      return product.data;
      
  } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch product data.');
  }

}


export async function fetchProduct(queryStr:string,pageNo:number,pageSize:number) {

  const session = await auth();
  const jwt = session?.user?.id;

  if (!jwt) {
    throw new Error('JWT is missing or invalid. Authorization failed.');
  }

  const query = qs.stringify({
    query:queryStr,
    limit:pageSize,
    start:(pageNo-1)*pageSize,
  });

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/product/search?${query}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      });
    const product = await response.json();

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}: ${product.message}`);
    }

    return product

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product data.');
  }

}

export async function fetchProductTotalPage(queryStr:string,pageSize:number) {

  const session = await auth();
  const jwt = session?.user?.id;

  if (!jwt) {
    throw new Error('JWT is missing or invalid. Authorization failed.');
  }

  const query = qs.stringify({
    query:queryStr
  });

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/product/search?${query}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      });
    
    if (!response.ok) {
      throw new Error(`API error`);
    }

    const totalItems = await response.json();
    const totalPages = Math.ceil(Number(totalItems) / pageSize);
    return {
      totalPages: totalPages,
      totalItems: totalItems
    };
    
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch category data.');
  }
}

export async function fetchBrands() {

  const session = await auth();
  const jwt = session?.user?.id;

  if (!jwt) {
    throw new Error('JWT is missing or invalid. Authorization failed.');
  }

  try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/brands`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
        });
      const brands = await response.json();

      return brands.data;
      
  } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch brands data.');
  }

}

export async function fetchCategories() {

  const session = await auth();
  const jwt = session?.user?.id;

  if (!jwt) {
    throw new Error('JWT is missing or invalid. Authorization failed.');
  }

  try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/categories`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
        });
      const categories = await response.json();

      return categories.data;
      
  } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch categories data.');
  }

}

export async function fetchProducts() {

  const session = await auth();
  const jwt = session?.user?.id;

  if (!jwt) {
    throw new Error('JWT is missing or invalid. Authorization failed.');
  }

  try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/products`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
        });
      const products = await response.json();

      return products.data;
      
  } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch categories data.');
  }

}


//Order

export async function fetchOrderById(id:string) {

  const session = await auth();
  const jwt = session?.user?.id;

  if (!jwt) {
    throw new Error('JWT is missing or invalid. Authorization failed.');
  }

  try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/products/${id}?populate=*`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
        });
      const order = await response.json();

      return order.data;
      
  } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch order data.');
  }

}


export async function fetchOrder(queryStr:string,pageNo:number,pageSize:number) {

  const session = await auth();
  const jwt = session?.user?.id;

  if (!jwt) {
    throw new Error('JWT is missing or invalid. Authorization failed.');
  }

  const query = qs.stringify({
    query:queryStr,
    limit:pageSize,
    start:(pageNo-1)*pageSize,
  });

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/order/search?${query}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      });
    const order = await response.json();

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}: ${order.message}`);
    }

    return order

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch order data.');
  }

}

export async function fetchOrderTotalPage(queryStr:string,pageSize:number) {

  const session = await auth();
  const jwt = session?.user?.id;

  if (!jwt) {
    throw new Error('JWT is missing or invalid. Authorization failed.');
  }

  const query = qs.stringify({
    query:queryStr
  });

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/order/search?${query}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      });
    
    if (!response.ok) {
      throw new Error(`API error`);
    }

    const totalItems = await response.json();
    const totalPages = Math.ceil(Number(totalItems) / pageSize);
    return {
      totalPages: totalPages,
      totalItems: totalItems
    };
    
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch order data.');
  }
}