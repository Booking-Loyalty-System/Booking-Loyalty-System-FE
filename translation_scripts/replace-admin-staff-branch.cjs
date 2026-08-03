const fs = require('fs');
const filePath = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/pages/admin/AdminStaff.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// Add removeVietnameseTones if not exists
if (!code.includes('removeVietnameseTones')) {
    code = code.replace(/const \{ t \} = useTranslation\('customer'\);/g, "const { t, i18n } = useTranslation('customer');\n\n  const removeVietnameseTones = (str: string) => {\n    if (!str) return '';\n    return str.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');\n  };");
}

// Replace the table branch name rendering
code = code.replace(
  /\{staff\.branch\?\.branchName \?\? t\(\'adminStaff\.noBranch\', \{ defaultValue: \'No branch\' \}\)\}/g,
  "{staff.branch?.branchName ? t('adminBranches.branchNameFormat', { name: i18n.language.startsWith('en') ? removeVietnameseTones(staff.branch.branchName.replace(/ Branch/i, '').replace(/Chi nhánh /i, '').replace(/Quận/g, t('adminBranches.districtWord', { defaultValue: 'District' }))) : staff.branch.branchName.replace(/ Branch/i, '').replace(/Chi nhánh /i, '').replace(/Quận/g, t('adminBranches.districtWord', { defaultValue: 'District' })), defaultValue: staff.branch.branchName }) : t('adminStaff.noBranch', { defaultValue: 'No branch' })}"
);

// Replace the select options branch name rendering
code = code.replace(
  />\s*\{branch\.branchName\}\s*<\/option>/g,
  ">{t('adminBranches.branchNameFormat', { name: i18n.language.startsWith('en') ? removeVietnameseTones(branch.branchName.replace(/ Branch/i, '').replace(/Chi nhánh /i, '').replace(/Quận/g, t('adminBranches.districtWord', { defaultValue: 'District' }))) : branch.branchName.replace(/ Branch/i, '').replace(/Chi nhánh /i, '').replace(/Quận/g, t('adminBranches.districtWord', { defaultValue: 'District' })), defaultValue: branch.branchName })}</option>"
);

fs.writeFileSync(filePath, code);
