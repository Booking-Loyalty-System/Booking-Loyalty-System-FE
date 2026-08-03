const fs = require('fs');
const filePath = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/pages/admin/AdminBranches.tsx';
let code = fs.readFileSync(filePath, 'utf8');

code = code.replace(
  /\{isAdding \? \"Add New Branch\" : \"Edit Branch\"\}/g,
  "{isAdding ? t('adminBranches.addNewBranch', { defaultValue: 'Add New Branch' }) : t('adminBranches.editBranch', { defaultValue: 'Edit Branch' })}"
);
code = code.replace(
  />\s*Branch Name\s*<\/label>/g,
  ">{t('adminBranches.branchName', { defaultValue: 'Branch Name' })}</label>"
);
code = code.replace(
  />\s*Address\s*<\/label>/g,
  ">{t('adminBranches.address', { defaultValue: 'Address' })}</label>"
);
code = code.replace(
  />\s*Hotline\s*<\/label>/g,
  ">{t('adminBranches.hotline', { defaultValue: 'Hotline' })}</label>"
);
code = code.replace(
  />\s*Operating Hours\s*<\/label>/g,
  ">{t('adminBranches.operatingHoursLabel', { defaultValue: 'Operating Hours' })}</label>"
);
code = code.replace(
  />\s*Cancel\s*<\/button>/g,
  ">{t('adminBranches.cancel', { defaultValue: 'Cancel' })}</button>"
);
code = code.replace(
  /\{isAdding \? \"Create Branch\" : \"Save Changes\"\}/g,
  "{isAdding ? t('adminBranches.createBranch', { defaultValue: 'Create Branch' }) : t('adminBranches.saveChanges', { defaultValue: 'Save Changes' })}"
);

fs.writeFileSync(filePath, code);
