const fs = require('fs');
const file = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/components/staff/CheckoutSummaryModal.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { useTranslation }')) {
    content = content.replace(
        'import React, { useState } from \\'react\\';',
        'import React, { useState } from \\'react\\';\nimport { useTranslation } from "react-i18next";'
    );
}

if (!content.includes('const { t } = useTranslation')) {
    content = content.replace(
        'const [isSubmitting, setIsSubmitting] = useState(false);',
        'const { t } = useTranslation("customer");\n    const [isSubmitting, setIsSubmitting] = useState(false);'
    );
}

const replacements = [
    [/>Xác Nhận Thanh Toán</g, ">{t('staffDashboard.checkoutModal.title')}<"],
    [/>Mã lịch đặt</g, ">{t('staffDashboard.checkoutModal.bookingCode')}<"],
    [/>Thông tin xe</g, ">{t('staffDashboard.checkoutModal.vehicleInfo')}<"],
    [/'Chưa cập nhật'/g, "t('staffDashboard.checkoutModal.notUpdated')"],
    [/>Dịch vụ</g, ">{t('staffDashboard.checkoutModal.service')}<"],
    [/>Tổng thanh toán</g, ">{t('staffDashboard.checkoutModal.totalPayment')}<"],
    [/>Điểm tích luỹ</g, ">{t('staffDashboard.checkoutModal.earnedPoints')}<"],
    [/>\s*Tính tự động sau khi thu tiền\s*</g, ">\n                                {t('staffDashboard.checkoutModal.autoCalc')}\n                            <"],
    [/>\s*Hủy bỏ\s*</g, ">\n                            {t('staffDashboard.checkoutModal.cancel')}\n                        <"],
    [/>\s*Thanh toán\s*</g, ">\n                            {t('staffDashboard.checkoutModal.checkout')}\n                        <"],
    [/>Chọn phương thức thanh toán</g, ">{t('staffDashboard.checkoutModal.chooseMethod')}<"],
    [/>\s*Tiền mặt\s*</g, ">\n                                {t('staffDashboard.checkoutModal.cash')}\n                            <"],
    [/>Đang xử lý giao dịch\.\.\.</g, ">{t('staffDashboard.checkoutModal.processing')}<"],
    [/>\s*Quay lại\s*</g, ">\n                                    {t('staffDashboard.checkoutModal.back')}\n                                <"]
];

for (const [regex, replace] of replacements) {
    content = content.replace(regex, replace);
}

fs.writeFileSync(file, content);
console.log('CheckoutSummaryModal updated');
