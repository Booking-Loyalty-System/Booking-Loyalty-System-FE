const fs = require('fs');

const reportsFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/pages/admin/AdminReports.tsx';
let reportsContent = fs.readFileSync(reportsFile, 'utf8');

const reportsReplacements = [
    ['>Comprehensive business insights and financial comparisons<', ">{t('adminReports.subtitle')}<"],
    ['> Export PDF', "> {t('adminReports.exportPDF')}"],
    ['> Export Excel', "> {t('adminReports.exportExcel')}"]
];

for (const [search, replace] of reportsReplacements) {
    reportsContent = reportsContent.split(search).join(replace);
}

fs.writeFileSync(reportsFile, reportsContent);
console.log('Extra AdminReports translations applied.');
