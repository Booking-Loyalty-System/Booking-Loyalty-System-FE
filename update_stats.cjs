const fs = require('fs');

// 1. DashboardStats.tsx
const statsFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/components/DashboardStats.tsx';
let statsContent = fs.readFileSync(statsFile, 'utf8');

if (!statsContent.includes('import { useTranslation }')) {
    statsContent = statsContent.replace(
        'import {Calendar, CheckCircle, Clock, Droplets} from "lucide-react";',
        'import {Calendar, CheckCircle, Clock, Droplets} from "lucide-react";\nimport { useTranslation } from "react-i18next";'
    );
}
if (!statsContent.includes('const { t } = useTranslation')) {
    statsContent = statsContent.replace(
        'export const DashboardStats: React.FC<DashboardStatsProps> = ({ bookings, localDate, setLocalDate }) => {',
        'export const DashboardStats: React.FC<DashboardStatsProps> = ({ bookings, localDate, setLocalDate }) => {\n    const { t } = useTranslation("customer");'
    );
}
statsContent = statsContent.replace(/Tổng Lịch Đặt/g, "{t('dashboardStats.totalBookings')}");
statsContent = statsContent.replace(/Đã Hoàn Thành/g, "{t('dashboardStats.completed')}");
statsContent = statsContent.replace(/Đang Thực Hiện/g, "{t('dashboardStats.inProgress')}");
statsContent = statsContent.replace(/Đang Chờ \(Queue\)/g, "{t('dashboardStats.waiting')}");
fs.writeFileSync(statsFile, statsContent);

// 2. BookingTableFilters.tsx
const filtersFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/components/customer/BookingTableFilters.tsx';
let filtersContent = fs.readFileSync(filtersFile, 'utf8');

if (!filtersContent.includes('import { useTranslation }')) {
    filtersContent = filtersContent.replace(
        'import {QrCode, Search} from "lucide-react";',
        'import {QrCode, Search} from "lucide-react";\nimport { useTranslation } from "react-i18next";'
    );
}
if (!filtersContent.includes('const { t } = useTranslation')) {
    filtersContent = filtersContent.replace(
        'export const BookingTableFilters: React.FC<BookingTableFiltersProps> = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, onOpenQr }) => {',
        'export const BookingTableFilters: React.FC<BookingTableFiltersProps> = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, onOpenQr }) => {\n    const { t } = useTranslation("customer");'
    );
}
filtersContent = filtersContent.replace(/Lịch Đặt Hôm Nay/g, "{t('dashboardStats.todayBookings')}");
filtersContent = filtersContent.replace(/placeholder="Mã, tên xe, biển số..."/g, "placeholder={t('dashboardStats.searchPlaceholder')}");
filtersContent = filtersContent.replace(/>Tất cả trạng thái</g, ">{t('dashboardStats.allStatus')}<");
filtersContent = filtersContent.replace(/>Pending \(Chờ xác nhận\)</g, ">{t('dashboardStats.pending')}<");
filtersContent = filtersContent.replace(/>Confirmed \(Đã xác nhận\)</g, ">{t('dashboardStats.confirmed')}<");
filtersContent = filtersContent.replace(/>Checked In \(Đã tới\)</g, ">{t('dashboardStats.checkedIn')}<");
filtersContent = filtersContent.replace(/>Queued \(Chờ rửa\)</g, ">{t('dashboardStats.queued')}<");
filtersContent = filtersContent.replace(/>Completed \(Xong\)</g, ">{t('dashboardStats.completedStatus')}<");
filtersContent = filtersContent.replace(/>Checked Out \(Đã thanh toán\)</g, ">{t('dashboardStats.checkedOut')}<");
filtersContent = filtersContent.replace(/>Cancelled \(Đã hủy\)</g, ">{t('dashboardStats.cancelled')}<");
filtersContent = filtersContent.replace(/>No Show \(Không đến\)</g, ">{t('dashboardStats.noShow')}<");
fs.writeFileSync(filtersFile, filtersContent);

// 3. StaffDashboard.tsx (Branch Name)
const staffDashFile = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/pages/staff/StaffDashboard.tsx';
let staffDashContent = fs.readFileSync(staffDashFile, 'utf8');
staffDashContent = staffDashContent.replace(
    '{staffProfile.branch?.branchName || t(\'staffDashboard.branch\')}',
    '{staffProfile.branch?.branchName ? (staffProfile.branch.branchName.includes("Quận 9") ? t("staffDashboard.district9") : staffProfile.branch.branchName) : t("staffDashboard.branch")}'
);
fs.writeFileSync(staffDashFile, staffDashContent);

console.log('Done replacing stats and filters');
