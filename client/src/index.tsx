import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App';
import { StateContextProvider } from './context';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient();

// const queryClient = new QueryClient({
//     defaultOptions: {
//         queries: {
//             refetchOnWindowFocus: false,
//             refetchOnmount: false,
//             refetchOnReconnect: false,
//             retry: 1,
//             staleTime: 5 * 1000,
//         },
//     },
// });
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <StateContextProvider>
          <App />
        </StateContextProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
