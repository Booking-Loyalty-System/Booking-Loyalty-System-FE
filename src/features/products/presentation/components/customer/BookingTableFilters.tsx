import {QrCode, Search} from "lucide-react";
import { useTranslation } from "react-i18next";

interface BookingTableFiltersProps {
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    statusFilter: string;
    setStatusFilter: (val: string) => void;
    onOpenQr: () => void;
}

export const BookingTableFilters: React.FC<BookingTableFiltersProps> = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, onOpenQr }) => {
    const { t } = useTranslation("customer");
    return (
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
            <h2 className="text-lg font-bold text-slate-800">{t('dashboardStats.todayBookings')}</h2>

            <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full xl:w-auto items-center">
                <div className="relative w-full sm:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder={t('dashboardStats.searchPlaceholder')}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select
                    className="w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm cursor-pointer"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All">{t('dashboardStats.allStatus')}</option>
                    <option value="Pending">{t('dashboardStats.pending')}</option>
                    <option value="Confirmed">{t('dashboardStats.confirmed')}</option>
                    <option value="CheckedIn">{t('dashboardStats.checkedIn')}</option>
                    <option value="Queued">{t('dashboardStats.queued')}</option>
                    <option value="InProgress">{t('dashboardStats.inProgressStatus')}</option>
                    <option value="Completed">{t('dashboardStats.completedStatus')}</option>
                    <option value="CheckedOut">{t('dashboardStats.checkedOut')}</option>
                    <option value="Cancelled">{t('dashboardStats.cancelled')}</option>
                    <option value="NoShow">{t('dashboardStats.noShow')}</option>
                </select>

                <button
                    onClick={onOpenQr}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 transition-all shrink-0"
                >
                    <QrCode className="w-4 h-4" />
                    <span>Scan QR</span>
                </button>
            </div>
        </div>
    );
};