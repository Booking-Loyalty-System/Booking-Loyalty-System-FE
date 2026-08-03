const fs = require('fs');
const file = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/pages/admin/AdminPromotions.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix 1: formatUsage parameter t
content = content.replace(/function formatUsage\(promo: AdminPromotionResponseData, t: any\) \{/, 'function formatUsage(promo: AdminPromotionResponseData) {');

// Fix 2: formatUsage call
content = content.replace(/\{formatUsage\(promo, t\)\}/g, '{formatUsage(promo)}');

// Fix 3: Re-add const { t } = useTranslation
if (!content.includes('const { t } = useTranslation')) {
    content = content.replace(
        'export function AdminPromotions() {',
        'export function AdminPromotions() {\n  const { t } = useTranslation("customer");'
    );
}

fs.writeFileSync(file, content);
console.log('Fixed TS errors in AdminPromotions.tsx');
