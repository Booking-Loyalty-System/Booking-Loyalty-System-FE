const fs = require('fs');
const file = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/components/customer/BookingTableRow.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { useTranslation }')) {
    content = content.replace(
        'import {',
        'import { useTranslation } from "react-i18next";\nimport {'
    );
}

if (!content.includes('const { t } = useTranslation')) {
    content = content.replace(
        'onViewImages,\n}) => {',
        'onViewImages,\n}) => {\n  const { t } = useTranslation("customer");'
    );
}

const replacements = [
    [/BSX:\{" "\}/g, "{t('staffDashboard.rowActions.licensePlateLabel')}"],
    [/>\s*Xác nhận\s*</g, ">{t('staffDashboard.rowActions.confirm')} <"],
    [/>\s*Hủy\s*</g, ">{t('staffDashboard.rowActions.cancel')} <"],
    [/>\s*Check-in\s*</g, ">{t('staffDashboard.rowActions.checkIn')} <"],
    [/>\s*Vắng\s*</g, ">{t('staffDashboard.rowActions.noShow')} <"],
    [/>\s*Ảnh\s*</g, ">{t('staffDashboard.rowActions.images')}<"],
    [/>\s*Thanh toán\s*</g, ">{t('staffDashboard.rowActions.checkout')}<"]
];

for (const [regex, replace] of replacements) {
    content = content.replace(regex, replace);
}

fs.writeFileSync(file, content);
console.log('BookingTableRow updated');
