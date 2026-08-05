const fs = require('fs');
const file = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/pages/staff/QueueMonitor.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace literals that were on their own lines or had specific wrapping
content = content.replace(
    /<h1[^>]*>[\s\S]*?Queue Monitor[\s\S]*?<\/h1>/g, 
    '<h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 tracking-tight flex items-center gap-3">\n            {t("queueMonitor.title")}\n          </h1>'
);

content = content.replace(
    /<h2[^>]*>[\s\S]*?Unassigned Queue[\s\S]*?<\/h2>/g,
    '<h2 className="font-bold text-lg text-slate-800">\n                {t("queueMonitor.unassignedQueue.title")}\n              </h2>'
);

// Replace AVAILABLE, OCCUPIED, MAINTENANCE
content = content.replace(/>\s*MAINTENANCE\s*</g, ">{t('queueMonitor.bayStatus.maintenance')}<");
content = content.replace(/>\s*OCCUPIED\s*</g, ">{t('queueMonitor.bayStatus.occupied')}<");
content = content.replace(/>\s*AVAILABLE\s*</g, ">{t('queueMonitor.bayStatus.available')}<");

// Replace string literals in the ternary if they are wrapped in quotes:
// ? "MAINTENANCE" : bay.isOccupied ? "OCCUPIED" : "AVAILABLE"
content = content.replace(/"MAINTENANCE"/g, "t('queueMonitor.bayStatus.maintenance')");
content = content.replace(/"OCCUPIED"/g, "t('queueMonitor.bayStatus.occupied')");
content = content.replace(/"AVAILABLE"/g, "t('queueMonitor.bayStatus.available')");

// Replace {type} with translation
content = content.replace(
    /\{type\}/g,
    "{t(queueMonitor.carTypes., { defaultValue: type })}"
);

fs.writeFileSync(file, content);
console.log('Final cleanups applied');
