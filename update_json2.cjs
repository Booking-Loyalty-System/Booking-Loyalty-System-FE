const fs = require('fs');

const enFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/en/customer.json';
const viFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/vi/customer.json';

function appendKeys(file, isVietnamese) {
    let content = fs.readFileSync(file, 'utf8');
    const obj = JSON.parse(content);
    
    obj.adminReports.subtitle = isVietnamese ? "Cung cấp cái nhìn toàn diện và đối soát tài chính doanh nghiệp" : "Comprehensive business insights and financial comparisons";
    obj.adminReports.exportPDF = isVietnamese ? "Xuất PDF" : "Export PDF";
    obj.adminReports.exportExcel = isVietnamese ? "Xuất Excel" : "Export Excel";

    fs.writeFileSync(file, JSON.stringify(obj, null, 2));
}

appendKeys(enFile, false);
appendKeys(viFile, true);
console.log('JSONs updated');
