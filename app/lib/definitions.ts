// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  // jwt: string;
  // user:{
  //   documentId: string;
  //   username: string;
  //   email: string;
  //   provider: string;
  //   confirmed: boolean;
  //   blocked: boolean;
  // }
  id: string;
  branches: string[];
  name: string;
  email: string;
  image: string;
  emailVerified:Date;
  session_expiry: string;
};

export type Customer = {
  id: string;
  name: string;
  name_en: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  documentId:string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  invoice_status: 'pending' | 'paid';
  customer: Customer;
  address:string,
  gender:string
};

export type Trainee = {
  image: any;
  documentId: string;
  name_tc: string;
  name_en: string;
  nation:string;
  gender:string;
  email: string;
  address_tc: string;
  address_en: string;
  phone: string;
  birth:string;
  join_date:string;
  trainee_no:string;
  ehealth_applied:string;
}

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  customer: Customer;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer: Customer;
  customer_id: string;
  amount: number;
  invoice_status: 'pending' | 'paid';
  documentId: string;
};
