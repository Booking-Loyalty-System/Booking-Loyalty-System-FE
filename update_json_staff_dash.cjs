const fs = require('fs');

const enFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/en/customer.json';
const viFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/vi/customer.json';

function addTranslation(file, key, data) {
    let content = fs.readFileSync(file, 'utf8');
    const obj = JSON.parse(content);
    obj[key] = data;
    fs.writeFileSync(file, JSON.stringify(obj, null, 2));
}

const staffDashboardEn = {
    "toast": {
        "validatingQr": "Validating QR code...",
        "foundBooking": "Found booking: {{code}}",
        "extractError": "Could not extract booking code from QR.",
        "invalidQr": "Invalid QR code or not in the system!",
        "fetchImagesError": "Could not load images for this vehicle.",
        "checkinSuccess": "Images confirmed and Check-in successful!",
        "checkinFail": "Check-in status update failed.",
        "actionSuccess": "Operation successful!",
        "noStaffInfo": "Staff information not found, please reload the page!",
        "promptCancelReason": "Please enter the reason for cancellation:",
        "confirmNoShow": "Are you sure you want to mark this customer as No-Show?",
        "actionFail": "Operation failed",
        "cashSuccess": "Cash payment successful! Please upload handover images.",
        "cashFail": "Cash payment processing failed",
        "initPayOs": "Initializing PayOS payment gateway...",
        "noServerResponse": "No response received from the server",
        "payOsConnectFail": "Could not connect to PayOS payment gateway",
        "paymentSuccess": "Payment successful!",
        "paymentCancel": "Payment cancelled!",
        "paymentConfirmed": "Transaction has been confirmed.",
        "paymentExpired": "Payment link transaction was cancelled or expired."
    },
    "title": "Staff Dashboard",
    "subtitle": "Manage car wash bays and track today's work progress.",
    "hello": "Hello, ",
    "branch": "Branch",
    "syncingData": "Syncing data...",
    "noBookingsFound": "No bookings found",
    "tryChangingFilters": "Try changing the filters or selecting another date.",
    "table": {
        "code": "Code",
        "customerVehicle": "Customer & Vehicle",
        "service": "Service",
        "status": "Status",
        "actions": "Actions"
    },
    "bookingDetails": {
        "title": "Booking Details",
        "code": "Code: ",
        "licensePlate": "License Plate",
        "vehicleType": "Vehicle Type",
        "service": "Service:",
        "timeSlot": "Time Slot:",
        "status": "Status:",
        "cancelReason": "Cancel reason",
        "close": "Close"
    },
    "images": {
        "title": "Vehicle Images: ",
        "licensePlate": "License Plate: ",
        "loading": "Loading images from server...",
        "beforeWash": "Before Wash (Check-in)",
        "noBeforeImages": "No check-in images for this vehicle.",
        "afterWash": "After Wash (Handover)",
        "noAfterImages": "No handover images for this vehicle.",
        "close": "Close",
        "previewZoom": "Preview Zoom"
    }
};

const staffDashboardVi = {
    "toast": {
        "validatingQr": "Đang xác thực mã QR...",
        "foundBooking": "Đã tìm thấy lịch đặt: {{code}}",
        "extractError": "Không thể trích xuất mã lịch đặt từ mã QR.",
        "invalidQr": "Mã QR không hợp lệ hoặc không có trong hệ thống!",
        "fetchImagesError": "Không thể tải hình ảnh của xe này.",
        "checkinSuccess": "Đã xác nhận ảnh và Check-in thành công!",
        "checkinFail": "Cập nhật trạng thái Check-in thất bại.",
        "actionSuccess": "Thao tác thành công!",
        "noStaffInfo": "Không tìm thấy thông tin nhân viên, vui lòng tải lại trang!",
        "promptCancelReason": "Vui lòng nhập lý do hủy lịch:",
        "confirmNoShow": "Bạn có chắc chắn muốn đánh dấu khách này là Không Đến (No-Show)?",
        "actionFail": "Thao tác thất bại",
        "cashSuccess": "Thanh toán tiền mặt thành công! Vui lòng tải ảnh bàn giao xe.",
        "cashFail": "Xử lý thu tiền mặt thất bại",
        "initPayOs": "Đang khởi tạo cổng thanh toán PayOS...",
        "noServerResponse": "Không nhận được phản hồi từ máy chủ",
        "payOsConnectFail": "Không thể kết nối đến cổng thanh toán PayOS",
        "paymentSuccess": "Thanh toán thành công!",
        "paymentCancel": "Hủy thanh toán!",
        "paymentConfirmed": "Giao dịch đã được xác nhận.",
        "paymentExpired": "Giao dịch link thanh toán đã bị hủy bỏ hoặc hết hạn."
    },
    "title": "Staff Dashboard",
    "subtitle": "Quản lý trạm rửa xe và theo dõi tiến độ công việc hôm nay.",
    "hello": "Xin chào, ",
    "branch": "Chi nhánh",
    "syncingData": "Đang đồng bộ dữ liệu...",
    "noBookingsFound": "Không tìm thấy lịch đặt nào",
    "tryChangingFilters": "Thử thay đổi bộ lọc hoặc chọn ngày khác xem sao nhé.",
    "table": {
        "code": "Mã Code",
        "customerVehicle": "Khách & Xe",
        "service": "Dịch vụ",
        "status": "Trạng thái",
        "actions": "Thao tác"
    },
    "bookingDetails": {
        "title": "Chi Tiết Lịch Đặt",
        "code": "Mã: ",
        "licensePlate": "Biển số xe",
        "vehicleType": "Dòng xe",
        "service": "Dịch vụ:",
        "timeSlot": "Khung giờ:",
        "status": "Trạng thái:",
        "cancelReason": "Lý do hủy",
        "close": "Đóng"
    },
    "images": {
        "title": "Hình ảnh xe: ",
        "licensePlate": "Biển số: ",
        "loading": "Đang tải hình ảnh từ máy chủ...",
        "beforeWash": "Ảnh Trước Khi Rửa (Check-in)",
        "noBeforeImages": "Chưa có ảnh check-in cho xe này.",
        "afterWash": "Ảnh Sau Khi Rửa (Hoàn thành)",
        "noAfterImages": "Chưa có ảnh bàn giao cho xe này.",
        "close": "Đóng",
        "previewZoom": "Preview Phóng to"
    }
};

addTranslation(enFile, 'staffDashboard', staffDashboardEn);
addTranslation(viFile, 'staffDashboard', staffDashboardVi);
console.log('JSONs updated with staffDashboard');
