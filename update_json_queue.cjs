const fs = require('fs');

const enFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/en/customer.json';
const viFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/core/i18n/locales/vi/customer.json';

function addTranslation(file, key, data) {
    let content = JSON.parse(fs.readFileSync(file, 'utf8'));
    content[key] = data;
    fs.writeFileSync(file, JSON.stringify(content, null, 2));
}

const queueMonitorEn = {
    "toast": {
        "bayMaintenance": "❌ {{bayName}} is under maintenance! Please select another bay.",
        "bayTypeMismatch": "❌ Rejected! {{bayName}} only supports sizes: {{supportedTypes}}. This vehicle belongs to [{{vehicleType}}].",
        "startWashSuccess": "🚀 Bay is available! Vehicle has started washing directly at {{bayName}}.",
        "startWashFail": "Cannot start washing vehicle, please check again.",
        "queueWashSuccess": "⏳ Bay is occupied! Vehicle added to the separate queue of {{bayName}}.",
        "queueWashFail": "Cannot add booking to the queue of this bay.",
        "finishWashSuccess": "🧼 Car wash completed and proof images saved!",
        "finishWashFail": "Failed to update completion status."
    },
    "title": "Queue Monitor",
    "subtitle": "Manage queues and live wash bay status",
    "searchPlaceholder": "Search by code, plate...",
    "stats": {
        "totalWaiting": "Total Waiting",
        "emptyBays": "Empty Bays",
        "avgWaitTime": "Avg Wait Time",
        "minutes": "mins"
    },
    "unassignedQueue": {
        "title": "Unassigned Queue",
        "vehicles": "{{count}} Cars",
        "noVehicles": "No new vehicles (Checked-in) to coordinate",
        "unknownCar": "Unknown Car",
        "standardWash": "Standard Wash",
        "waitMins": "Wait {{time}}m"
    },
    "bayStatus": {
        "title": "Wash Bay Status (Click to view private queue)",
        "loading": "Loading wash bay data...",
        "noBays": "No wash bays configured yet",
        "waitingCars": "Waiting: {{count}} cars",
        "maintenance": "MAINTENANCE",
        "occupied": "OCCUPIED",
        "available": "AVAILABLE",
        "maintenanceTitle": "Bay Under Maintenance",
        "maintenanceDesc": "Cannot assign vehicles to this bay temporarily",
        "washingTitle": "Washing in Progress",
        "remainingMins": "Left {{time}}m",
        "complete": "Complete",
        "readyTitle": "Bay is Ready",
        "readyDesc": "Drag & drop a vehicle here or click to check schedule."
    },
    "suggestion": {
        "title": "Hey boss, there's an empty bay!",
        "desc1": "You are assigning a car to",
        "desc2": "(which is busy).",
        "foundPlate": "The system found that car plate",
        "foundGroup": "(group",
        "foundCanStart": ") can start washing immediately at:",
        "statusEmpty": "Status: Empty",
        "washNow": "Wash Now",
        "decline": "Skip, keep it in {{bayName}}",
        "accept": "Switch to empty bay"
    },
    "bayDetail": {
        "subtitle": "Private queue and coordination for this bay",
        "waitingHere": "Cars Waiting Here",
        "totalProcessTime": "Total Processing Time",
        "carsCount": "{{count}} cars",
        "waitMins": "wait mins",
        "carsInside": "Car Inside Bay",
        "remainingMins": "Left {{time}}m",
        "finishNow": "Finish now",
        "bayEmpty": "Bay is currently empty! Ready to start the next car.",
        "nextQueue": "Next Private Queue ({{count}})",
        "noQueue": "No cars waiting in this bay's queue.",
        "waitApprox": "Wait ~{{time}}m",
        "startWash": "Start Wash"
    }
};

const queueMonitorVi = {
    "toast": {
        "bayMaintenance": "❌ {{bayName}} đang bảo trì! Vui lòng chọn khoang khác.",
        "bayTypeMismatch": "❌ Khước từ! {{bayName}} chỉ hỗ trợ kích cỡ: {{supportedTypes}}. Xe này thuộc nhóm [{{vehicleType}}].",
        "startWashSuccess": "🚀 Khoang trống! Xe đã bắt đầu rửa trực tiếp tại {{bayName}}.",
        "startWashFail": "Không thể bắt đầu rửa xe, vui lòng kiểm tra lại.",
        "queueWashSuccess": "⏳ Khoang bận! Đã đưa xe vào hàng đợi riêng của {{bayName}}.",
        "queueWashFail": "Không thể xếp lịch vào hàng đợi của khoang này.",
        "finishWashSuccess": "🧼 Rửa xe hoàn tất và đã lưu ảnh minh chứng!",
        "finishWashFail": "Cập nhật trạng thái hoàn thành thất bại."
    },
    "title": "Queue Monitor",
    "subtitle": "Quản lý hàng đợi và trạng thái khoang rửa trực tiếp",
    "searchPlaceholder": "Tìm xe theo mã, biển số...",
    "stats": {
        "totalWaiting": "Tổng Xe Đang Chờ",
        "emptyBays": "Khoang Trống",
        "avgWaitTime": "TG Chờ TB",
        "minutes": "phút"
    },
    "unassignedQueue": {
        "title": "Unassigned Queue",
        "vehicles": "{{count}} Xe",
        "noVehicles": "Không có xe mới (Checked-in) cần điều phối",
        "unknownCar": "Unknown Car",
        "standardWash": "Standard Wash",
        "waitMins": "Đợi {{time}}p"
    },
    "bayStatus": {
        "title": "Wash Bay Status (Bấm vào để xem hàng đợi riêng)",
        "loading": "Đang tải dữ liệu khoang rửa...",
        "noBays": "Chưa có khoang rửa nào được cấu hình",
        "waitingCars": "Đang đợi: {{count}} xe",
        "maintenance": "MAINTENANCE",
        "occupied": "OCCUPIED",
        "available": "AVAILABLE",
        "maintenanceTitle": "Khoang Đang Bảo Trì",
        "maintenanceDesc": "Tạm thời không thể xếp xe vào khoang này",
        "washingTitle": "Xe Đang Rửa Trực Tiếp",
        "remainingMins": "Còn {{time}}p",
        "complete": "Hoàn Thành",
        "readyTitle": "Khoang Sẵn Sàng",
        "readyDesc": "Kéo thả xe từ hàng chờ chung vào đây hoặc click để kiểm tra lịch."
    },
    "suggestion": {
        "title": "Có khoang trống kìa sếp!",
        "desc1": "Bạn đang xếp xe vào",
        "desc2": "(đang bận rộn).",
        "foundPlate": "Hệ thống thấy xe biển số",
        "foundGroup": "(nhóm",
        "foundCanStart": ") có thể được bắt đầu rửa ngay lập tức tại:",
        "statusEmpty": "Trạng thái: Đang trống",
        "washNow": "Rửa Luôn",
        "decline": "Bỏ qua, cứ xếp vào {{bayName}}",
        "accept": "Chuyển sang khoang trống"
    },
    "bayDetail": {
        "subtitle": "Hàng đợi và điều phối rửa xe riêng tại khoang",
        "waitingHere": "Xe Đang Chờ Tại Khoang",
        "totalProcessTime": "Tổng Thời Gian Giải Quyết",
        "carsCount": "{{count}} xe",
        "waitMins": "phút chờ",
        "carsInside": "Xe Đang Trong Khoang",
        "remainingMins": "Còn {{time}}p",
        "finishNow": "Hoàn thành ngay",
        "bayEmpty": "Khoang hiện đang trống! Sẵn sàng bấm Bắt đầu rửa cho xe kế tiếp.",
        "nextQueue": "Hàng Đợi Riêng Kế Tiếp ({{count}})",
        "noQueue": "Không có xe nào xếp hàng chờ riêng tại khoang này.",
        "waitApprox": "Đợi ~{{time}}p",
        "startWash": "Bắt Đầu Rửa"
    }
};

addTranslation(enFile, 'queueMonitor', queueMonitorEn);
addTranslation(viFile, 'queueMonitor', queueMonitorVi);
console.log('JSONs updated with queueMonitor');
