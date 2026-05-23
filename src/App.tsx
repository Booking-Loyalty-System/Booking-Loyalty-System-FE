import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '@/features/products/application/useAuth';
import { LoginPage } from '@/features/products/presentation/pages/LoginPage';
import './App.css';

// 1. Khởi tạo QueryClient cho React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Tắt tự động refetch khi click chuyển tab cho đỡ tốn tài nguyên
      retry: 1, // Nếu lỗi thì thử gọi lại 1 lần
    },
  },
});

// 2. Component điều phối chính nội bộ ứng dụng
function AppContent() {
  const { isAuthenticated, user, logout } = useAuth();

  // 💡 Nếu chưa đăng nhập -> Ép hiển thị trang Login
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // 💡 Nếu đã đăng nhập thành công -> Hiển thị Giao diện chính của App
  return (
      <div className="app-layout">
        <header className="app-header">
          <h1>Hệ Thống Quản Lý</h1>
          <div className="user-info">
            <span>Xin chào, <strong>{user?.username}</strong> ({user?.email})</span>
            <button className="logout-btn" onClick={logout}>Đăng xuất</button>
          </div>
        </header>

        <main className="app-main">
          <section id="center">
            <h2>Chào mừng bạn đã quay trở lại!</h2>
            <p>Hệ thống Clean Architecture đã kích hoạt và sẵn sàng vận hành.</p>

            {/* Mai mốt bạn code thêm ProductList, OrderList... thì vứt ở đây */}
            <div style={{ marginTop: '20px', padding: '20px', border: '1px dashed #ccc' }}>
              <em>Tầng Presentation (Giao diện chính sau đăng nhập) sẽ hiển thị tại đây.</em>
            </div>
          </section>
        </main>
      </div>
  );
}

// 3. Component App tổng bọc đầy đủ các Context/Provider cần thiết
export default function App() {
  return (
      <QueryClientProvider client={queryClient}>
          <AppContent />
      </QueryClientProvider>
  );
}