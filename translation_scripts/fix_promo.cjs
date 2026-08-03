const fs = require('fs');

const file = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/pages/admin/AdminPromotions.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('useTranslation')) {
    content = content.replace(
        'import { useState, useMemo } from "react";',
        'import { useState, useMemo } from "react";\nimport { useTranslation } from "react-i18next";'
    );
}

if (!content.includes('const { t } = useTranslation')) {
    content = content.replace(
        'export function AdminPromotions() {',
        'export function AdminPromotions() {\n  const { t } = useTranslation("customer");'
    );
}

// Update helper functions to accept t
content = content.replace(
    'function formatDiscountType(type: DiscountType) {',
    'function formatDiscountType(type: DiscountType, t: any) {'
);
content = content.replace(
    'return type === "Percentage" ? "Phần trăm" : "Số tiền cố định";',
    'return type === "Percentage" ? t("adminPromotions.percentage") : t("adminPromotions.fixedAmount");'
);

content = content.replace(
    'function formatUsage(promo: AdminPromotionResponseData) {',
    'function formatUsage(promo: AdminPromotionResponseData, t: any) {'
);
content = content.replace(
    'return \\ / Không giới hạn\;',
    'return \\ / \\;'
);

// Update calls to helper functions
content = content.replace(
    '{formatDiscountType(promo.discountType)}',
    '{formatDiscountType(promo.discountType, t)}'
);
content = content.replace(
    '{formatUsage(promo)}',
    '{formatUsage(promo, t)}'
);

const replacements = [
    ['"Bạn có chắc muốn xóa khuyến mãi này?"', "t('adminPromotions.deleteConfirm')"],
    ['>Khuyến mãi<', ">{t('adminPromotions.title')}<"],
    ['>Tạo và quản lý mã giảm giá, chiến dịch marketing<', ">{t('adminPromotions.subtitle')}<"],
    ['> Thêm khuyến mãi<', "> {t('adminPromotions.addPromotion')}<"],
    ['>Đang hoạt động<', ">{t('adminPromotions.activeCount')}<"],
    ['>Tổng lượt sử dụng<', ">{t('adminPromotions.totalUsed')}<"],
    ['>Tổng khuyến mãi<', ">{t('adminPromotions.totalPromotions')}<"],
    ['>Đang tải khuyến mãi...<', ">{t('adminPromotions.loading')}<"],
    ['Mã / Mô tả\n', "{t('adminPromotions.codeDesc')}\n"],
    ['Loại giảm\n', "{t('adminPromotions.discountType')}\n"],
    ['Giá trị\n', "{t('adminPromotions.value')}\n"],
    ['Trạng thái\n', "{t('adminPromotions.status')}\n"],
    ['Lượt dùng\n', "{t('adminPromotions.uses')}\n"],
    ['Hết hạn\n', "{t('adminPromotions.expires')}\n"],
    ['Thao tác\n', "{t('adminPromotions.actions')}\n"],
    ['Hoạt động\n', "{t('adminPromotions.active')}\n"],
    ['Tắt\n', "{t('adminPromotions.inactive')}\n"],
    ['"Thêm khuyến mãi" : "Chỉnh sửa khuyến mãi"', "t('adminPromotions.addPromotion') : t('adminPromotions.editPromotion')"],
    ['Mã khuyến mãi\n', "{t('adminPromotions.promoCode')}\n"],
    ['>Mô tả<\n', ">{t('adminPromotions.description')}<\n"],
    ['placeholder="Mô tả chi tiết khuyến mãi..."', "placeholder={t('adminPromotions.descPlaceholder')}"],
    ['Loại giảm giá\n', "{t('adminPromotions.discountType')}\n"],
    ['>Phần trăm (%)<', ">{t('adminPromotions.percentageSuffix')}<"],
    ['>Số tiền cố định (đ)<', ">{t('adminPromotions.fixedAmountSuffix')}<"],
    ['Giá trị giảm\n', "{t('adminPromotions.discountValue')}\n"],
    ['Ngày bắt đầu\n', "{t('adminPromotions.startDate')}\n"],
    ['Ngày kết thúc\n', "{t('adminPromotions.endDate')}\n"],
    ['Giới hạn lượt dùng\n', "{t('adminPromotions.maxUses')}\n"],
    ['placeholder="Để trống = không giới hạn"', "placeholder={t('adminPromotions.leaveEmptyUnlimited')}"],
    ['Chi tiêu tối thiểu (đ)\n', "{t('adminPromotions.minSpend')}\n"],
    ['placeholder="Để trống = không yêu cầu"', "placeholder={t('adminPromotions.leaveEmptyNoRequirement')}"],
    ['"Đang lưu..."', "t('adminPromotions.saving')"],
    ['"Tạo khuyến mãi"', "t('adminPromotions.createPromotion')"],
    ['"Lưu thay đổi"', "t('adminPromotions.saveChanges')"]
];

for (const [search, replace] of replacements) {
    content = content.split(search).join(replace);
}

// The multi-line matches might fail due to indentation, so we'll use regex for table headers and labels
const regexReplacements = [
    [/>\s*Mã \/ Mô tả\s*</g, ">{t('adminPromotions.codeDesc')}<"],
    [/>\s*Loại giảm\s*</g, ">{t('adminPromotions.discountType')}<"],
    [/>\s*Giá trị\s*</g, ">{t('adminPromotions.value')}<"],
    [/>\s*Trạng thái\s*</g, ">{t('adminPromotions.status')}<"],
    [/>\s*Lượt dùng\s*</g, ">{t('adminPromotions.uses')}<"],
    [/>\s*Hết hạn\s*</g, ">{t('adminPromotions.expires')}<"],
    [/>\s*Thao tác\s*</g, ">{t('adminPromotions.actions')}<"],
    [/>\s*Hoạt động\s*</g, ">{t('adminPromotions.active')}<"],
    [/>\s*Tắt\s*</g, ">{t('adminPromotions.inactive')}<"],
    [/>\s*Mã khuyến mãi\s*</g, ">{t('adminPromotions.promoCode')}<"],
    [/>\s*Mô tả\s*</g, ">{t('adminPromotions.description')}<"],
    [/>\s*Loại giảm giá\s*</g, ">{t('adminPromotions.discountType')}<"],
    [/>\s*Giá trị giảm\s*</g, ">{t('adminPromotions.discountValue')}<"],
    [/>\s*Ngày bắt đầu\s*</g, ">{t('adminPromotions.startDate')}<"],
    [/>\s*Ngày kết thúc\s*</g, ">{t('adminPromotions.endDate')}<"],
    [/>\s*Giới hạn lượt dùng\s*</g, ">{t('adminPromotions.maxUses')}<"],
    [/>\s*Chi tiêu tối thiểu \(đ\)\s*</g, ">{t('adminPromotions.minSpend')}<"],
    [/>\s*Đang hoạt động\s*</g, ">{t('adminPromotions.activeCount')}<"]
];

for (const [search, replace] of regexReplacements) {
    content = content.replace(search, replace);
}

fs.writeFileSync(file, content);
console.log('Translations applied.');
