const fs = require('fs');
const filePath = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/pages/admin/AdminStaff.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// Replace "Actions" in table header or text
code = code.replace(
  />\s*Actions\s*<\/th>/g,
  ">{t('adminStaff.actions', { defaultValue: 'Actions' })}</th>"
);
code = code.replace(
  />\s*Actions\s*<\/div>/g,
  ">{t('adminStaff.actions', { defaultValue: 'Actions' })}</div>"
);

// Replace "Create a new staff account."
code = code.replace(
  />\s*Create a new staff account\.\s*<\/p>/g,
  ">{t('adminStaff.createDesc', { defaultValue: 'Create a new staff account.' })}</p>"
);
code = code.replace(
  />\s*Create a new staff account\.\s*<\/div>/g,
  ">{t('adminStaff.createDesc', { defaultValue: 'Create a new staff account.' })}</div>"
);

fs.writeFileSync(filePath, code);
