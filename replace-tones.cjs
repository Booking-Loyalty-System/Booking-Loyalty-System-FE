const fs = require('fs');
const filePath = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/pages/admin/AdminBranches.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// Update useTranslation to extract i18n
code = code.replace(/const \{ t \} = useTranslation\('customer'\);/g, 'const { t, i18n } = useTranslation(\'customer\');\n\n  const removeVietnameseTones = (str: string) => {\n    if (!str) return \"\";\n    return str.normalize(\'NFD\').replace(/[\\u0300-\\u036f]/g, \'\').replace(/đ/g, \'d\').replace(/Đ/g, \'D\');\n  };');

// We will replace the branch name and address rendering
code = code.replace(
  /<h3 className=\"text-xl font-bold text-gray-900 mb-4\">\{t\(\'adminBranches.branchNameFormat\', \{ name: branch\.branchName[^}]+\}\)\}<\/h3>/g,
  '<h3 className="text-xl font-bold text-gray-900 mb-4">{t(\'adminBranches.branchNameFormat\', { name: i18n.language.startsWith(\'en\') ? removeVietnameseTones(branch.branchName.replace(/ Branch/i, \'\').replace(/Chi nhánh /i, \'\').replace(/Quận/g, t(\'adminBranches.districtWord\', { defaultValue: \'District\' }))) : branch.branchName.replace(/ Branch/i, \'\').replace(/Chi nhánh /i, \'\').replace(/Quận/g, t(\'adminBranches.districtWord\', { defaultValue: \'District\' })), defaultValue: branch.branchName })}</h3>'
);

// Also apply to address to be nice
code = code.replace(
  /<span className=\"text-sm text-gray-600 line-clamp-2\">\{branch\.address\.replace\('Vietnam', t\('adminBranches\.vietnam', \{ defaultValue: 'Việt Nam' \}\)\)\}<\/span>/g,
  '<span className=\"text-sm text-gray-600 line-clamp-2\">{i18n.language.startsWith(\'en\') ? removeVietnameseTones(branch.address.replace(\'Vietnam\', t(\'adminBranches.vietnam\', { defaultValue: \'Vietnam\' }))) : branch.address.replace(\'Vietnam\', t(\'adminBranches.vietnam\', { defaultValue: \'Việt Nam\' }))}</span>'
);

// wait, the address replace in the original was `{branch.address.replace('Vietnam', t('adminBranches.vietnam', { defaultValue: 'Việt Nam' }))}`
// because of charset encoding corruption, there might be 'Vi?t Nam'.
// Let's just use regex to match the span.
code = code.replace(
  /<span className=\"text-sm text-gray-600 line-clamp-2\">\{branch\.address\.replace\([^<]+\)<\/span>/g,
  '<span className=\"text-sm text-gray-600 line-clamp-2\">{i18n.language.startsWith(\'en\') ? removeVietnameseTones(branch.address.replace(\'Vietnam\', t(\'adminBranches.vietnam\', { defaultValue: \'Vietnam\' }))) : branch.address.replace(\'Vietnam\', t(\'adminBranches.vietnam\', { defaultValue: \'Việt Nam\' }))}</span>'
);

fs.writeFileSync(filePath, code);
