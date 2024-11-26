import Form from '@/app/ui/invoices/create-form2';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
 
export default async function Page() {

    const [customers] = await Promise.all([fetchCustomers()]);

    return (
    <main>
        <Breadcrumbs
        breadcrumbs={[
            { label: 'Invoices', href: '/invoices' },
            {
            label: 'Create Invoice',
            href: '/invoices/create',
            active: true,
            },
        ]}
        />
        <Form customers={customers} />
    </main>
    );
}