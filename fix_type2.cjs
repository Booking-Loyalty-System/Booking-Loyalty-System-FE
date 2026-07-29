const fs = require('fs');
const file = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/pages/staff/QueueMonitor.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    /key=\{t\(queueMonitor\.carTypes\.\\, \{ defaultValue: type \}\)\}/g,
    "key={type}"
);
content = content.replace(
    /\{t\(queueMonitor\.carTypes\.\\, \{ defaultValue: type \}\)\}/g,
    "{t(`queueMonitor.carTypes.${type.toLowerCase()}`, { defaultValue: type })}"
);

fs.writeFileSync(file, content);
console.log('Fixed type translation for real this time');
