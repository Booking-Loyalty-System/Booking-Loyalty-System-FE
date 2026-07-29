const fs = require('fs');

const enFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/en/customer.json';
const viFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/vi/customer.json';

function addTranslation(file, key, data) {
    let content = fs.readFileSync(file, 'utf8');
    const obj = JSON.parse(content);
    obj[key] = data;
    fs.writeFileSync(file, JSON.stringify(obj, null, 2));
}

const adminPromotionsEn = {
    "deleteConfirm": "Are you sure you want to delete this promotion?",
    "title": "Promotions",
    "subtitle": "Create and manage discount codes, marketing campaigns",
    "addPromotion": "Add Promotion",
    "activeCount": "Active",
    "totalUsed": "Total Uses",
    "totalPromotions": "Total Promotions",
    "loading": "Loading promotions...",
    "codeDesc": "Code / Description",
    "discountType": "Type",
    "value": "Value",
    "status": "Status",
    "uses": "Uses",
    "expires": "Expires",
    "actions": "Actions",
    "percentage": "Percentage",
    "fixedAmount": "Fixed Amount",
    "active": "Active",
    "inactive": "Inactive",
    "unlimited": "Unlimited",
    "editPromotion": "Edit Promotion",
    "promoCode": "Promo Code",
    "descPlaceholder": "Detailed promotion description...",
    "discountValue": "Discount Value",
    "startDate": "Start Date",
    "endDate": "End Date",
    "maxUses": "Max Uses",
    "leaveEmptyUnlimited": "Leave empty for unlimited",
    "minSpend": "Min Spend (đ)",
    "leaveEmptyNoRequirement": "Leave empty if no requirement",
    "saving": "Saving...",
    "createPromotion": "Create Promotion",
    "saveChanges": "Save Changes",
    "percentageSuffix": "Percentage (%)",
    "fixedAmountSuffix": "Fixed Amount (đ)",
    "description": "Description"
};

const adminPromotionsVi = {
    "deleteConfirm": "Bạn có chắc muốn xóa khuyến mãi này?",
    "title": "Khuyến mãi",
    "subtitle": "Tạo và quản lý mã giảm giá, chiến dịch marketing",
    "addPromotion": "Thêm khuyến mãi",
    "activeCount": "Đang hoạt động",
    "totalUsed": "Tổng lượt sử dụng",
    "totalPromotions": "Tổng khuyến mãi",
    "loading": "Đang tải khuyến mãi...",
    "codeDesc": "Mã / Mô tả",
    "discountType": "Loại giảm",
    "value": "Giá trị",
    "status": "Trạng thái",
    "uses": "Lượt dùng",
    "expires": "Hết hạn",
    "actions": "Thao tác",
    "percentage": "Phần trăm",
    "fixedAmount": "Số tiền cố định",
    "active": "Hoạt động",
    "inactive": "Tắt",
    "unlimited": "Không giới hạn",
    "editPromotion": "Chỉnh sửa khuyến mãi",
    "promoCode": "Mã khuyến mãi",
    "descPlaceholder": "Mô tả chi tiết khuyến mãi...",
    "discountValue": "Giá trị giảm",
    "startDate": "Ngày bắt đầu",
    "endDate": "Ngày kết thúc",
    "maxUses": "Giới hạn lượt dùng",
    "leaveEmptyUnlimited": "Để trống = không giới hạn",
    "minSpend": "Chi tiêu tối thiểu (đ)",
    "leaveEmptyNoRequirement": "Để trống = không yêu cầu",
    "saving": "Đang lưu...",
    "createPromotion": "Tạo khuyến mãi",
    "saveChanges": "Lưu thay đổi",
    "percentageSuffix": "Phần trăm (%)",
    "fixedAmountSuffix": "Số tiền cố định (đ)",
    "description": "Mô tả"
};

addTranslation(enFile, 'adminPromotions', adminPromotionsEn);
addTranslation(viFile, 'adminPromotions', adminPromotionsVi);
console.log('Translations added.');
