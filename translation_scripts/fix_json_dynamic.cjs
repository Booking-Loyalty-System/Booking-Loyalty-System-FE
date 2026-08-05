const fs = require('fs');

const enFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/en/customer.json';
const viFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/vi/customer.json';

function fixJson(file, isVi) {
    let content = JSON.parse(fs.readFileSync(file, 'utf8'));
    
    if (isVi) {
        content.dynamic.notifications.newCustomerBooked = "Khách hàng mới đã đặt lịch:";
        content.dynamic.notifications.packageLabel = "Gói:";
        content.dynamic.notifications.atTimeLabel = " lúc ";
    } else {
        content.dynamic.notifications.newCustomerBooked = "New customer booked:";
        content.dynamic.notifications.packageLabel = "Package:";
        content.dynamic.notifications.atTimeLabel = " at ";
    }

    fs.writeFileSync(file, JSON.stringify(content, null, 2));
}

fixJson(enFile, false);
fixJson(viFile, true);
console.log('Fixed JSON labels');
