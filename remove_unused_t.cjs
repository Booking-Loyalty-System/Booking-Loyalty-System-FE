const fs = require('fs');
const file = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/pages/admin/AdminPromotions.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/const\s+\{\s*t\s*\}\s*=\s*useTranslation\([^)]*\);/, '');
fs.writeFileSync(file, content);
console.log('Removed unused t in AdminPromotions');
