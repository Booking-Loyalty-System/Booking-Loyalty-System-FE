const fs = require('fs');
const enFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/en/customer.json';
const viFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/vi/customer.json';
function addKey(file, path, value) {
    let content = JSON.parse(fs.readFileSync(file, 'utf8'));
    content.staffDashboard.district9 = value;
    fs.writeFileSync(file, JSON.stringify(content, null, 2));
}
addKey(enFile, 'staffDashboard.district9', 'District 9 Branch');
addKey(viFile, 'staffDashboard.district9', 'Chi nhánh Quận 9');
