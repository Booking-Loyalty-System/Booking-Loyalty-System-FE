const fs = require('fs');

const cardFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/components/RevenueComparisonCard.tsx';
let cardContent = fs.readFileSync(cardFile, 'utf8');

if (!cardContent.includes('useTranslation')) {
    cardContent = cardContent.replace(
        'import { useAdminDashboard } from "../../application/useAdminDashboard";',
        'import { useAdminDashboard } from "../../application/useAdminDashboard";\nimport { useTranslation } from "react-i18next";'
    );
}

if (!cardContent.includes('const { t } = useTranslation')) {
    cardContent = cardContent.replace(
        'export function RevenueComparisonCard({ dateFilter, activeTab = "custom" }: RevenueComparisonCardProps) {',
        'export function RevenueComparisonCard({ dateFilter, activeTab = "custom" }: RevenueComparisonCardProps) {\n    const { t } = useTranslation("customer");'
    );
}

const cardReplacements = [
    ['>Đang tải dữ liệu đối soát...<', ">{t('adminReports.loadingComparison')}<"],
    ['return Tháng  năm ', 'return t("adminReports.monthYear", { month: month + 1, year })'],
    ['return Quý  năm ', 'return t("adminReports.quarterYear", { quarter, year })'],
    ['return Năm ', 'return t("adminReports.yearLabel", { year })'],
    ['>Đối Soát & So Sánh Doanh Thu<', ">{t('adminReports.comparisonTitle')}<"],
    ['>So sánh hiệu suất doanh thu giữa hai chu kỳ tùy chọn<', ">{t('adminReports.comparisonSubtitle')}<"],
    ['>Kỳ hiện tại ({', ">{t('adminReports.currentPeriodPrefix')} ({"],
    ['>Kỳ đối chứng ({', ">{t('adminReports.comparePeriodPrefix')} ({"],
    ['> Biến động chênh lệch: <', "> {t('adminReports.variance')} <"],
    [' Biến động chênh lệch:\n', " {t('adminReports.variance')}\n"],
    [' Biến động chênh lệch:', " {t('adminReports.variance')}"],
    ['Tăng trưởng: +', "{t('adminReports.growth')}"],
    ['"Sụt giảm: "', "t('adminReports.decline')"]
];

for (const [search, replace] of cardReplacements) {
    cardContent = cardContent.split(search).join(replace);
}

fs.writeFileSync(cardFile, cardContent);
console.log('RevenueComparisonCard translations applied.');
