const fs = require('fs');

const enFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/en/customer.json';
const viFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/vi/customer.json';

function addTranslation(file, key, data) {
    let content = fs.readFileSync(file, 'utf8');
    const obj = JSON.parse(content);
    obj[key] = data;
    fs.writeFileSync(file, JSON.stringify(obj, null, 2));
}

const staffSidebarEn = {
    "staffPortal": "Staff Portal",
    "operations": "Operations",
    "system": "System",
    "overview": "Overview",
    "queueMonitor": "Queue Monitor",
    "notifications": "Notifications",
    "profile": "Profile",
    "logout": "Logout"
};

const staffSidebarVi = {
    "staffPortal": "Cổng Nhân Viên",
    "operations": "Vận hành",
    "system": "Hệ thống",
    "overview": "Tổng quan",
    "queueMonitor": "Màn hình hàng chờ",
    "notifications": "Thông báo",
    "profile": "Hồ sơ cá nhân",
    "logout": "Đăng xuất"
};

addTranslation(enFile, 'staffSidebar', staffSidebarEn);
addTranslation(viFile, 'staffSidebar', staffSidebarVi);
console.log('JSON updated for staffSidebar');
