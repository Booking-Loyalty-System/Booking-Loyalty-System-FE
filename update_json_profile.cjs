const fs = require('fs');

const enFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/en/customer.json';
const viFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/vi/customer.json';

function addTranslation(file, key, data) {
    let content = JSON.parse(fs.readFileSync(file, 'utf8'));
    content[key] = data;
    fs.writeFileSync(file, JSON.stringify(content, null, 2));
}

const profileEn = {
    "fetchProfileError": "Cannot load staff information.",
    "notFound": "Staff information not found.",
    "loading": "Loading information...",
    "title": "My Profile",
    "subtitle": "View your account information and manage your password.",
    "status": {
        "available": "Available",
        "unavailable": "Unavailable"
    },
    "personalInfo": {
        "title": "Personal Information",
        "fullName": "Full Name",
        "email": "Email",
        "phoneNumber": "Phone Number",
        "role": "Role",
        "branch": "Branch",
        "branchAddress": "Branch Address",
        "notUpdated": "Not updated",
        "noBranch": "No branch assigned",
        "noAddress": "No address available"
    },
    "password": {
        "title": "Change Password",
        "subtitle": "Update your account password",
        "enterAll": "Please enter all fields.",
        "notMatch": "Password confirmation does not match.",
        "sameAsCurrent": "New password must be different from current password.",
        "success": "Password changed successfully.",
        "fail": "Failed to change password. Please check your current password.",
        "current": "Current Password",
        "new": "New Password",
        "confirm": "Confirm New Password",
        "updating": "Updating...",
        "button": "Change Password"
    }
};

const profileVi = {
    "fetchProfileError": "Không thể tải thông tin nhân viên.",
    "notFound": "Không tìm thấy thông tin nhân viên.",
    "loading": "Đang tải thông tin...",
    "title": "Hồ sơ của tôi",
    "subtitle": "Xem thông tin tài khoản và quản lý mật khẩu của bạn.",
    "status": {
        "available": "Đang rảnh",
        "unavailable": "Bận"
    },
    "personalInfo": {
        "title": "Thông Tin Cá Nhân",
        "fullName": "Họ và Tên",
        "email": "Email",
        "phoneNumber": "Số điện thoại",
        "role": "Vai trò",
        "branch": "Chi nhánh",
        "branchAddress": "Địa chỉ chi nhánh",
        "notUpdated": "Chưa cập nhật",
        "noBranch": "Chưa phân chi nhánh",
        "noAddress": "Chưa có địa chỉ"
    },
    "password": {
        "title": "Đổi Mật Khẩu",
        "subtitle": "Cập nhật mật khẩu tài khoản",
        "enterAll": "Vui lòng nhập đầy đủ thông tin.",
        "notMatch": "Mật khẩu xác nhận không khớp.",
        "sameAsCurrent": "Mật khẩu mới phải khác mật khẩu hiện tại.",
        "success": "Đổi mật khẩu thành công.",
        "fail": "Không thể đổi mật khẩu. Vui lòng kiểm tra mật khẩu hiện tại.",
        "current": "Mật khẩu hiện tại",
        "new": "Mật khẩu mới",
        "confirm": "Xác nhận mật khẩu mới",
        "updating": "Đang cập nhật...",
        "button": "Đổi Mật Khẩu"
    }
};

addTranslation(enFile, 'staffProfile', profileEn);
addTranslation(viFile, 'staffProfile', profileVi);
console.log('JSON updated for Staff Profile');
