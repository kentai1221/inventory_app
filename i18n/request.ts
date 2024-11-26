import {getRequestConfig} from 'next-intl/server';
import {cookies} from 'next/headers'; 
 
export default getRequestConfig(async () => {

  const locale = (await cookies()).get('locale')?.value || 'hk';
 
  return {
    locale,
    messages: (await import(`./${locale}.json`)).default
  };
});