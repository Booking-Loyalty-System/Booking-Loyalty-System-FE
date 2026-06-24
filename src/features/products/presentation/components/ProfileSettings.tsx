import React, { useState, useEffect } from 'react';
import { User, Edit3, Lock, Bell, ShieldCheck, Download, ExternalLink, Trash2, Check, X, Loader2 } from 'lucide-react';
import { useCustomerMe, useUpdateCustomer } from '@/features/products/application/useCustomer.ts';
import { toast } from 'sonner';

export const ProfileSettings: React.FC = () => {
    const { customerMe } = useCustomerMe();
    const { updateCustomer, isUpdating } = useUpdateCustomer();

    const [emailNotify, setEmailNotify] = useState(true);
    const [smsNotify, setSMSNotify] = useState(true);
    const [marketingEmail, setMarketingEmail] = useState(false);
    const [twoFactor, setTwoFactor] = useState(false);

    // Form state
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
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

    return (
        <div className="w-full font-sans text-slate-800">
            <p className="text-sm font-medium text-slate-400 mb-6">Manage your account information and preferences</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* CỘT TRÁI + GIỮA (2/3): FORM CHÍNH */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Khối 1: Personal Information */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                            <div className="flex items-center gap-2 font-bold text-base text-slate-900">
                                <User className="w-5 h-5 text-blue-600" />
                                <span>Personal Information</span>
                            </div>
                            
                            {!isEditing ? (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="inline-flex items-center gap-1 border-2 border-blue-600 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-blue-50 transition"
                                >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button 
                                        onClick={handleCancel}
                                        disabled={isUpdating}
                                        className="inline-flex items-center gap-1 border-2 border-slate-300 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-slate-50 transition disabled:opacity-50"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                        <span>Cancel</span>
                                    </button>
                                    <button 
                                        onClick={handleSave}
                                        disabled={isUpdating}
                                        className="inline-flex items-center gap-1 bg-blue-600 text-white border-2 border-blue-600 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                                    >
                                        {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                        <span>Save</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                                <input 
                                    type="text" 
                                    readOnly={!isEditing} 
                                    value={isEditing ? formData.fullName : (customerMe?.fullName || 'Khách hàng')} 
                                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                    className={`w-full border rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none transition-colors ${isEditing ? 'bg-white border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100' : 'bg-slate-50/70 border-slate-200/60'}`} 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                                <input 
                                    type="text" 
                                    readOnly={!isEditing} 
                                    value={isEditing ? formData.phoneNumber : (customerMe?.phoneNumber || '0901234567')} 
                                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                    className={`w-full border rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none transition-colors ${isEditing ? 'bg-white border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100' : 'bg-slate-50/70 border-slate-200/60'}`} 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address <span className="normal-case text-[10px] text-slate-400 font-medium">(Read-only)</span></label>
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
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
                        <div className="flex items-center gap-2 font-bold text-base text-slate-900 border-b border-slate-50 pb-3">
                            <Lock className="w-5 h-5 text-blue-600" />
                            <span>Password & Security</span>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5 relative">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Password</label>
                                <input type="password" value="••••••••" disabled className="w-full bg-slate-50/40 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono" />
                            </div>
                            <div className="space-y-1.5 relative">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Password</label>
                                <input type="password" value="••••••••" disabled className="w-full bg-slate-50/40 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono" />
                            </div>
                            <div className="space-y-1.5 relative">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirm New Password</label>
                                <input type="password" value="••••••••" disabled className="w-full bg-slate-50/40 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono" />
                            </div>

                            <button className="bg-blue-600 text-white text-sm font-bold w-full sm:w-auto px-6 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-sm">
                                Update Password
                            </button>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800">Two-Factor Authentication</h4>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">Add an extra layer of security to your account</p>
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
                                <p className="text-xs text-blue-100 font-medium">Member Since</p>
                                <p className="text-lg font-black tracking-wide">January 2026</p>
                            </div>
                        </div>
                        <div className="pt-2 space-y-2 text-sm font-semibold border-t border-white/10">
                            <div className="flex justify-between opacity-90">
                                <span>Total Bookings:</span>
                                <span className="font-bold">{customerMe?.totalWashes ?? 5}</span>
                            </div>
                            <div className="flex justify-between opacity-90">
                                <span>Total Spent:</span>
                                <span className="font-bold">
                                    {(customerMe?.totalSpent ?? 3175000).toLocaleString('vi-VN')}đ
                                </span>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <span>Points Balance:</span>
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
                            <span>Notifications</span>
                        </div>
                        <div className="space-y-3.5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500">Email Notifications</span>
                                <button onClick={() => setEmailNotify(!emailNotify)} className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${emailNotify ? 'bg-blue-600' : 'bg-slate-200'}`}>
                                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${emailNotify ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500">SMS Notifications</span>
                                <button onClick={() => setSMSNotify(!smsNotify)} className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${smsNotify ? 'bg-blue-600' : 'bg-slate-200'}`}>
                                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${smsNotify ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500">Marketing Emails</span>
                                <button onClick={() => setMarketingEmail(!marketingEmail)} className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${marketingEmail ? 'bg-blue-600' : 'bg-slate-200'}`}>
                                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${marketingEmail ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Khối Quyền Riêng Tư (Privacy) */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3">
                        <div className="flex items-center gap-2 font-bold text-sm text-slate-900 border-b border-slate-50 pb-2">
                            <ShieldCheck className="w-4 h-4 text-blue-600" />
                            <span>Privacy</span>
                        </div>
                        <div className="space-y-1 text-xs font-bold text-slate-600">
                            <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition text-left">
                                <span>Download My Data</span>
                                <Download className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                            <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition text-left">
                                <span>Privacy Policy</span>
                                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                            <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition text-left">
                                <span>Terms of Service</span>
                                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                            <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-rose-50 text-rose-600 transition text-left pt-2 border-t border-slate-50 mt-1">
                                <span>Delete Account</span>
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};