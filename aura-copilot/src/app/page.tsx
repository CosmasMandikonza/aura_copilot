
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

import HomeClient from './HomeClient';

export default function Page() {
  return <HomeClient suppressHydrationWarning />;
}





