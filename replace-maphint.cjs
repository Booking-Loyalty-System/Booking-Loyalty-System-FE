const fs = require('fs');
const viPath = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/vi/customer.json';
const enPath = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/en/customer.json';

let viData = JSON.parse(fs.readFileSync(viPath, 'utf8'));
viData.adminBranches.mapHint = 'Click vào bản đồ để ghim vị trí hoặc dùng nút "Tìm Map" bên cạnh địa chỉ';
fs.writeFileSync(viPath, JSON.stringify(viData, null, 2));

let enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
enData.adminBranches.mapHint = 'Click on the map to pin the location or use the "Search Map" button next to the address';
fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
