import React, { useState, useEffect } from 'react';
import { User, Edit3, Lock, Bell, ShieldCheck, Download, ExternalLink, Trash2, Check, X, Loader2, Sun, Moon, Monitor, Globe } from 'lucide-react';
import { useCustomerMe, useUpdateCustomer } from '@/features/products/application/useCustomer.ts';
import { useAuth } from '@/features/products/application/useAuth.ts';
import { useTheme } from '@/core/context/ThemeContext.tsx';
import { useLanguage } from '@/core/context/LanguageContext.tsx';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export const ProfileSettings: React.FC = () => {
    const { customerMe } = useCustomerMe();
    const { updateCustomer, isUpdating } = useUpdateCustomer();
    const { changePassword, isChangingPassword } = useAuth();
    const { toggleTheme, isDark } = useTheme();
    const { language, changeLanguage } = useLanguage();
    const { t } = useTranslation('customer');

    const [emailNotify, setEmailNotify] = useState(true);
    const [smsNotify, setSMSNotify] = useState(true);
    const [marketingEmail, setMarketingEmail] = useState(false);
    const [twoFactor, setTwoFactor] = useState(false);

    // Form state for Profile
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
    });

    // Form state for Password
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (customerMe && !isEditing) {
            setFormData({
                fullName: customerMe.fullName || '',
                phoneNumber: customerMe.phoneNumber || '',
            });
        }
    }, [customerMe, isEditing]);

    const handleSave = async () => {
        if (!formData.fullName.trim() || !formData.phoneNumber.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            await updateCustomer({
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
            });
            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to update profile. Please try again.');
            console.error('Update profile error:', error);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            fullName: customerMe?.fullName || '',
            phoneNumber: customerMe?.phoneNumber || '',
        });
    };

    const handleChangePassword = async () => {
        const { currentPassword, newPassword, confirmPassword } = passwordData;

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('Please fill in all password fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        try {
            await changePassword({ currentPassword, newPassword });
            toast.success('Password updated successfully!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error('Failed to change password. Please check your current password and try again.');
            console.error('Change password error:', error);
        }
    };

    return (
        <div className="w-full font-sans text-slate-800 dark:text-slate-100">
            <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mb-6">Manage your account information and preferences</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* CỘT TRÁI + GIỮA (2/3): FORM CHÍNH */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Khối 1: Personal Information */}
                    <div className="bg-white border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-3">
                            <div className="flex items-center gap-2 font-bold text-base text-slate-900 dark:text-white">
                                <User className="w-5 h-5 text-blue-600" />
                                <span>{t('settings.personalInfo.sectionTitle')}</span>
                            </div>
                            
                            {!isEditing ? (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="inline-flex items-center gap-1 border-2 border-blue-600 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-blue-50 transition"
                                >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>{t('settings.personalInfo.btnEdit')}</span>
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button 
                                        onClick={handleCancel}
                                        disabled={isUpdating}
                                        className="inline-flex items-center gap-1 border-2 border-slate-300 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-slate-50 transition disabled:opacity-50"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                        <span>{t('settings.personalInfo.btnCancel')}</span>
                                    </button>
                                    <button 
                                        onClick={handleSave}
                                        disabled={isUpdating}
                                        className="inline-flex items-center gap-1 bg-blue-600 text-white border-2 border-blue-600 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                                    >
                                        {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                        <span>{t('settings.personalInfo.btnSave')}</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('settings.personalInfo.labelFullName')}</label>
                                <input 
                                    type="text" 
                                    readOnly={!isEditing} 
                                    value={isEditing ? formData.fullName : (customerMe?.fullName || 'Khách hàng')} 
                                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                    className={`w-full border rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none transition-colors ${isEditing ? 'bg-white border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100' : 'bg-slate-50/70 border-slate-200/60'}`} 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('settings.personalInfo.labelPhoneNumber')}</label>
                                <input 
                                    type="text" 
                                    readOnly={!isEditing} 
                                    value={isEditing ? formData.phoneNumber : (customerMe?.phoneNumber || '0901234567')} 
                                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                    className={`w-full border rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none transition-colors ${isEditing ? 'bg-white border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100' : 'bg-slate-50/70 border-slate-200/60'}`} 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('settings.personalInfo.labelEmailAddress')} <span className="normal-case text-[10px] text-slate-400 font-medium">{t('settings.personalInfo.emailReadOnly')}</span></label>
                                <input 
                                    type="email" 
                                    readOnly 
                                    value={customerMe?.email || 'john.doe@gmail.com'} 
                                    className="w-full bg-slate-50/70 border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-400 focus:outline-none cursor-not-allowed" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Khối 2: Password & Security */}
                    <div className="bg-white border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
                        <div className="flex items-center gap-2 font-bold text-base text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-3">
                            <Lock className="w-5 h-5 text-blue-600" />
                            <span>{t('settings.passwordSecurity.sectionTitle')}</span>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5 relative">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('settings.passwordSecurity.labelCurrentPassword')}</label>
                                <input 
                                    type="password" 
                                    placeholder={t('settings.passwordSecurity.placeholderCurrentPassword')}
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                    className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-2.5 text-sm font-mono outline-none transition-all" 
                                />
                            </div>
                            <div className="space-y-1.5 relative">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('settings.passwordSecurity.labelNewPassword')}</label>
                                <input 
                                    type="password" 
                                    placeholder={t('settings.passwordSecurity.placeholderNewPassword')}
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                    className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-2.5 text-sm font-mono outline-none transition-all" 
                                />
                            </div>
                            <div className="space-y-1.5 relative">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('settings.passwordSecurity.labelConfirmNewPassword')}</label>
                                <input 
                                    type="password" 
                                    placeholder={t('settings.passwordSecurity.placeholderConfirmNewPassword')}
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-2.5 text-sm font-mono outline-none transition-all" 
                                />
                            </div>

                            <button 
                                onClick={handleChangePassword}
                                disabled={isChangingPassword}
                                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-bold w-full sm:w-auto px-6 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
                            >
                                {isChangingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isChangingPassword ? t('settings.passwordSecurity.btnUpdating') : t('settings.passwordSecurity.btnUpdatePassword')}
                            </button>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">{t('settings.passwordSecurity.twoFactorTitle')}</h4>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">{t('settings.passwordSecurity.twoFactorDesc')}</p>
                                </div>
                                {/* Custom Toggle Switch */}
                                <button
                                    onClick={() => setTwoFactor(!twoFactor)}
                                    className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none shrink-0 ${twoFactor ? 'bg-blue-600' : 'bg-slate-200'}`}
                                >
                                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${twoFactor ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* CỘT PHẢI (1/3): THẺ THÔNG TIN TỔNG QUAN & CONFIG PHỤ */}
                <div className="space-y-6">

                    {/* Khối Thẻ Thành Viên Xanh Dương */}
                    <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-md space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-blue-100 font-medium">{t('settings.memberCard.memberSince')}</p>
                                <p className="text-lg font-black tracking-wide">January 2026</p>
                            </div>
                        </div>
                        <div className="pt-2 space-y-2 text-sm font-semibold border-t border-white/10">
                            <div className="flex justify-between opacity-90">
                                <span>{t('settings.memberCard.totalBookings')}</span>
                                <span className="font-bold">{customerMe?.totalWashes ?? 5}</span>
                            </div>
                            <div className="flex justify-between opacity-90">
                                <span>{t('settings.memberCard.totalSpent')}</span>
                                <span className="font-bold">
                                    {(customerMe?.totalSpent ?? 3175000).toLocaleString('vi-VN')}đ
                                </span>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <span>{t('settings.memberCard.pointsBalance')}</span>
                                <span className="text-base font-black text-amber-300">
                                    {customerMe?.totalPoints ?? 850} pts
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Khối Cấu Hình Notifications Tắt/Mở */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 font-bold text-sm text-slate-900 border-b border-slate-50 pb-2">
                            <Bell className="w-4 h-4 text-blue-600" />
                            <span>{t('settings.notificationsSection.sectionTitle')}</span>
                        </div>
                        <div className="space-y-3.5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500">{t('settings.notificationsSection.emailNotifications')}</span>
                                <button onClick={() => setEmailNotify(!emailNotify)} className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${emailNotify ? 'bg-blue-600' : 'bg-slate-200'}`}>
                                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${emailNotify ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500">{t('settings.notificationsSection.smsNotifications')}</span>
                                <button onClick={() => setSMSNotify(!smsNotify)} className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${smsNotify ? 'bg-blue-600' : 'bg-slate-200'}`}>
                                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${smsNotify ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500">{t('settings.notificationsSection.marketingEmails')}</span>
                                <button onClick={() => setMarketingEmail(!marketingEmail)} className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${marketingEmail ? 'bg-blue-600' : 'bg-slate-200'}`}>
                                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${marketingEmail ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Khối Appearance (Dark/Light Mode) */}
                    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-slate-100 border-b border-slate-50 dark:border-slate-700 pb-2">
                            <Monitor className="w-4 h-4 text-blue-600" />
                            <span>{t('settings.appearance.sectionTitle')}</span>
                        </div>

                        {/* Preview card */}
                        <div className={`relative rounded-xl overflow-hidden h-16 transition-all duration-500 ${
                            isDark
                                ? 'bg-gradient-to-br from-slate-800 to-slate-900'
                                : 'bg-gradient-to-br from-slate-50 to-blue-50'
                        }`}>
                            <div className={`absolute inset-0 flex items-center justify-center gap-3`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${
                                    isDark ? 'bg-slate-600 text-slate-300' : 'bg-white text-amber-500 shadow-sm'
                                }`}>
                                    <Sun className="w-3.5 h-3.5" />
                                </div>
                                <div className={`h-5 w-px ${ isDark ? 'bg-slate-600' : 'bg-slate-200' }`} />
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${
                                    isDark ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-400'
                                }`}>
                                    <Moon className="w-3.5 h-3.5" />
                                </div>
                                <span className={`text-xs font-bold ml-1 transition-colors duration-300 ${
                                    isDark ? 'text-slate-300' : 'text-slate-500'
                                }`}>
                                    {isDark ? t('settings.appearance.darkMode') : t('settings.appearance.lightMode')}
                                </span>
                            </div>
                        </div>

                        {/* Toggle row */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {isDark
                                    ? <Moon className="w-4 h-4 text-blue-400" />
                                    : <Sun className="w-4 h-4 text-amber-500" />
                                }
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                    {isDark ? t('settings.appearance.darkMode') : t('settings.appearance.lightMode')}
                                </span>
                            </div>
                            {/* Toggle switch */}
                            <button
                                id="theme-toggle"
                                onClick={toggleTheme}
                                aria-label="Toggle dark mode"
                                className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 shrink-0 ${
                                    isDark ? 'bg-blue-600' : 'bg-slate-200'
                                }`}
                            >
                                <span className={`absolute top-1 left-1 w-5 h-5 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ${
                                    isDark
                                        ? 'translate-x-7 bg-white'
                                        : 'translate-x-0 bg-white'
                                }`}>
                                    {isDark
                                        ? <Moon className="w-3 h-3 text-blue-600" />
                                        : <Sun className="w-3 h-3 text-amber-500" />
                                    }
                                </span>
                            </button>
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">
                            {t('settings.appearance.persistNote')}
                        </p>
                    </div>

                    {/* Khối Language */}
                    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-slate-100 border-b border-slate-50 dark:border-slate-700 pb-2">
                            <Globe className="w-4 h-4 text-blue-600" />
                            <span>{t('settings.language.sectionTitle')}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">
                            {t('settings.language.description')}
                        </p>
                        {/* Language Selector Buttons */}
                        <div className="flex gap-2">
                            <button
                                id="lang-en-btn"
                                onClick={() => changeLanguage('en')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border-2 transition-all duration-200 ${
                                    language === 'en'
                                        ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                                        : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-blue-300'
                                }`}
                            >
                                <span className="text-base leading-none">🇺🇸</span>
                                <span>English</span>
                                {language === 'en' && <Check className="w-3.5 h-3.5" />}
                            </button>
                            <button
                                id="lang-vi-btn"
                                onClick={() => changeLanguage('vi')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border-2 transition-all duration-200 ${
                                    language === 'vi'
                                        ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                                        : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-blue-300'
                                }`}
                            >
                                <span className="text-base leading-none">🇻🇳</span>
                                <span>Tiếng Việt</span>
                                {language === 'vi' && <Check className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">
                            {t('settings.language.persistNote')}
                        </p>
                    </div>

                    {/* Khối Quyền Riêng Tư (Privacy) */}
                    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-3">
                        <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-slate-100 border-b border-slate-50 dark:border-slate-700 pb-2">
                            <ShieldCheck className="w-4 h-4 text-blue-600" />
                            <span>{t('settings.privacy.sectionTitle')}</span>
                        </div>
                        <div className="space-y-1 text-xs font-bold text-slate-600 dark:text-slate-400">
                            <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition text-left">
                                <span>{t('settings.privacy.downloadMyData')}</span>
                                <Download className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                            <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition text-left">
                                <span>{t('settings.privacy.privacyPolicy')}</span>
                                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                            <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition text-left">
                                <span>{t('settings.privacy.termsOfService')}</span>
                                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                            <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 transition text-left pt-2 border-t border-slate-50 dark:border-slate-700 mt-1">
                                <span>{t('settings.privacy.deleteAccount')}</span>
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};