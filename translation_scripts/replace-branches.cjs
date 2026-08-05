const fs = require('fs');
const filePath = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/pages/admin/AdminBranches.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// Import useTranslation
if (!code.includes('useTranslation')) {
    code = code.replace('import { useStaff } from "@/features/products/application/useStaff";', 'import { useTranslation } from "react-i18next";\nimport { useStaff } from "@/features/products/application/useStaff";');
}

// Add const { t } = useTranslation('customer'); inside AdminBranches
if (!code.includes('const { t } = useTranslation')) {
    code = code.replace('export function AdminBranches() {', 'export function AdminBranches() {\n  const { t } = useTranslation(\'customer\');');
}

// Replace header strings
code = code.replace(/>\s*Branches\s*<\/h3>/g, '>{t(\'adminBranches.title\', { defaultValue: \'Branches\' })}</h3>');
code = code.replace(/>\s*Manage all car wash branches locations\s*<\/p>/g, '>{t(\'adminBranches.subtitle\', { defaultValue: \'Manage all car wash branches locations\' })}</p>');
code = code.replace(/>\s*Add Branch\s*<\/span>/g, '>{t(\'adminBranches.addBranch\', { defaultValue: \'Add Branch\' })}</span>');
code = code.replace(/>\s*Add Branch\s*<\/button>/g, '>{t(\'adminBranches.addBranch\', { defaultValue: \'Add Branch\' })}</button>'); // just in case it doesn't have a span

// Replace "Branch" in the branch name if it exists. Note that `{branch.branchName}` is rendered.
code = code.replace(/>\s*\{branch.branchName\}\s*<\/h3>/g, '>{branch.branchName.replace(\'Branch\', t(\'adminBranches.branchWord\', { defaultValue: \'Branch\' }))}</h3>');

// Handle Vietnam in address
code = code.replace(/>\s*\{branch.address\}\s*<\/span>/g, '>{branch.address.replace(\'Vietnam\', t(\'adminBranches.vietnam\', { defaultValue: \'Việt Nam\' }))}</span>');

// Replace "Hours:"
code = code.replace(/>\s*Hours:\s*<\/span>/g, '>{t(\'adminBranches.hours\', { defaultValue: \'Hours:\' })} </span>');
// Wait, hours is just literal text?
// In the prompt: "Hours: 8am-9pm". I will replace string literal 'Hours:' or 'Hours: ' with the translation.
code = code.replace(/Hours: /g, '{t(\'adminBranches.hours\', { defaultValue: \'Hours:\' })} ');

// Replace Active / Inactive
// If it's `{branch.status}`, we can wrap it or just translate it directly.
code = code.replace(/>\s*\{branch.status\}\s*<\/span>/g, '>{branch.status === \'Active\' ? t(\'adminBranches.active\', { defaultValue: \'Active\' }) : branch.status === \'Inactive\' ? t(\'adminBranches.inactive\', { defaultValue: \'Inactive\' }) : branch.status}</span>');

fs.writeFileSync(filePath, code);
console.log('Done replacement');
