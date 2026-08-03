const fs = require('fs');
const filePath = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/pages/admin/AdminDashboard.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// Use regex with \s* to ignore whitespace/newlines
code = code.replace(/>\s*Revenue Overview\s*<\/h3>/g, '>{t(\'adminDashboard.revenueComparison.revenueOverview\', { defaultValue: \'Revenue Overview\' })}</h3>');
code = code.replace(/>\s*Export Dataset\s*<\/span>/g, '>{t(\'adminDashboard.revenueComparison.exportDataset\', { defaultValue: \'Export Dataset\' })}</span>');
code = code.replace(/>\s*Membership Tiers\s*<\/h3>/g, '>{t(\'adminDashboard.membershipTiers.title\', { defaultValue: \'Membership Tiers\' })}</h3>');
code = code.replace(/>\s*Recent Bookings\s*<\/h3>/g, '>{t(\'adminDashboard.recentBookings.title\', { defaultValue: \'Recent Bookings\' })}</h3>');
code = code.replace(/>\s*Booking ID\s*<\/th>/g, '>{t(\'adminDashboard.recentBookings.bookingId\', { defaultValue: \'Booking ID\' })}</th>');
code = code.replace(/>\s*Customer\s*<\/th>/g, '>{t(\'adminDashboard.recentBookings.customer\', { defaultValue: \'Customer\' })}</th>');
code = code.replace(/>\s*Service\s*<\/th>/g, '>{t(\'adminDashboard.recentBookings.service\', { defaultValue: \'Service\' })}</th>');
code = code.replace(/>\s*Amount\s*<\/th>/g, '>{t(\'adminDashboard.recentBookings.amount\', { defaultValue: \'Amount\' })}</th>');
code = code.replace(/>\s*Status\s*<\/th>/g, '>{t(\'adminDashboard.recentBookings.status\', { defaultValue: \'Status\' })}</th>');

code = code.replace(/>\s*Tier Rules & Configuration\s*<\/h3>/g, '>{t(\'adminDashboard.tierConfig.title\', { defaultValue: \'Tier Rules & Configuration\' })}</h3>');
code = code.replace(/>\s*Points Range\s*<\/label>/g, '>{t(\'adminDashboard.tierConfig.pointsRange\', { defaultValue: \'Points Range\' })}</label>');
code = code.replace(/>\s*Points Multiplier\s*<\/label>/g, '>{t(\'adminDashboard.tierConfig.pointsMultiplier\', { defaultValue: \'Points Multiplier\' })}</label>');

// Hardcoded Tier names under Tier Rules
code = code.replace(/>\s*Member\s*<\/h4>/g, '>{translateDynamic(\'Member\', \'tier\', t)}</h4>');
code = code.replace(/>\s*Silver\s*<\/h4>/g, '>{translateDynamic(\'Silver\', \'tier\', t)}</h4>');
code = code.replace(/>\s*Gold\s*<\/h4>/g, '>{translateDynamic(\'Gold\', \'tier\', t)}</h4>');
code = code.replace(/>\s*Platinum\s*<\/h4>/g, '>{translateDynamic(\'Platinum\', \'tier\', t)}</h4>');

fs.writeFileSync(filePath, code);
