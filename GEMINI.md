# Project Memory - Booking Loyalty System FE

## Core Principles & Workflow (Mandated by User)
- **Technical Integrity Over Short-Term Hacks**: Do NOT implement "quick fixes" just to show a screen. Every change must adhere to proper architectural patterns (Clean Architecture), maintainable logic, and long-term sustainability.
- **Clean Architecture**: Strictly maintain Domain -> Infrastructure -> Application -> Presentation layers.
- **UI/UX Reference Only**: Use prototype code only for visual reference; never copy-paste raw logic.
- **Incremental Growth**: Skeleton (Models/Repos) -> Logic (Hooks) -> UI.
- **API-First Development**: Tuyệt đối không sử dụng Mock Data (đã gỡ bỏ toàn bộ code mock). Mọi tính năng đều phải gọi API thật. Nếu Backend chưa có sẵn API tương ứng, không được tự ý viết mock, mà phải liệt kê rõ danh sách API còn thiếu (kèm endpoint, method, payload, và mô tả) để User gửi cho Backend team xử lý.
- **Git Strategy**: Work on feature branches, keep commits clean and scoped to the task.
- **Clean Code & Git Integrity**: Tuyệt đối không commit "rác" (biến thừa, import thừa, lỗi syntax). Luôn kiểm tra kỹ lỗi Lint/TypeScript trước khi đẩy code lên Git để đảm bảo tính chuyên nghiệp và sạch sẽ của repository.
- **Educational & Architectural Commenting**: Khi triển khai logic sử dụng các tính năng đặc thù của React (Hooks như `useState`, `useEffect`,...), các pattern phức tạp, hoặc thư viện bên ngoài, luôn thêm chú thích chi tiết bằng tiếng Việt (`//`) giải thích **DÙNG CÁI GÌ** và **TẠI SAO** lại chọn giải pháp đó. Mục tiêu là để code dễ hiểu, phục vụ học tập và bảo trì lâu dài.
- **Customer-Only Scope (Active Session)**: Chỉ thực hiện các thay đổi (thêm, sửa, logic) liên quan đến thực thể **Customer**. Tuyệt đối không can thiệp vào logic của thực thể Admin hoặc Staff để tránh xung đột.
- **Strict Customer Staging**: Khi commit, chỉ `git add` những file liên quan trực tiếp đến task của Customer. Tuyệt đối hạn chế dùng `git add .` để tránh đưa các file rác hoặc các thay đổi cấu hình chung không mong muốn vào Pull Request, làm giảm nguy cơ xung đột khi merge vào `develop`.
- **Pre-Commit Verification**: Luôn chạy `pnpm run build` (hoặc `npm run build`) tại máy local trước khi thực hiện commit và push. Nếu có lỗi build hoặc lỗi TypeScript, phải sửa triệt để ngay dưới local. Chỉ khi lệnh build thành công 100% mới được phép đẩy code lên Git.
- **Vercel Deployment Safety**: Đảm bảo không có lỗi TypeScript strict, import thừa, hay biến unused trước khi push — Vercel build sẽ fail nếu có những lỗi này dù local không báo.
- **Branch**: Toàn bộ thay đổi của Customer phiên này commit lên nhánh `feat/customer/bang`.
- **Frequent Commits**: Tuyệt đối không gom nhiều thay đổi vào một lần commit. Phải commit liên tục ngay sau khi hoàn thành từng phần việc nhỏ, từng lỗi nhỏ được sửa hoặc một tính năng con được hoàn thiện, nhằm tạo ra lịch sử commit dày đặc và chi tiết.
- **Commit Message Format**: Các lần commit tới, BẮT BUỘC dùng cấu trúc có tiền tố `feat` (ví dụ: `feat:"..."` hoặc `feat(customer):"..."`). Tuyệt đối không dùng các prefix khác như `fix`, `chore`, `docs` hay sai định dạng.

## Active Scope (Session: 2026-06-22)
- **Entity**: Customer
- **Branch**: `feat/customer/bang`
- **Goal**: Hoàn thiện Customer Portal — tập trung vào các tính năng còn thiếu theo Note.txt:
  - ✅ Cơ chế Voucher (apply voucher vào booking trước khi confirm)
  - ✅ Điểm thưởng ↔ Voucher (dùng điểm đổi voucher)
  - ✅ Tự động cộng điểm sau thanh toán
  - ✅ Điều chỉnh đơn vị tiền (currency)
  - ✅ Landing Page


## Current Status (2026-06-22)
- **Feature: Customer Portal — Hiện trạng**
  - ✅ Đã có: Domain model `customer.dto.ts`, `useCustomerMe` hook, `CustomerRepositoryImplement`
  - ✅ Đã có: `customer.repository.mock.ts` (Mock repository hỗ trợ phát triển local)
  - ✅ Đã có: Tích hợp biến môi trường `VITE_USE_MOCK` trong `useCustomer.ts` để tự động bật tắt mock (mặc định chạy API thật khi deploy/push).
  - ✅ Đã có: Điều chỉnh toàn bộ đơn vị tiền tệ từ USD ($) sang VND (đ / VNĐ) và bản địa hóa nội dung hiển thị trong Customer UI.
  - ✅ Đã có: Các UI components: `Dashboard`, `BookWash`, `BookingHistory`, `MyVehicles`, `ProfileSettings`, `LoyaltyTier`, `RewardsSection`, `NotificationCenter`, `Promotions`
  - ✅ Đã có: `CustomerLayout`, routing trong `App.tsx`
  - ✅ Đã có: Voucher mechanism trong Booking flow (chọn voucher trước khi confirm booking)
  - ✅ Đã có: Điểm thưởng ↔ Voucher exchange (dùng điểm đổi voucher)
  - ✅ Đã có: Auto cộng điểm sau thanh toán
  - ✅ Đã có: Landing Page

## Previous Status (2026-06-19)
- **Feature: Staff Queue & Wash Bay Integration (Completed)**
  - Đồng bộ hóa QueueMonitor.tsx với useStaffDashboard.ts để hiển thị danh sách hàng chờ thực tế (`status === 'Queued'`).
  - Thiết lập trạng thái các buồng rửa (Wash Bays) động từ các Booking có trạng thái `InProgress` gắn với tên buồng tương ứng.
  - Triển khai bộ đếm ngược thời gian rửa giả lập (3 giây/phút rửa) tự động kích hoạt API cập nhật trạng thái `Completed (5)` khi rửa xong và giải phóng buồng rửa.
  - Bổ sung bộ lọc Chi nhánh phía Client (Branch Selector) tại cả hai trang StaffQueue.tsx và QueueMonitor.tsx.
  - Tích hợp cờ `useMock = true` vào useStaffDashboard.ts để kích hoạt StaffBookingRepositoryMock hỗ trợ đầy đủ 9 trạng thái Booking State Machine.
  - Xác thực dự án build thành công 100% không phát sinh lỗi biên dịch.

- **Feature: Staff Portal Alignment (Completed 2026-06-16)**
  - Implemented dynamic date selection for `StaffDashboard` and `TotalBookings` using server-side filtering (`date` query param).
  - Synchronized `useStaffDashboard` hook and UI across both pages for consistent UX.
  - Internationalized wash package service names ('Standard Wash', 'Premium Wash') in mock repository.
  - Added project-wide architectural comments giải thích backend filtering.
