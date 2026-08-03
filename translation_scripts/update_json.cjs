const fs = require('fs');

const enFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/en/customer.json';
const viFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/vi/customer.json';

function addTranslation(file, key, data) {
    let content = fs.readFileSync(file, 'utf8');
    const obj = JSON.parse(content);
    obj[key] = data;
    fs.writeFileSync(file, JSON.stringify(obj, null, 2));
}

const adminReportsEn = {
    "title": "Business Reports",
    "setupComparisonTitle": "Setup data comparison timeframe",
    "custom": "Custom",
    "byMonth": "By Month",
    "byQuarter": "By Quarter",
    "byYear": "By Year",
    "currentPeriodFrom": "Current Period (From date)",
    "currentPeriodTo": "Current Period (To date)",
    "comparePeriodFrom": "Compare Period (From date)",
    "comparePeriodTo": "Compare Period (To date)",
    "currentMonth": "Current Month",
    "compareMonth": "Compare Month",
    "currentQuarter": "Current Quarter",
    "compareQuarter": "Compare Quarter",
    "quarterPlaceholder": "Quarter {{q}}",
    "yearPlaceholder": "Year",
    "currentYear": "Current Year",
    "compareYear": "Compare Year",
    "loadingComparison": "Loading comparison data...",
    "monthYear": "Month {{month}} Year {{year}}",
    "quarterYear": "Quarter {{quarter}} Year {{year}}",
    "yearLabel": "Year {{year}}",
    "comparisonTitle": "Revenue Comparison",
    "comparisonSubtitle": "Compare revenue performance between two selected periods",
    "currentPeriodPrefix": "Current Period",
    "comparePeriodPrefix": "Compare Period",
    "variance": "Variance:",
    "growth": "Growth: +",
    "decline": "Decline: "
};

const adminReportsVi = {
    "title": "Báo Cáo Doanh Nghiệp",
    "setupComparisonTitle": "Thiết lập khoảng thời gian so sánh dữ liệu",
    "custom": "Tùy chỉnh",
    "byMonth": "Theo Tháng",
    "byQuarter": "Theo Quý",
    "byYear": "Theo Năm",
    "currentPeriodFrom": "Kỳ Hiện Tại (Từ ngày)",
    "currentPeriodTo": "Kỳ Hiện Tại (Đến ngày)",
    "comparePeriodFrom": "Kỳ Đối Chứng (Từ ngày)",
    "comparePeriodTo": "Kỳ Đối Chứng (Đến ngày)",
    "currentMonth": "Tháng Hiện Tại",
    "compareMonth": "Tháng Đối Chứng",
    "currentQuarter": "Quý Hiện Tại",
    "compareQuarter": "Quý Đối Chứng",
    "quarterPlaceholder": "Quý {{q}}",
    "yearPlaceholder": "Năm",
    "currentYear": "Năm Hiện Tại",
    "compareYear": "Năm Đối Chứng",
    "loadingComparison": "Đang tải dữ liệu đối soát...",
    "monthYear": "Tháng {{month}} năm {{year}}",
    "quarterYear": "Quý {{quarter}} năm {{year}}",
    "yearLabel": "Năm {{year}}",
    "comparisonTitle": "Đối Soát & So Sánh Doanh Thu",
    "comparisonSubtitle": "So sánh hiệu suất doanh thu giữa hai chu kỳ tùy chọn",
    "currentPeriodPrefix": "Kỳ hiện tại",
    "comparePeriodPrefix": "Kỳ đối chứng",
    "variance": "Biến động chênh lệch:",
    "growth": "Tăng trưởng: +",
    "decline": "Sụt giảm: "
};

addTranslation(enFile, 'adminReports', adminReportsEn);
addTranslation(viFile, 'adminReports', adminReportsVi);
console.log('Translations added.');
