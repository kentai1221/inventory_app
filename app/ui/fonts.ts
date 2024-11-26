import { Inter, Lusitana, Noto_Sans_TC } from 'next/font/google';

export const notoSansTC = Noto_Sans_TC({ subsets: ['latin'] });

export const lusitana = Lusitana({
    weight: ['400', '700'],
    subsets: ['latin'],
});