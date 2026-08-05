const fs = require('fs');
const filePath = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/pages/admin/AdminBranches.tsx';
let code = fs.readFileSync(filePath, 'utf8');

const lines = code.split('\n');
for (let i=0; i<lines.length; i++) {
  if (lines[i].includes('adminBranches.branchNameFormat')) {
    lines[i] = "                <h3 className=\"text-xl font-bold text-gray-900 mb-4\">{t('adminBranches.branchNameFormat', { name: branch.branchName.replace(/ Branch/i, '').replace(/Chi nhánh /i, '').replace(/Quận/g, t('adminBranches.districtWord', { defaultValue: 'District' })), defaultValue: branch.branchName })}</h3>";
  }
}
fs.writeFileSync(filePath, lines.join('\n'));
