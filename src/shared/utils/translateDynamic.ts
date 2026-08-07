export const translateDynamic = (text: string | null | undefined, lang: string | null | undefined): string => {
    if (!text) return "";

    let translated = text;
    // Default to 'vi' if lang is missing to avoid crashes
    const isVi = (lang || 'vi').toLowerCase().startsWith('vi');

    // A robust regex piece for numbers with units like 100k, 50,000đ, 20%
    // Matches: 100k, 100 k, 50.000 đ, 20%, 50VND
    const numUnitPattern = `([\\d\\.,]+\\s*(?:k|đ|%|vnd|vnđ))`;

    if (isVi) {
        // --- ENGLISH TO VIETNAMESE ---
        // Longer patterns first
        translated = translated.replace(/Applies to bills meeting minimum conditions\./gi, 'Áp dụng cho các hóa đơn thỏa mãn điều kiện tối thiểu.');
        translated = translated.replace(/Redeem points for discount offers\./gi, 'Đổi điểm để nhận ưu đãi giảm giá.');
        translated = translated.replace(/Free Car Wash Reward/gi, 'Phần thưởng Rửa Xe Miễn Phí');
        translated = translated.replace(/Free VIP Car Wash Reward/gi, 'Thưởng Rửa xe VIP Miễn phí');
        translated = translated.replace(/Discount Voucher/gi, 'Voucher giảm giá');
        translated = translated.replace(/Special Voucher/gi, 'Voucher đặc biệt');
        translated = translated.replace(/\bBay\s+([A-Za-z0-9]+)/gi, 'Khoang rửa $1');
        translated = translated.replace(/\bBay\b/gi, 'Khoang rửa');

        // Numeric patterns (longer first)
        translated = translated.replace(new RegExp(`${numUnitPattern}\\s*off\\s+Voucher`, 'gi'), 'Voucher giảm $1');
        translated = translated.replace(new RegExp(`${numUnitPattern}\\s*Voucher`, 'gi'), 'Voucher $1');
        translated = translated.replace(new RegExp(`${numUnitPattern}\\s*off`, 'gi'), 'Giảm $1');

        // Phrases
        translated = translated.replace(/on next bill/gi, 'cho hóa đơn tiếp theo');
        translated = translated.replace(/for bills/gi, 'cho các hóa đơn');
        translated = translated.replace(/meeting minimum conditions/gi, 'thỏa mãn điều kiện tối thiểu');
        
        // Words
        translated = translated.replace(/Apply/gi, 'Áp dụng');
        translated = translated.replace(/offer/g, 'ưu đãi');
        translated = translated.replace(/Offer/g, 'Ưu đãi');
        translated = translated.replace(/\boff\b/gi, 'giảm');

    } else {
        // --- VIETNAMESE TO ENGLISH ---
        // Longer patterns first
        translated = translated.replace(/Áp dụng cho các hóa đơn thỏa mãn điều kiện tối thiểu\./gi, 'Applies to bills meeting minimum conditions.');
        translated = translated.replace(/Đổi điểm để nhận ưu đãi giảm giá\./gi, 'Redeem points for discount offers.');
        translated = translated.replace(/Phần thưởng Rửa Xe Miễn Phí/gi, 'Free Car Wash Reward');
        translated = translated.replace(/Thưởng Rửa xe VIP Miễn phí/gi, 'Free VIP Car Wash Reward');
        translated = translated.replace(/Voucher giảm giá/gi, 'Discount Voucher');
        translated = translated.replace(/Voucher đặc biệt/gi, 'Special Voucher');
        translated = translated.replace(/Khoang\s+rửa\s+([A-Za-z0-9]+)/gi, 'Bay $1');
        translated = translated.replace(/Khoang\s+rửa/gi, 'Bay');
        
        // Numeric patterns (longer first)
        translated = translated.replace(new RegExp(`Voucher\\s+giảm(?:\\s+giá)?\\s*${numUnitPattern}`, 'gi'), '$1 off Voucher');
        translated = translated.replace(new RegExp(`Voucher\\s*${numUnitPattern}`, 'gi'), '$1 Voucher');
        translated = translated.replace(new RegExp(`Giảm(?:\\s+giá)?\\s*${numUnitPattern}`, 'gi'), '$1 off');

        // Phrases
        translated = translated.replace(/cho hóa đơn tiếp theo/gi, 'on next bill');
        translated = translated.replace(/cho các hóa đơn/gi, 'for bills');
        translated = translated.replace(/thỏa mãn điều kiện tối thiểu/gi, 'meeting minimum conditions');
        
        // Words
        translated = translated.replace(/Áp dụng/gi, 'Apply');
        translated = translated.replace(/ưu đãi/gi, 'offer');
        translated = translated.replace(/Ưu đãi/gi, 'Offer');
        translated = translated.replace(/\bgiảm(?!\s+giá)\b/gi, 'off'); // Tránh dịch nửa chừng chữ giảm
    }

    return translated;
};
