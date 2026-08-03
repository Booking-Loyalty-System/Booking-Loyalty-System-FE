const fs = require('fs');

const enFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/en/customer.json';
const viFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/vi/customer.json';

function addKey(file, path, value) {
    let content = JSON.parse(fs.readFileSync(file, 'utf8'));
    content.dashboardStats.inProgressStatus = value;
    fs.writeFileSync(file, JSON.stringify(content, null, 2));
}

addKey(enFile, 'dashboardStats.inProgressStatus', 'In Progress');
addKey(viFile, 'dashboardStats.inProgressStatus', 'In Progress (Đang rửa)');

const filtersFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/components/customer/BookingTableFilters.tsx';
let filtersContent = fs.readFileSync(filtersFile, 'utf8');

filtersContent = filtersContent.replace(/>In Progress \(Đang rửa\)</g, ">{t('dashboardStats.inProgressStatus')}<");
fs.writeFileSync(filtersFile, filtersContent);

console.log('Fixed InProgress');
