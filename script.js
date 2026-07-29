const fs = require('fs');
const file = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/pages/admin/AdminLoyalty.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add useTranslation import
if (!content.includes('useTranslation')) {
    content = content.replace(
        'import {',
        import { useTranslation } from "react-i18next";\nimport {
    );
}

// 2. Add useTranslation hook inside AdminLoyalty component
if (!content.includes('const { t } = useTranslation')) {
    content = content.replace(
        'export function AdminLoyalty() {',
        xport function AdminLoyalty() {\n  const { t } = useTranslation('customer');
    );
}

// 3. Replace strings
const replacements = [
    ['"Bạn có chắc muốn xóa hạng thành viên này?"', "t('adminLoyalty.deleteTierConfirm')"],
    ['"Bạn có chắc muốn xóa phần thưởng này?"', "t('adminLoyalty.deleteRewardConfirm')"],
    ['Hạng thành viên', "{t('adminLoyalty.tiersTitle')}"],
    ['Quản lý quy tắc tích điểm, đặt trước và điều kiện duy trì thứ hạng khách hàng', "{t('adminLoyalty.tiersSubtitle')}"],
    ['Thêm hạng mới', "{t('adminLoyalty.addTier')}"],
    ['Đang tải cấu hình hạng thành viên...', "{t('adminLoyalty.loadingTiers')}"],
    ['title="Chỉnh sửa"', "title={t('adminLoyalty.edit')}"],
    ['title="Xóa hạng"', "title={t('adminLoyalty.delete')}"],
    ['Tên hạng</label>', "{t('adminLoyalty.tierName')}</label>"],
    ['Level định danh</label>', "{t('adminLoyalty.level')}</label>"],
    ['Hệ số điểm</label>', "{t('adminLoyalty.pointRate')}</label>"],
    ['Hệ số điểm</span>', "{t('adminLoyalty.pointRate')}</span>"],
    ['Đặt trước (ngày)</label>', "{t('adminLoyalty.bookingWindow')}</label>"],
    ['ID định danh hệ thống</p>', "{t('adminLoyalty.systemId')}</p>"],
    ['Điểm tối thiểu</label>', "{t('adminLoyalty.minPoints')}</label>"],
    ['Điểm tối thiểu</span>', "{t('adminLoyalty.minPoints')}</span>"],
    ['Điểm duy trì</span>', "{t('adminLoyalty.maintenancePoints')}</span>"],
    ['Đặc quyền kèm theo', "{t('adminLoyalty.benefits')}"],
    ['Thêm hạng thành viên mới', "{t('adminLoyalty.addTierTitle')}"],
    ['>Hủy bỏ<', ">{t('adminLoyalty.cancel')}<"],
    ['>Hủy<', ">{t('adminLoyalty.cancel')}<"],
    ['Khởi tạo hạng', "{t('adminLoyalty.createTier')}"],
    ['"Đang xử lý..."', "t('adminLoyalty.creating')"],
    ['Tên hiển thị hạng</label>', "{t('adminLoyalty.tierName')}</label>"],
    ['placeholder="VD: Khách hàng Bạch Kim"', "placeholder={t('adminLoyalty.tierNamePlaceholder')}"],
    ['Mã định danh Level (Enum/String)</label>', "{t('adminLoyalty.level')}</label>"],
    ['placeholder="VD: Platinum"', "placeholder={t('adminLoyalty.levelPlaceholder')}"],
    ['Hệ số tích điểm</label>', "{t('adminLoyalty.pointRate')}</label>"],
    ['Điểm giữ hạng / 90n</label>', "{t('adminLoyalty.maintenancePoints')}</label>"],

    ['Phần thưởng đổi điểm', "{t('adminLoyalty.rewardsTitle')}"],
    ['Thiết lập hệ thống quà tặng và giá trị quy đổi voucher khi thành viên đạt đủ số điểm tích lũy', "{t('adminLoyalty.rewardsSubtitle')}"],
    ['Thêm phần thưởng', "{t('adminLoyalty.addReward')}"],
    ['Đang tải danh sách phần thưởng công khai...', "{t('adminLoyalty.loadingRewards')}"],
    ['Tên phần thưởng</th>', "{t('adminLoyalty.rewardName')}</th>"],
    ['Mô tả hiển thị</th>', "{t('adminLoyalty.rewardDesc')}</th>"],
    ['Chi phí quy đổi</th>', "{t('adminLoyalty.pointsCost')}</th>"],
    ['Giá trị giảm giá</th>', "{t('adminLoyalty.discountAmount')}</th>"],
    ['Trạng thái áp dụng</th>', "{t('adminLoyalty.status')}</th>"],
    ['Hành động</th>', "{t('adminLoyalty.actions')}</th>"],
    ['Chưa có mô tả', "{t('adminLoyalty.noDesc')}"],
    ['>Hoạt động<', ">{t('adminLoyalty.active')}<"],
    ['>Tạm dừng<', ">{t('adminLoyalty.inactive')}<"],
    ['title="Chỉnh sửa thông tin"', "title={t('adminLoyalty.editReward')}"],
    ['title="Xóa phần thưởng"', "title={t('adminLoyalty.deleteReward')}"],
    ['Tạo phần thưởng đổi điểm mới', "{t('adminLoyalty.addRewardTitle')}"],
    ['Cập nhật thông số phần thưởng', "{t('adminLoyalty.editRewardTitle')}"],
    ['Tên quà tặng/voucher</label>', "{t('adminLoyalty.rewardName')}</label>"],
    ['placeholder="VD: Voucher giảm giá dịch vụ 100k"', "placeholder={t('adminLoyalty.rewardNamePlaceholder')}"],
    ['Mô tả ngắn</label>', "{t('adminLoyalty.rewardDesc')}</label>"],
    ['placeholder="VD: Áp dụng cho mọi hóa đơn thanh toán trực tuyến..."', "placeholder={t('adminLoyalty.rewardDescPlaceholder')}"],
    ['Giá quy đổi (Points)</label>', "{t('adminLoyalty.pointsCost')}</label>"],
    ['Mệnh giá giảm (VNĐ)</label>', "{t('adminLoyalty.discountAmount')}</label>"],
    ['Cho phép người dùng nhìn thấy công khai và đổi quà', "{t('adminLoyalty.allowPublic')}"],
    ['"Đang ghi nhận..."', "t('adminLoyalty.creating')"],
    ['"Phát hành ngay"', "t('adminLoyalty.createReward')"],
    ['"Lưu thay đổi"', "t('adminLoyalty.saveChanges')"]
];

for (const [search, replace] of replacements) {
    content = content.split(search).join(replace);
}

// Special case: Hạn đặt trước -> bookingWindow
content = content.replace(/Hạn đặt trước<\/span>/g, "{t('adminLoyalty.bookingWindow')}</span>");
content = content.replace(/"Tạo phần thưởng đổi điểm mới" : "Cập nhật thông số phần thưởng"/g, "t('adminLoyalty.addRewardTitle') : t('adminLoyalty.editRewardTitle')");

fs.writeFileSync(file, content);
console.log('Replacements completed.');
