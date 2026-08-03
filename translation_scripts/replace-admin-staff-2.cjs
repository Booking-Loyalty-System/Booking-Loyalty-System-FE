const fs = require('fs');
const filePath = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/pages/admin/AdminStaff.tsx';
let code = fs.readFileSync(filePath, 'utf8');

code = code.replace(
  />\s*Staff\s*<\/th>/g,
  ">{t('adminStaff.staffTh', { defaultValue: 'Staff' })}</th>"
);
code = code.replace(
  />\s*Phone\s*<\/th>/g,
  ">{t('adminStaff.phoneTh', { defaultValue: 'Phone' })}</th>"
);
code = code.replace(
  />\s*Role\s*<\/th>/g,
  ">{t('adminStaff.roleTh', { defaultValue: 'Role' })}</th>"
);
code = code.replace(
  />\s*Total Staff\s*<\/p>/g,
  ">{t('adminStaff.totalStaff', { defaultValue: 'Total Staff' })}</p>"
);
code = code.replace(
  /placeholder=\"Search staff\.\.\.\"/g,
  "placeholder={t('adminStaff.searchStaff', { defaultValue: 'Search staff...' })}"
);

fs.writeFileSync(filePath, code);
