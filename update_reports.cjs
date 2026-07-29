const fs = require('fs');

const reportsFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/pages/admin/AdminReports.tsx';
let reportsContent = fs.readFileSync(reportsFile, 'utf8');

if (!reportsContent.includes('useTranslation')) {
    reportsContent = reportsContent.replace(
        'import { useState } from "react";',
        'import { useState } from "react";\nimport { useTranslation } from "react-i18next";'
    );
}

if (!reportsContent.includes('const { t } = useTranslation')) {
    reportsContent = reportsContent.replace(
        'export function AdminReports() {',
        'export function AdminReports() {\n  const { t } = useTranslation("customer");'
    );
}

const reportsReplacements = [
    ['>Báo Cáo Doanh Nghiệp<', ">{t('adminReports.title')}<"],
    ['>Thiết lập khoảng thời gian so sánh dữ liệu<', ">{t('adminReports.setupComparisonTitle')}<"],
    ['>Tùy chỉnh<', ">{t('adminReports.custom')}<"],
    ['>Theo Tháng<', ">{t('adminReports.byMonth')}<"],
    ['>Theo Quý<', ">{t('adminReports.byQuarter')}<"],
    ['>Theo Năm<', ">{t('adminReports.byYear')}<"],
    ['>Kỳ Hiện Tại (Từ ngày)<', ">{t('adminReports.currentPeriodFrom')}<"],
    ['>Kỳ Hiện Tại (Đến ngày)<', ">{t('adminReports.currentPeriodTo')}<"],
    ['>Kỳ Đối Chứng (Từ ngày)<', ">{t('adminReports.comparePeriodFrom')}<"],
    ['>Kỳ Đối Chứng (Đến ngày)<', ">{t('adminReports.comparePeriodTo')}<"],
    ['>Tháng Hiện Tại<', ">{t('adminReports.currentMonth')}<"],
    ['>Tháng Đối Chứng<', ">{t('adminReports.compareMonth')}<"],
    ['>Quý Hiện Tại<', ">{t('adminReports.currentQuarter')}<"],
    ['>Quý Đối Chứng<', ">{t('adminReports.compareQuarter')}<"],
    ['>Quý 1<', ">{t('adminReports.quarterPlaceholder', { q: 1 })}<"],
    ['>Quý 2<', ">{t('adminReports.quarterPlaceholder', { q: 2 })}<"],
    ['>Quý 3<', ">{t('adminReports.quarterPlaceholder', { q: 3 })}<"],
    ['>Quý 4<', ">{t('adminReports.quarterPlaceholder', { q: 4 })}<"],
    ['placeholder="Năm"', "placeholder={t('adminReports.yearPlaceholder')}"],
    ['>Năm Hiện Tại<', ">{t('adminReports.currentYear')}<"],
    ['>Năm Đối Chứng<', ">{t('adminReports.compareYear')}<"]
];

for (const [search, replace] of reportsReplacements) {
    reportsContent = reportsContent.split(search).join(replace);
}

fs.writeFileSync(reportsFile, reportsContent);
console.log('AdminReports translations applied.');
