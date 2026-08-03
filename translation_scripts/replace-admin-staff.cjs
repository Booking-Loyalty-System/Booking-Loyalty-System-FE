const fs = require('fs');
const filePath = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/pages/admin/AdminStaff.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// Import useTranslation
if (!code.includes('useTranslation')) {
    code = code.replace('import React, { useMemo, useState } from "react";', 'import React, { useMemo, useState } from "react";\nimport { useTranslation } from "react-i18next";');
}

if (!code.includes('const { t } = useTranslation')) {
    code = code.replace('export const AdminStaff: React.FC = () => {', 'export const AdminStaff: React.FC = () => {\n  const { t } = useTranslation(\'customer\');');
}

// Top level header
code = code.replace(/>\s*Staff Management\s*<\/h1>/g, '>{t(\'adminStaff.title\', { defaultValue: \'Staff Management\' })}</h1>');
code = code.replace(/>\s*Manage staff members and branch assignments\.\s*<\/p>/g, '>{t(\'adminStaff.subtitle\', { defaultValue: \'Manage staff members and branch assignments.\' })}</p>');
code = code.replace(/>\s*Add Staff\s*<\/span>/g, '>{t(\'adminStaff.addStaff\', { defaultValue: \'Add Staff\' })}</span>');
// if "Add Staff" is just loose text:
code = code.replace(/>\s*Add Staff\s*<\/button>/g, '>{t(\'adminStaff.addStaff\', { defaultValue: \'Add Staff\' })}</button>');
// Wait, in AdminStaff it might just be text inside a button
// We'll replace exact matched phrases where safe.

// Summary cards
code = code.replace(/>\s*Total Staffs\s*<\/p>/g, '>{t(\'adminStaff.totalStaff\', { defaultValue: \'Total Staffs\' })}</p>');
code = code.replace(/>\s*Active Staffs\s*<\/p>/g, '>{t(\'adminStaff.activeStaff\', { defaultValue: \'Active Staffs\' })}</p>');

// Search input placeholder
code = code.replace(/placeholder=\"Search staffs\.\.\.\"/g, 'placeholder={t(\'adminStaff.searchStaff\', { defaultValue: \'Search staffs...\' })}');

// Table headers
code = code.replace(/>\s*Branch\s*<\/th>/g, '>{t(\'adminStaff.branch\', { defaultValue: \'Branch\' })}</th>');
code = code.replace(/>\s*Status\s*<\/th>/g, '>{t(\'adminStaff.status\', { defaultValue: \'Status\' })}</th>');
// I'll also add Full Name, Email, Phone Number if they are TH
code = code.replace(/>\s*Full Name\s*<\/th>/g, '>{t(\'adminStaff.fullName\', { defaultValue: \'Full Name\' })}</th>');
code = code.replace(/>\s*Email\s*<\/th>/g, '>{t(\'adminStaff.email\', { defaultValue: \'Email\' })}</th>');
code = code.replace(/>\s*Phone Number\s*<\/th>/g, '>{t(\'adminStaff.phoneNumber\', { defaultValue: \'Phone Number\' })}</th>');

// Table content
code = code.replace(/\"No branch\"/g, 't(\'adminStaff.noBranch\', { defaultValue: \'No branch\' })');
code = code.replace(/>\s*\{staff.isAvailable \? \"Available\" : \"Unavailable\"\}\s*<\/span>/g, '>{staff.isAvailable ? t(\'adminStaff.available\', { defaultValue: \'Available\' }) : t(\'adminStaff.unavailable\', { defaultValue: \'Unavailable\' })}</span>');

// Modal title
code = code.replace(/\{editingStaff \? \"Edit Staff\" : \"Add Staff\"\}/g, '{editingStaff ? t(\'adminStaff.editStaff\', { defaultValue: \'Edit Staff\' }) : t(\'adminStaff.addStaff\', { defaultValue: \'Add Staff\' })}');

// Modal Labels
code = code.replace(/>\s*Email\s*<\/label>/g, '>{t(\'adminStaff.email\', { defaultValue: \'Email\' })}</label>');
code = code.replace(/>\s*Password\s*<\/label>/g, '>{t(\'adminStaff.password\', { defaultValue: \'Password\' })}</label>');
code = code.replace(/placeholder=\"Enter password\"/g, 'placeholder={t(\'adminStaff.enterPassword\', { defaultValue: \'Enter password\' })}');
code = code.replace(/>\s*Full Name\s*<\/label>/g, '>{t(\'adminStaff.fullName\', { defaultValue: \'Full Name\' })}</label>');
code = code.replace(/>\s*Phone Number\s*<\/label>/g, '>{t(\'adminStaff.phoneNumber\', { defaultValue: \'Phone Number\' })}</label>');
code = code.replace(/>\s*Branch\s*<\/label>/g, '>{t(\'adminStaff.branch\', { defaultValue: \'Branch\' })}</label>');

code = code.replace(/>\s*Select branch\s*<\/option>/g, '>{t(\'adminStaff.selectBranch\', { defaultValue: \'Select branch\' })}</option>');

// Checkbox text
code = code.replace(/>\s*Available\s*<\/span>/g, '>{t(\'adminStaff.available\', { defaultValue: \'Available\' })}</span>');
code = code.replace(/>\s*Allow this staff member to be available for work\.\s*<\/p>/g, '>{t(\'adminStaff.allowAvailable\', { defaultValue: \'Allow this staff member to be available for work.\' })}</p>');

// Modal buttons
code = code.replace(/>\s*Cancel\s*<\/button>/g, '>{t(\'adminStaff.cancel\', { defaultValue: \'Cancel\' })}</button>');
code = code.replace(/\{\s*editingStaff\s*\?\s*\"Save Changes\"\s*:\s*\"Create Staff\"\s*\}/g, '{editingStaff ? t(\'adminStaff.saveChanges\', { defaultValue: \'Save Changes\' }) : t(\'adminStaff.createStaff\', { defaultValue: \'Create Staff\' })}');


fs.writeFileSync(filePath, code);
