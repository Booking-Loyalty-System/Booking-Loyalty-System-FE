import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@/core/i18n'; // Khởi tạo i18n trước khi render
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/core/context/ThemeContext.tsx';
import { LanguageProvider } from '@/core/context/LanguageContext.tsx';

// 2. Khởi tạo một instance của QueryClient bên ngoài Component
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // Tùy chọn: tắt tự động refetch khi tab active lại
            retry: 1, // Tùy chọn: số lần thử lại nếu API lỗi
        },
    },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ThemeProvider>
          <LanguageProvider>
              <QueryClientProvider client={queryClient}>
                  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                    <App />
                  </GoogleOAuthProvider>
              </QueryClientProvider>
          </LanguageProvider>
      </ThemeProvider>
  </StrictMode>,
)
