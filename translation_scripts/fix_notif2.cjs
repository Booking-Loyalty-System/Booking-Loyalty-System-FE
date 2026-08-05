const fs = require('fs');
const file = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/components/Notification.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    /`\$\{notifications\.filter\(\(n\) => !n\.isRead\)\.length\} unread notifications`/g,
    "t('notifications.unreadCount', { count: notifications.filter((n) => !n.isRead).length })"
);

content = content.replace(
    /:\s*"You are all caught up!"/g,
    ": t('notifications.allCaughtUp')"
);

fs.writeFileSync(file, content);
console.log('Fixed Notification strings');
