const fs = require('fs');

const enFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/en/customer.json';
const viFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/vi/customer.json';

function updateJson(file, isVi) {
    let content = JSON.parse(fs.readFileSync(file, 'utf8'));
    
    if (!content.dynamic) content.dynamic = {};
    if (!content.dynamic.notifications) content.dynamic.notifications = {};
    
    if (isVi) {
        content.dynamic.notifications.newCustomerBooked = "Khách hàng mới đã đặt lịch: ";
        content.dynamic.notifications.packageLabel = " - Gói: ";
        content.dynamic.notifications.atTimeLabel = " lúc ";
        // Also update title if needed
        content.dynamic.notifications.newBookingTitle = "Lịch hẹn mới";
    } else {
        content.dynamic.notifications.newCustomerBooked = "New customer booked: ";
        content.dynamic.notifications.packageLabel = " - Package: ";
        content.dynamic.notifications.atTimeLabel = " at ";
        content.dynamic.notifications.newBookingTitle = "New Booking";
    }

    fs.writeFileSync(file, JSON.stringify(content, null, 2));
}

updateJson(enFile, false);
updateJson(viFile, true);
console.log('JSON updated for dynamic notifications');
