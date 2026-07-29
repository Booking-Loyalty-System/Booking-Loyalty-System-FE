const fs = require('fs');
const filePath = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/pages/admin/AdminBranches.tsx';
let code = fs.readFileSync(filePath, 'utf8');

const lines = code.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('T') && lines[i].includes('m Map')) {
    lines[i] = "                  {t('adminBranches.mapHint', { defaultValue: 'Click on the map to pin the location or use the \"Search Map\" button next to the address' })}";
  }
}
fs.writeFileSync(filePath, lines.join('\n'));
