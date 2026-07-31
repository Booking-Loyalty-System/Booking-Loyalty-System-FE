const fs = require('fs');
const path = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/shared/utils/dynamicTranslator.ts';
let content = fs.readFileSync(path, 'utf8');

// Update translateNotificationTitle
if (!content.includes('lịch hẹn mới')) {
    content = content.replace(
        /if \(lowerTitle\.includes\("có đơn đặt lịch mới"\)\) \{/,
        'if (lowerTitle.includes("có đơn đặt lịch mới") || lowerTitle.includes("lịch hẹn mới")) {'
    );
}

// Update translateNotificationMessage
if (!content.includes('Khách hàng mới đã đặt lịch:')) {
    content = content.replace(
        /translated = translated\.replace\("Lịch đặt rửa xe của bạn".*\n/,
        'translated = translated.replace("Khách hàng mới đã đặt lịch:", t("dynamic.notifications.newCustomerBooked", { defaultValue: "New customer booked:" }));\n    translated = translated.replace("Gói:", t("dynamic.notifications.packageLabel", { defaultValue: "Package:" }));\n    translated = translated.replace(" lúc ", t("dynamic.notifications.atTimeLabel", { defaultValue: " at " }));\n    translated = translated.replace("Lịch đặt rửa xe của bạn", t("dynamic.notifications.yourBooking", { defaultValue: "Your booking" }));\n'
    );
}

fs.writeFileSync(path, content);
console.log('Updated dynamicTranslator.ts');
