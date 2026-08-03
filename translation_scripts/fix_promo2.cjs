const fs = require('fs');

const file = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/pages/admin/AdminPromotions.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/Tạo và quản lý mã giảm giá, chiến dịch marketing/g, "{t('adminPromotions.subtitle')}");
content = content.replace(/Thêm khuyến mãi/g, "{t('adminPromotions.addPromotion')}");
content = content.replace(/Không giới hạn/g, '');

fs.writeFileSync(file, content);
console.log('Fixed remaining strings');
