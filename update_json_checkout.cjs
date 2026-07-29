const fs = require('fs');

const enFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/en/customer.json';
const viFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/vi/customer.json';

function addTranslation(file, key, data) {
    let content = JSON.parse(fs.readFileSync(file, 'utf8'));
    content.staffDashboard[key] = data;
    fs.writeFileSync(file, JSON.stringify(content, null, 2));
}

const en = {
    "title": "Payment Confirmation",
    "bookingCode": "Booking Code",
    "vehicleInfo": "Vehicle Info",
    "notUpdated": "Not updated",
    "service": "Service",
    "totalPayment": "Total Payment",
    "earnedPoints": "Earned Points",
    "autoCalc": "Calculated automatically after payment",
    "cancel": "Cancel",
    "checkout": "Checkout",
    "chooseMethod": "Choose payment method",
    "cash": "Cash",
    "processing": "Processing transaction...",
    "back": "Back"
};

const vi = {
    "title": "Xác Nhận Thanh Toán",
    "bookingCode": "Mã lịch đặt",
    "vehicleInfo": "Thông tin xe",
    "notUpdated": "Chưa cập nhật",
    "service": "Dịch vụ",
    "totalPayment": "Tổng thanh toán",
    "earnedPoints": "Điểm tích luỹ",
    "autoCalc": "Tính tự động sau khi thu tiền",
    "cancel": "Hủy bỏ",
    "checkout": "Thanh toán",
    "chooseMethod": "Chọn phương thức thanh toán",
    "cash": "Tiền mặt",
    "processing": "Đang xử lý giao dịch...",
    "back": "Quay lại"
};

addTranslation(enFile, 'checkoutModal', en);
addTranslation(viFile, 'checkoutModal', vi);
console.log('JSON updated for Checkout Modal');
