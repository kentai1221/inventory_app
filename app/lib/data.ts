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

export async function fetchTraineeTotalPage(queryStr:string,pageSize:number) {

  const session = await auth();
  const jwt = session?.user?.id;

  if (!jwt) {
    throw new Error('JWT is missing or invalid. Authorization failed.');
  }

  const query = qs.stringify({
    query:queryStr
  });

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/trainee/search?${query}`,
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
    throw new Error('Failed to fetch trainee data.');
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

export async function fetchTrainee(queryStr:string,pageNo:number,pageSize:number) {

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
    const response = await fetch(`${process.env.BACKEND_URL}/api/trainee/search?${query}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      });
    const trainee = await response.json();

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}: ${trainee.message}`);
    }

    return trainee

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch trainee data.');
  }

}

export async function fetchTraineeById(id:string) {

  const session = await auth();
  const jwt = session?.user?.id;

  if (!jwt) {
    throw new Error('JWT is missing or invalid. Authorization failed.');
  }

  try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/trainees/${id}?populate=*`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
        });
      const trainee = await response.json();
      //console.log(trainee)
  
      /*if (!response.ok) {
          throw new Error(`API error`);
      }*/

      return trainee.data;
      
  } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch trainee data.');
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