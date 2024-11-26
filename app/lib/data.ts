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

// export async function fetchRevenue() {
//   try {
//     // Artificially delay a response for demo purposes.
//     // Don't do this in production :)

//     // console.log('Fetching revenue data...');
//     // await new Promise((resolve) => setTimeout(resolve, 3000));

//     //const data = await sql<Revenue>`SELECT * FROM revenue`;

//     const revenues = await fetch(process.env.BACKEND_URL+`/api/revenues`).then((res) =>
//       res.json()
//     )

//     // const data = [
//     //   { month: 'Jan', revenue: 2000 },
//     //   { month: 'Feb', revenue: 1800 },
//     //   { month: 'Mar', revenue: 2200 },
//     //   { month: 'Apr', revenue: 2500 },
//     //   { month: 'May', revenue: 2300 },
//     //   { month: 'Jun', revenue: 3200 },
//     //   { month: 'Jul', revenue: 3500 },
//     //   { month: 'Aug', revenue: 3700 },
//     //   { month: 'Sep', revenue: 2500 },
//     //   { month: 'Oct', revenue: 2800 },
//     //   { month: 'Nov', revenue: 3000 },
//     //   { month: 'Dec', revenue: 4800 },
//     // ];

//     // console.log('Data fetch completed after 3 seconds.');

//     //return data.rows;
//     return revenues.data;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch revenue data.');
//   }
// }

// export async function fetchLatestInvoices() {
//   try {
//     const data = await sql<LatestInvoiceRaw>`
//       SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
//       FROM invoices
//       JOIN customers ON invoices.customer_id = customers.id
//       ORDER BY invoices.date DESC
//       LIMIT 5`;

//     const latestInvoices = data.rows.map((invoice) => ({
//       ...invoice,
//       amount: formatCurrency(invoice.amount),
//     }));
//     return latestInvoices;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch the latest invoices.');
//   }
// }
/*
export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

// export async function fetchInvoiceById(id: string) {
//   try {
//     const data = await sql<InvoiceForm>`
//       SELECT
//         invoices.id,
//         invoices.customer_id,
//         invoices.amount,
//         invoices.status
//       FROM invoices
//       WHERE invoices.id = ${id};
//     `;

//     const invoice = data.rows.map((invoice) => ({
//       ...invoice,
//       // Convert amount from cents to dollars
//       amount: invoice.amount / 100,
//     }));

//     return invoice[0];
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch invoice.');
//   }
// }

// export async function fetchCustomers() {
//   try {
//     const data = await sql<CustomerField>`
//       SELECT
//         id,
//         name
//       FROM customers
//       ORDER BY name ASC
//     `;

//     const customers = data.rows;
//     return customers;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch all customers.');
//   }
// }

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}
  */
