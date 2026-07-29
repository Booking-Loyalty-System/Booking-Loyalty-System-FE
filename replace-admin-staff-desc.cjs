const fs = require('fs');
const filePath = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/pages/admin/AdminStaff.tsx';
let code = fs.readFileSync(filePath, 'utf8');

code = code.replace(
  /\{\s*editingStaff\s*\?\s*\"Update staff information\.\"\s*:\s*\"Create a new staff account\.\"\s*\}/g,
  "{editingStaff ? t('adminStaff.updateDesc', { defaultValue: 'Update staff information.' }) : t('adminStaff.createDesc', { defaultValue: 'Create a new staff account.' })}"
);

fs.writeFileSync(filePath, code);
