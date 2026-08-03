const fs = require('fs');
const filePath = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/pages/admin/AdminDashboard.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// Replace formula desc ignoring spaces
code = code.replace(/>\s*Điểm nhận được = \(Tổng tiền thanh toán \/ 1000\) × Hệ số hạng \(Tier Multiplier\)\. Việc thay đổi hệ số chỉ áp dụng cho các giao dịch trong tương lai\.\s*<\/p>/g, '>{t(\'adminDashboard.tierConfig.formulaDesc\', { defaultValue: \'Điểm nhận được = (Tổng tiền thanh toán / 1000) × Hệ số hạng (Tier Multiplier). Việc thay đổi hệ số chỉ áp dụng cho các giao dịch trong tương lai.\' })}</p>');

// Now, handle the "Customer Bronze Tier"
// If the user wants to translate the mock data, we can use `translateDynamic` on booking.customer
// But customer name is just a name. We can replace 'Tier' with empty or translate it. Actually, the user asked to translate "Customer Bronze Tier(trong cột Khách hàng) ở dưới phần Recent Booking".
// In the mock data, the customer name is "Customer Bronze Tier", "Customer Silver Tier", etc.
// Let's modify the frontend rendering of booking.customer
code = code.replace(/>\s*\{booking.customer\}\s*<\/td>/g, '>{booking.customer.replace(/Customer/g, t(\\'adminDashboard.recentBookings.customerWord\\', { defaultValue: \\'Customer\\' })).replace(/Tier/g, t(\\'adminDashboard.recentBookings.tierWord\\', { defaultValue: \\'Tier\\' })).replace(/Bronze/g, translateDynamic(\\'Bronze\\', \\'tier\\', t)).replace(/Silver/g, translateDynamic(\\'Silver\\', \\'tier\\', t)).replace(/Gold/g, translateDynamic(\\'Gold\\', \\'tier\\', t)).replace(/Platinum/g, translateDynamic(\\'Platinum\\', \\'tier\\', t))}</td>');

fs.writeFileSync(filePath, code);
