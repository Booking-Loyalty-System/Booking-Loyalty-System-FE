const fs = require('fs');
const file = 'E:/Subjects/Auto_Wash_Premium_Care/Booking-Loyalty-System-FE/src/features/products/presentation/pages/staff/StaffProfile.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { useTranslation }')) {
    content = content.replace(
        'import React, { useEffect, useState } from "react";',
        'import React, { useEffect, useState } from "react";\nimport { useTranslation } from "react-i18next";'
    );
}

if (!content.includes('const { t } = useTranslation')) {
    content = content.replace(
        'export const StaffProfile: React.FC = () => {',
        'export const StaffProfile: React.FC = () => {\n  const { t } = useTranslation("customer");'
    );
}

const replacements = [
    [/"Không thể tải thông tin nhân viên\."/g, "t('staffProfile.fetchProfileError')"],
    [/"Vui lòng nhập đầy đủ thông tin\."/g, "t('staffProfile.password.enterAll')"],
    [/"Mật khẩu xác nhận không khớp\."/g, "t('staffProfile.password.notMatch')"],
    [/"Mật khẩu mới phải khác mật khẩu hiện tại\."/g, "t('staffProfile.password.sameAsCurrent')"],
    [/"Đổi mật khẩu thành công\."/g, "t('staffProfile.password.success')"],
    [/"Không thể đổi mật khẩu\. Vui lòng kiểm tra mật khẩu hiện tại\."/g, "t('staffProfile.password.fail')"],
    [/>\s*Đang tải thông tin\.\.\.\s*</g, ">{t('staffProfile.loading')}<"],
    [/"Không tìm thấy thông tin nhân viên\."/g, "t('staffProfile.notFound')"],
    [/>\s*My Profile\s*</g, ">{t('staffProfile.title')}<"],
    [/>\s*Xem thông tin tài khoản và quản lý mật khẩu của bạn\.\s*</g, ">{t('staffProfile.subtitle')}<"],
    [/"Available"/g, "t('staffProfile.status.available')"],
    [/"Unavailable"/g, "t('staffProfile.status.unavailable')"],
    [/>\s*Personal Information\s*</g, ">{t('staffProfile.personalInfo.title')}<"],
    [/"Full Name"/g, "t('staffProfile.personalInfo.fullName')"],
    [/"Email"/g, "t('staffProfile.personalInfo.email')"],
    [/"Phone Number"/g, "t('staffProfile.personalInfo.phoneNumber')"],
    [/"Chưa cập nhật"/g, "t('staffProfile.personalInfo.notUpdated')"],
    [/"Role"/g, "t('staffProfile.personalInfo.role')"],
    [/"Branch"/g, "t('staffProfile.personalInfo.branch')"],
    [/"Chưa phân chi nhánh"/g, "t('staffProfile.personalInfo.noBranch')"],
    [/"Branch Address"/g, "t('staffProfile.personalInfo.branchAddress')"],
    [/"Chưa có địa chỉ"/g, "t('staffProfile.personalInfo.noAddress')"],
    [/>\s*Change Password\s*</g, ">{t('staffProfile.password.title')}<"],
    [/>\s*Cập nhật mật khẩu tài khoản\s*</g, ">{t('staffProfile.password.subtitle')}<"],
    [/"Current Password"/g, "t('staffProfile.password.current')"],
    [/"New Password"/g, "t('staffProfile.password.new')"],
    [/"Confirm New Password"/g, "t('staffProfile.password.confirm')"],
    [/"Đang cập nhật\.\.\."/g, "t('staffProfile.password.updating')"],
    [/"Change Password"/g, "t('staffProfile.password.button')"]
];

for (const [regex, replace] of replacements) {
    content = content.replace(regex, replace);
}

fs.writeFileSync(file, content);
console.log('StaffProfile updated');
