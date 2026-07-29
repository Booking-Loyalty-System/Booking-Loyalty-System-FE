const fs = require('fs');

const enFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/en/customer.json';
const viFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/vi/customer.json';

function addTranslation(file, key, data) {
    let content = JSON.parse(fs.readFileSync(file, 'utf8'));
    content.staffDashboard[key] = data;
    fs.writeFileSync(file, JSON.stringify(content, null, 2));
}

const actionsEn = {
    "confirm": "Confirm",
    "cancel": "Cancel",
    "checkIn": "Check-in",
    "noShow": "No Show",
    "images": "Images",
    "checkout": "Checkout",
    "licensePlateLabel": "Plate: "
};

const actionsVi = {
    "confirm": "Xác nhận",
    "cancel": "Hủy",
    "checkIn": "Check-in",
    "noShow": "Vắng",
    "images": "Ảnh",
    "checkout": "Thanh toán",
    "licensePlateLabel": "BSX: "
};

addTranslation(enFile, 'rowActions', actionsEn);
addTranslation(viFile, 'rowActions', actionsVi);
console.log('JSON updated for BookingTableRow');
