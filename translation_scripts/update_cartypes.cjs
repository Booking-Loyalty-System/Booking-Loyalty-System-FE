const fs = require('fs');
const enFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/en/customer.json';
const viFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/vi/customer.json';
function addKey(file, path, value) {
    let content = JSON.parse(fs.readFileSync(file, 'utf8'));
    content.queueMonitor.carTypes = value;
    fs.writeFileSync(file, JSON.stringify(content, null, 2));
}

addKey(enFile, 'queueMonitor.carTypes', {
    "small": "Small",
    "medium": "Medium",
    "large": "Large",
    "suv": "SUV",
    "truck": "Truck",
    "van": "Van"
});

addKey(viFile, 'queueMonitor.carTypes', {
    "small": "Nhỏ",
    "medium": "Vừa",
    "large": "Lớn",
    "suv": "SUV",
    "truck": "Bán tải",
    "van": "Xe tải van"
});

console.log('Added carTypes to queueMonitor');
