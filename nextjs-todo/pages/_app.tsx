import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import type {AppProps /*, AppContext */} from 'next/app';
import {useState} from 'react';

function MyApp({Component, pageProps}: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
export default MyApp;
