import React from 'react'
import ReactDOM from 'react-dom/client'
import ReactGA from 'react-ga4'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { ChatHistoryProvider } from 'context/ChatContext'
import { UIOptionsProvider } from 'context/UIOptionsContext'
import App from './App'
import './i18n'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

if (import.meta.env.MODE !== 'DEV' && import.meta.env.MODE !== 'DEMO') {
  ReactGA.initialize(import.meta.env.VITE_GOOGLE_ANALYTICS)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <UIOptionsProvider>
    <ChatHistoryProvider>
      <QueryClientProvider client={queryClient}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </QueryClientProvider>
    </ChatHistoryProvider>
  </UIOptionsProvider>
)
