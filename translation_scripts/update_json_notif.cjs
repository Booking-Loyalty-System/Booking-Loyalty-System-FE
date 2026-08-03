const fs = require('fs');

const enFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/en/customer.json';
const viFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/vi/customer.json';

function addTranslation(file, key, data) {
    let content = JSON.parse(fs.readFileSync(file, 'utf8'));
    content.notifications[key] = data;
    fs.writeFileSync(file, JSON.stringify(content, null, 2));
}

addTranslation(enFile, 'unreadCount', "{{count}} unread notifications");
addTranslation(enFile, 'allCaughtUp', "You are all caught up!");

addTranslation(viFile, 'unreadCount', "{{count}} thông báo chưa đọc");
addTranslation(viFile, 'allCaughtUp', "Bạn đã xem hết thông báo!");

console.log('JSON updated for Notifications');
