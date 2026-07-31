const fs = require('fs');
const filePath = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/pages/admin/AdminDashboard.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// Replace headers and metrics
code = code.replace(/>Admin Overview<\/h1>/g, '>{t(\'adminDashboard.title\', { defaultValue: \'Admin Overview\' })}</h1>');
code = code.replace(/>Theo dõi tổng quan doanh thu và hiệu suất kinh doanh.<\/p>/g, '>{t(\'adminDashboard.subtitle\', { defaultValue: \'Theo dõi tổng quan doanh thu và hiệu suất kinh doanh.\' })}</p>');

code = code.replace(/label: 'Total Revenue'/g, 'label: t(\'adminDashboard.metrics.totalRevenue\', { defaultValue: \'Total Revenue\' })');
code = code.replace(/label: 'Total Bookings'/g, 'label: t(\'adminDashboard.metrics.totalBookings\', { defaultValue: \'Total Bookings\' })');
code = code.replace(/label: 'Active Customers'/g, 'label: t(\'adminDashboard.metrics.activeCustomers\', { defaultValue: \'Active Customers\' })');
code = code.replace(/label: 'Average Order Value'/g, 'label: t(\'adminDashboard.metrics.averageOrderValue\', { defaultValue: \'Average Order Value\' })');

// Revenue Auditing
code = code.replace(/>Revenue Auditing & Comparison<\/h3>/g, '>{t(\'adminDashboard.revenueComparison.title\', { defaultValue: \'Revenue Auditing & Comparison\' })}</h3>');
code = code.replace(/>So sánh đối soát doanh thu dựa trên các khoảng thời gian tùy chọn<\/p>/g, '>{t(\'adminDashboard.revenueComparison.subtitle\', { defaultValue: \'So sánh đối soát doanh thu dựa trên các khoảng thời gian tùy chọn\' })}</p>');

code = code.replace(/>Kỳ muốn coi \(Kỳ này\)<\/span>/g, '>{t(\'adminDashboard.revenueComparison.currentPeriod\', { defaultValue: \'Kỳ muốn coi (Kỳ này)\' })}</span>');
code = code.replace(/>đến<\/span>/g, '>{t(\'adminDashboard.revenueComparison.to\', { defaultValue: \'đến\' })}</span>');
code = code.replace(/>Kỳ đối chứng \(Kỳ trước\)<\/span>/g, '>{t(\'adminDashboard.revenueComparison.previousPeriod\', { defaultValue: \'Kỳ đối chứng (Kỳ trước)\' })}</span>');

code = code.replace(/>Doanh thu kỳ này<\/p>/g, '>{t(\'adminDashboard.revenueComparison.currentRevenue\', { defaultValue: \'Doanh thu kỳ này\' })}</p>');
code = code.replace(/>Doanh thu kỳ trước<\/p>/g, '>{t(\'adminDashboard.revenueComparison.previousRevenue\', { defaultValue: \'Doanh thu kỳ trước\' })}</p>');

code = code.replace(/>sụt giảm<\/span>/g, '>{t(\'adminDashboard.revenueComparison.decline\', { defaultValue: \'sụt giảm\' })}</span>');
code = code.replace(/>tăng trưởng<\/span>/g, '>{t(\'adminDashboard.revenueComparison.growth\', { defaultValue: \'tăng trưởng\' })}</span>');

code = code.replace(/>Đối soát Doanh thu<\/h3>/g, '>{t(\'adminDashboard.revenueComparison.revenueAudit\', { defaultValue: \'Đối soát Doanh thu\' })}</h3>');
code = code.replace(/>Revenue Overview<\/h3>/g, '>{t(\'adminDashboard.revenueComparison.revenueOverview\', { defaultValue: \'Revenue Overview\' })}</h3>');
code = code.replace(/>Export Dataset<\/span>/g, '>{t(\'adminDashboard.revenueComparison.exportDataset\', { defaultValue: \'Export Dataset\' })}</span>');

// Note: name: 'Đối soát Doanh thu'
code = code.replace(/name: 'Đối soát Doanh thu',/g, 'name: t(\'adminDashboard.revenueComparison.revenueAudit\', { defaultValue: \'Đối soát Doanh thu\' }),');
code = code.replace(/'Kỳ trước': revenueComparison.previousRevenue,/g, '[t(\'adminDashboard.revenueComparison.previousTerm\', { defaultValue: \'Kỳ trước\' })]: revenueComparison.previousRevenue,');
code = code.replace(/'Kỳ này': revenueComparison.currentRevenue,/g, '[t(\'adminDashboard.revenueComparison.currentTerm\', { defaultValue: \'Kỳ này\' })]: revenueComparison.currentRevenue,');

code = code.replace(/<Bar dataKey=\"Kỳ trước\"/g, '<Bar dataKey={t(\'adminDashboard.revenueComparison.previousTerm\', { defaultValue: \'Kỳ trước\' })}');
code = code.replace(/<Bar dataKey=\"Kỳ này\"/g, '<Bar dataKey={t(\'adminDashboard.revenueComparison.currentTerm\', { defaultValue: \'Kỳ này\' })}');

// Membership Tiers
code = code.replace(/>Membership Tiers<\/h3>/g, '>{t(\'adminDashboard.membershipTiers.title\', { defaultValue: \'Membership Tiers\' })}</h3>');
code = code.replace(/\"\$\{value\} customers\"/g, '`${value} ${t(\'adminDashboard.membershipTiers.customers\', { defaultValue: \'customers\' })}`');

// Recent Bookings
code = code.replace(/>Recent Bookings<\/h3>/g, '>{t(\'adminDashboard.recentBookings.title\', { defaultValue: \'Recent Bookings\' })}</h3>');
code = code.replace(/>Booking ID<\/th>/g, '>{t(\'adminDashboard.recentBookings.bookingId\', { defaultValue: \'Booking ID\' })}</th>');
code = code.replace(/>Customer<\/th>/g, '>{t(\'adminDashboard.recentBookings.customer\', { defaultValue: \'Customer\' })}</th>');
code = code.replace(/>Service<\/th>/g, '>{t(\'adminDashboard.recentBookings.service\', { defaultValue: \'Service\' })}</th>');
code = code.replace(/>Amount<\/th>/g, '>{t(\'adminDashboard.recentBookings.amount\', { defaultValue: \'Amount\' })}</th>');
code = code.replace(/>Status<\/th>/g, '>{t(\'adminDashboard.recentBookings.status\', { defaultValue: \'Status\' })}</th>');

// Tier Config
code = code.replace(/>Tier Rules & Configuration<\/h3>/g, '>{t(\'adminDashboard.tierConfig.title\', { defaultValue: \'Tier Rules & Configuration\' })}</h3>');
code = code.replace(/>Quản lý hệ số nhân điểm cho các hạng thành viên<\/p>/g, '>{t(\'adminDashboard.tierConfig.subtitle\', { defaultValue: \'Quản lý hệ số nhân điểm cho các hạng thành viên\' })}</p>');

// Use a regex to replace isUpdatingTierConfig ? "Saving..." : "Save Changes"
code = code.replace(/isUpdatingTierConfig \? \"Saving\.\.\.\" \: \"Save Changes\"/g, 'isUpdatingTierConfig ? t(\'adminDashboard.tierConfig.saving\', { defaultValue: \'Saving...\' }) : t(\'adminDashboard.tierConfig.saveChanges\', { defaultValue: \'Save Changes\' })');

code = code.replace(/>Points Range<\/label>/g, '>{t(\'adminDashboard.tierConfig.pointsRange\', { defaultValue: \'Points Range\' })}</label>');
code = code.replace(/>Points Multiplier<\/label>/g, '>{t(\'adminDashboard.tierConfig.pointsMultiplier\', { defaultValue: \'Points Multiplier\' })}</label>');

code = code.replace(/>Công thức:<\/span>/g, '>{t(\'adminDashboard.tierConfig.formulaTitle\', { defaultValue: \'Công thức:\' })}</span>');
code = code.replace(/>Điểm nhận được = \(Tổng tiền thanh toán \/ 1000\) × Hệ số hạng \(Tier Multiplier\)\. Việc thay đổi hệ số chỉ áp dụng cho các giao dịch trong tương lai\.<\/p>/g, '>{t(\'adminDashboard.tierConfig.formulaDesc\', { defaultValue: \'Điểm nhận được = (Tổng tiền thanh toán / 1000) × Hệ số hạng (Tier Multiplier). Việc thay đổi hệ số chỉ áp dụng cho các giao dịch trong tương lai.\' })}</p>');

// Tier Config - Hardcoded Tiers translation
code = code.replace(/>Member<\/h4>/g, '>{translateDynamic(\'Member\', \'tier\', t)}</h4>');
code = code.replace(/>Silver<\/h4>/g, '>{translateDynamic(\'Silver\', \'tier\', t)}</h4>');
code = code.replace(/>Gold<\/h4>/g, '>{translateDynamic(\'Gold\', \'tier\', t)}</h4>');
code = code.replace(/>Platinum<\/h4>/g, '>{translateDynamic(\'Platinum\', \'tier\', t)}</h4>');

// Quick Management
code = code.replace(/>Quick Management<\/h3>/g, '>{t(\'adminDashboard.quickManagement.title\', { defaultValue: \'Quick Management\' })}</h3>');

code = code.replace(/title: 'Loyalty Programs'/g, 'title: t(\'adminDashboard.quickManagement.loyaltyPrograms\', { defaultValue: \'Loyalty Programs\' })');
code = code.replace(/desc: 'Manage tiers and rewards'/g, 'desc: t(\'adminDashboard.quickManagement.loyaltyProgramsDesc\', { defaultValue: \'Manage tiers and rewards\' })');
code = code.replace(/title: 'Promotions'/g, 'title: t(\'adminDashboard.quickManagement.promotions\', { defaultValue: \'Promotions\' })');
code = code.replace(/desc: 'Create and manage campaigns'/g, 'desc: t(\'adminDashboard.quickManagement.promotionsDesc\', { defaultValue: \'Create and manage campaigns\' })');
code = code.replace(/title: 'Customer Analytics'/g, 'title: t(\'adminDashboard.quickManagement.customerAnalytics\', { defaultValue: \'Customer Analytics\' })');
code = code.replace(/desc: 'View detailed reports'/g, 'desc: t(\'adminDashboard.quickManagement.customerAnalyticsDesc\', { defaultValue: \'View detailed reports\' })');
code = code.replace(/title: 'Staff Management'/g, 'title: t(\'adminDashboard.quickManagement.staffManagement\', { defaultValue: \'Staff Management\' })');
code = code.replace(/desc: 'Manage team and roles'/g, 'desc: t(\'adminDashboard.quickManagement.staffManagementDesc\', { defaultValue: \'Manage team and roles\' })');

fs.writeFileSync(filePath, code);
console.log('AdminDashboard.tsx updated');
