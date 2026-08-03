const fs = require('fs');
const filePath = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/pages/admin/AdminStaff.tsx';
let code = fs.readFileSync(filePath, 'utf8');

const regex = /\{\s*isCreating\s*\|\|\s*isUpdating\s*\?\s*\"Saving\.\.\.\"\s*:\s*editingStaff\s*\?\s*\"Save Changes\"\s*:\s*\"Create Staff\"\s*\}/;
code = code.replace(regex, "{isCreating || isUpdating ? t('adminStaff.saving', { defaultValue: 'Saving...' }) : editingStaff ? t('adminStaff.saveChanges', { defaultValue: 'Save Changes' }) : t('adminStaff.createStaff', { defaultValue: 'Create Staff' })}");

fs.writeFileSync(filePath, code);
