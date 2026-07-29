const fs = require('fs');
const filePath = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/layouts/AdminLayout.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// Import useTranslation
if (!code.includes('useTranslation')) {
    code = code.replace('import { useLanguage } from "@/core/context/LanguageContext.tsx";', 'import { useLanguage } from "@/core/context/LanguageContext.tsx";\nimport { useTranslation } from "react-i18next";');
}

// Add t to hook
if (!code.includes('const { t } = useTranslation')) {
    code = code.replace('const { logout } = useAuth();', 'const { logout } = useAuth();\n  const { t } = useTranslation(\'customer\');');
}

// Replace menu items label property with t function calls
code = code.replace(/label: "Overview"/g, 'label: t(\'adminSidebar.overview\', { defaultValue: \'Overview\' })');
code = code.replace(/label: "Branches"/g, 'label: t(\'adminSidebar.branches\', { defaultValue: \'Branches\' })');
code = code.replace(/label: "Staff"/g, 'label: t(\'adminSidebar.staff\', { defaultValue: \'Staff\' })');
code = code.replace(/label: "Wash Packages"/g, 'label: t(\'adminSidebar.washPackages\', { defaultValue: \'Wash Packages\' })');
code = code.replace(/label: "Loyalty Tiers"/g, 'label: t(\'adminSidebar.loyaltyTiers\', { defaultValue: \'Loyalty Tiers\' })');
code = code.replace(/label: "Analytics"/g, 'label: t(\'adminSidebar.analytics\', { defaultValue: \'Analytics\' })');
code = code.replace(/label: "Business Reports"/g, 'label: t(\'adminSidebar.businessReports\', { defaultValue: \'Business Reports\' })');
code = code.replace(/label: "Promotions"/g, 'label: t(\'adminSidebar.promotions\', { defaultValue: \'Promotions\' })');
code = code.replace(/label: "Customer Feedbacks"/g, 'label: t(\'adminSidebar.customerFeedbacks\', { defaultValue: \'Customer Feedbacks\' })');
code = code.replace(/label: "Booking Feedbacks"/g, 'label: t(\'adminSidebar.bookingFeedbacks\', { defaultValue: \'Booking Feedbacks\' })');
code = code.replace(/label: "Chat Feedbacks"/g, 'label: t(\'adminSidebar.chatFeedbacks\', { defaultValue: \'Chat Feedbacks\' })');

// Replace some fixed UI strings
code = code.replace(/>\s*Admin Portal\s*<\/p>/g, '>{t(\'adminSidebar.adminPortal\', { defaultValue: \'Admin Portal\' })}</p>');
code = code.replace(/>\s*Management\s*<\/div>/g, '>{t(\'adminSidebar.management\', { defaultValue: \'Management\' })}</div>');
code = code.replace(/>\s*Log Out\s*<\/span>/g, '>{t(\'adminSidebar.logout\', { defaultValue: \'Log Out\' })}</span>');

fs.writeFileSync(filePath, code);
