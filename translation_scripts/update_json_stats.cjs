const fs = require('fs');

const enFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/en/customer.json';
const viFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/vi/customer.json';

function addTranslation(file, key, data) {
    let content = fs.readFileSync(file, 'utf8');
    const obj = JSON.parse(content);
    obj[key] = data;
    fs.writeFileSync(file, JSON.stringify(obj, null, 2));
}

const dashboardStatsEn = {
    "totalBookings": "Total Bookings",
    "completed": "Completed",
    "inProgress": "In Progress",
    "waiting": "Waiting (Queue)",
    "todayBookings": "Today's Bookings",
    "searchPlaceholder": "Code, vehicle name, license plate...",
    "allStatus": "All status",
    "pending": "Pending",
    "confirmed": "Confirmed",
    "checkedIn": "Checked In",
    "queued": "Queued",
    "completedStatus": "Completed",
    "checkedOut": "Checked Out",
    "cancelled": "Cancelled",
    "noShow": "No Show"
};

const dashboardStatsVi = {
    "totalBookings": "Tổng Lịch Đặt",
    "completed": "Đã Hoàn Thành",
    "inProgress": "Đang Thực Hiện",
    "waiting": "Đang Chờ (Queue)",
    "todayBookings": "Lịch Đặt Hôm Nay",
    "searchPlaceholder": "Mã, tên xe, biển số...",
    "allStatus": "Tất cả trạng thái",
    "pending": "Pending (Chờ xác nhận)",
    "confirmed": "Confirmed (Đã xác nhận)",
    "checkedIn": "Checked In (Đã tới)",
    "queued": "Queued (Chờ rửa)",
    "completedStatus": "Completed (Xong)",
    "checkedOut": "Checked Out (Đã thanh toán)",
    "cancelled": "Cancelled (Đã hủy)",
    "noShow": "No Show (Không đến)"
};

addTranslation(enFile, 'dashboardStats', dashboardStatsEn);
addTranslation(viFile, 'dashboardStats', dashboardStatsVi);
console.log('JSONs updated with dashboardStats');
