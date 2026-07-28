/**
 * Hàm dịch dữ liệu động từ BE trả về
 * @param beValue Giá trị chuỗi tĩnh từ BE (VD: "Premium Wash", "Pending")
 * @param category Phân loại dữ liệu (VD: 'package', 'status', 'tier')
 * @param t Hàm translate (t) của i18n
 * @param fallbackValue Giá trị dự phòng nếu không tìm thấy (Mặc định là beValue)
 */
export const translateDynamic = (beValue: string | undefined | null, category: 'package' | 'packageDesc' | 'status' | 'tier' | 'feature', t: any, fallbackValue?: string) => {
    if (!beValue) return "";

    // Từ điển ánh xạ (Map)
    const dictionary: Record<string, Record<string, string>> = {
        package: {
            "Basic Wash": "dynamic.packages.basic",
            "Premium Wash": "dynamic.packages.premium",
            "Deluxe Wash": "dynamic.packages.deluxe",
            "Interior Detailing": "dynamic.packages.interior",
            "Full Detailing": "dynamic.packages.full",
            "VIP Detailing": "dynamic.packages.vip"
        },
        packageDesc: {
            "Basic Wash": "dynamic.packageDesc.basic",
            "Premium Wash": "dynamic.packageDesc.premium",
            "Deluxe Wash": "dynamic.packageDesc.deluxe",
            "Interior Detailing": "dynamic.packageDesc.interior",
            "Full Detailing": "dynamic.packageDesc.full",
            "VIP Detailing": "dynamic.packageDesc.vip"
        },
        feature: {
            "Exterior wash": "dynamic.features.exteriorWash",
            "Tire cleaning": "dynamic.features.tireCleaning",
            "Window cleaning": "dynamic.features.windowCleaning",
            "Interior vacuum": "dynamic.features.interiorVacuum",
            "Dashboard polish": "dynamic.features.dashboardPolish",
            "Tire shine": "dynamic.features.tireShine",
            "Air freshener": "dynamic.features.airFreshener",
            "Full exterior wash": "dynamic.features.fullExteriorWash",
            "Interior deep clean": "dynamic.features.interiorDeepClean",
            "Wax coating": "dynamic.features.waxCoating",
            "Leather conditioning": "dynamic.features.leatherConditioning",
            "Engine bay cleaning": "dynamic.features.engineBayCleaning",
            "Ceramic spray": "dynamic.features.ceramicSpray"
        },
        status: {
            "Pending": "dynamic.status.pending",
            "Queued": "dynamic.status.queued",
            "InProgress": "dynamic.status.inProgress",
            "Completed": "dynamic.status.completed",
            "Cancelled": "dynamic.status.cancelled"
        },
        tier: {
            "Member": "dynamic.tiers.member",
            "Silver": "dynamic.tiers.silver",
            "Gold": "dynamic.tiers.gold",
            "Platinum": "dynamic.tiers.platinum",
            "Diamond": "dynamic.tiers.diamond"
        }
    };

    const translationKey = dictionary[category]?.[beValue];

    // Nếu tìm thấy key trong từ điển -> Dịch. Nếu không -> Trả về y nguyên chữ của BE (hoặc fallback)
    return translationKey ? t(translationKey, { defaultValue: fallbackValue ?? beValue }) : (fallbackValue ?? beValue);
};

export const translateNotificationTitle = (title: string, t: any) => {
    if (!title) return "";
    const lowerTitle = title.trim().toLowerCase();

    if (lowerTitle.includes("cập nhật trạng thái lịch rửa xe")) {
        return t("dynamic.notifications.statusUpdateTitle", { defaultValue: title });
    }
    if (lowerTitle.includes("có đơn đặt lịch mới")) {
        return t("dynamic.notifications.newBookingTitle", { defaultValue: title });
    }
    if (lowerTitle.includes("nhắc nhở lịch rửa xe")) {
        return t("dynamic.notifications.reminderTitle", { defaultValue: title });
    }
    if (lowerTitle.includes("quà tặng tri ân độc quyền")) {
        return t("dynamic.notifications.exclusiveGiftTitle", { defaultValue: title });
    }
    
    return title;
};

export const translateNotificationMessage = (message: string, t: any) => {
    if (!message) return "";
    let translated = message;

    // Dịch các trạng thái tiếng Việt/Anh sang ngôn ngữ hiện tại
    const statusMap = {
        "Đang chờ xử lý": t("dynamic.status.pending", { defaultValue: "Pending" }),
        "Đang xếp hàng": t("dynamic.status.queued", { defaultValue: "Queued" }),
        "Đang rửa xe": t("dynamic.status.inProgress", { defaultValue: "In Progress" }),
        "Đã hoàn thành": t("dynamic.status.completed", { defaultValue: "Completed" }),
        "Đã hủy": t("dynamic.status.cancelled", { defaultValue: "Cancelled" }),
        "Đã Check-in": t("dynamic.status.checkedIn", { defaultValue: "Checked In" }),
        "Đã Check-out": t("dynamic.status.checkedOut", { defaultValue: "Checked Out" }),
        "Pending": t("dynamic.status.pending", { defaultValue: "Pending" }),
        "Queued": t("dynamic.status.queued", { defaultValue: "Queued" }),
        "InProgress": t("dynamic.status.inProgress", { defaultValue: "In Progress" }),
        "Completed": t("dynamic.status.completed", { defaultValue: "Completed" }),
        "Cancelled": t("dynamic.status.cancelled", { defaultValue: "Cancelled" }),
        "CheckedIn": t("dynamic.status.checkedIn", { defaultValue: "Checked In" }),
        "CheckedOut": t("dynamic.status.checkedOut", { defaultValue: "Checked Out" })
    };

    // Dịch các cụm từ phổ biến trong thông báo BE (thay thế dài nhất trước để tránh lỗi)
    translated = translated.replace("Lịch đặt rửa xe của bạn", t("dynamic.notifications.yourBooking", { defaultValue: "Your booking" }));
    translated = translated.replace("Lịch đặt", t("dynamic.notifications.bookingWord", { defaultValue: "Booking" }));
    
    translated = translated.replace("của bạn đã chuyển sang", t("dynamic.notifications.hasChangedTo", { defaultValue: "has changed to" }));
    translated = translated.replace("đã được cập nhật sang trạng thái", t("dynamic.notifications.hasBeenUpdatedTo", { defaultValue: "has been updated to" }));
    translated = translated.replace("đã được cập nhật trạng thái thành", t("dynamic.notifications.hasBeenUpdatedTo", { defaultValue: "has been updated to" }));
    
    translated = translated.replace("trạng thái:", t("dynamic.notifications.statusLabel", { defaultValue: "status:" }));
    translated = translated.replace("status:", t("dynamic.notifications.statusLabel", { defaultValue: "status:" }));
    
    translated = translated.replace("mã đơn", t("dynamic.notifications.bookingCodeLabel", { defaultValue: "code" }));

    // Thay thế trạng thái
    Object.entries(statusMap).forEach(([statusKey, localizedStatus]) => {
        translated = translated.replace(statusKey, localizedStatus as string);
    });

    return translated;
};

export const removeVietnameseTones = (str: string) => {
    let result = str;
    result = result.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    result = result.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    result = result.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    result = result.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    result = result.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    result = result.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    result = result.replace(/đ/g,"d");
    result = result.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    result = result.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    result = result.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    result = result.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    result = result.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    result = result.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    result = result.replace(/Đ/g, "D");
    return result;
};

export const translateBranchName = (branchName: string, i18n: any) => {
    if (!branchName) return "";
    if (i18n.language !== 'en') return branchName;

    let translated = branchName;
    
    // Dịch các từ phổ biến
    translated = translated.replace(/Chi nhánh/gi, 'Branch');
    translated = translated.replace(/Quận/gi, 'District');
    translated = translated.replace(/Thành phố|TP/gi, 'City');
    translated = translated.replace(/Phường/gi, 'Ward');

    // Chỉnh lại ngữ pháp "Branch District 9" -> "District 9 Branch"
    if (translated.match(/Branch District (\w+)/i)) {
        translated = translated.replace(/Branch District (\w+)/i, 'District $1 Branch');
    } else if (translated.match(/Branch (.*)/i)) {
        // "Branch Thu Duc" -> "Thu Duc Branch"
        translated = translated.replace(/Branch (.*)/i, '$1 Branch');
    }

    return removeVietnameseTones(translated);
};

export const translateAddress = (address: string, i18n: any) => {
    if (!address) return "";
    if (i18n.language !== 'en') return address;

    let translated = address;

    translated = translated.replace(/Phường/gi, 'Ward');
    translated = translated.replace(/Quận/gi, 'District');
    translated = translated.replace(/Thành phố/gi, 'City');
    translated = translated.replace(/TP\./gi, 'City ');
    translated = translated.replace(/TP /gi, 'City ');
    translated = translated.replace(/Khu phố/gi, 'Quarter');
    translated = translated.replace(/Tổ/gi, 'Group');
    translated = translated.replace(/Đường/gi, 'Street');
    
    translated = translated.replace(/Hồ Chí Minh/gi, 'Ho Chi Minh');
    translated = translated.replace(/City Ho Chi Minh/gi, 'Ho Chi Minh City');

    return removeVietnameseTones(translated);
};

export const translatePromotion = (promoDesc: string, i18n: any) => {
    if (!promoDesc) return "";

    let translated = promoDesc;

    // Handle "Đẳng cấp Diamond" specifically based on language
    if (i18n.language === 'en') {
        translated = translated.replace(/Đẳng cấp Diamond/gi, 'Diamond tier privilege');
        translated = translated.replace(/Đẳng cấp Vàng/gi, 'Gold tier privilege');
        translated = translated.replace(/Đẳng cấp Gold/gi, 'Gold tier privilege');
    } else {
        translated = translated.replace(/Đẳng cấp Diamond/gi, 'Đặc quyền hạng Kim Cương');
        translated = translated.replace(/Đẳng cấp Vàng/gi, 'Đặc quyền hạng Vàng');
        translated = translated.replace(/Đẳng cấp Gold/gi, 'Đặc quyền hạng Vàng');
    }

    // Xóa chữ "Đẳng cấp" ở cả 2 ngôn ngữ NGAY TỪ ĐẦU (nếu còn sót)
    translated = translated.replace(/Đẳng cấp /gi, '');
    translated = translated.replace(/Đẳng cấp/gi, '');

    if (i18n.language === 'en') {
        translated = translated.replace(/tối đa đặc quyền Kim Cương/gi, 'max Diamond tier privilege');
        translated = translated.replace(/đặc quyền Kim Cương/gi, 'Diamond tier privilege');
        translated = translated.replace(/tối đa đặc quyền/gi, 'max tier privilege');
        
        translated = translated.replace(/cho toàn bộ hóa đơn tại/gi, 'for all orders at');
        translated = translated.replace(/cho toàn bộ hóa đơn/gi, 'for all orders');
        
        // Tận dụng hàm dịch địa chỉ/chi nhánh để dịch tiếp phần Quận/Huyện phía sau
        translated = translateAddress(translated, i18n);
    } else {
        // Tiếng Việt: Chỉnh lại format cho đẹp, giữ nguyên chữ viết hoa
        translated = translated.replace(/đặc quyền Kim Cương/gi, 'Đặc quyền hạng Kim Cương');
    }

    return translated;
};

