import {QrCode, Search} from "lucide-react";

interface BookingTableFiltersProps {
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    statusFilter: string;
    setStatusFilter: (val: string) => void;
    onOpenQr: () => void;
}

export const BookingTableFilters: React.FC<BookingTableFiltersProps> = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, onOpenQr }) => {
    return (
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
            <h2 className="text-lg font-bold text-slate-800">Lịch Đặt Hôm Nay</h2>

            <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full xl:w-auto items-center">
                <div className="relative w-full sm:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Mã, tên xe, biển số..."
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
                    <option value="All">Tất cả trạng thái</option>
                    <option value="Pending">Pending (Chờ xác nhận)</option>
                    <option value="Confirmed">Confirmed (Đã xác nhận)</option>
                    <option value="CheckedIn">Checked In (Đã tới)</option>
                    <option value="Queued">Queued (Chờ rửa)</option>
                    <option value="InProgress">In Progress (Đang rửa)</option>
                    <option value="Completed">Completed (Xong)</option>
                    <option value="CheckedOut">Checked Out (Đã thanh toán)</option>
                    <option value="Cancelled">Cancelled (Đã hủy)</option>
                    <option value="NoShow">No Show (Không đến)</option>
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