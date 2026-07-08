import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";
import { useAdminDashboard } from "../../application/useAdminDashboard";

interface RevenueComparisonCardProps {
    dateFilter: { fromDate: string; toDate: string; compareFromDate: string; compareToDate: string };
    activeTab?: "custom" | "month" | "quarter" | "year";
}

export function RevenueComparisonCard({ dateFilter, activeTab = "custom" }: RevenueComparisonCardProps) {
    const { revenueComparison, isLoading } = useAdminDashboard(dateFilter);

    if (isLoading) {
        return <div className="p-6 bg-white rounded-xl border border-gray-200 animate-pulse text-center">Đang tải dữ liệu đối soát...</div>;
    }

    const current = revenueComparison?.currentRevenue ?? 0;
    const previous = revenueComparison?.previousRevenue ?? 0;
    const difference = revenueComparison?.revenueDifference ?? 0;
    const rate = revenueComparison?.growthRate ?? 0;

    const isGrowth = difference >= 0;

    const getPeriodLabel = (startDateStr: string, endDateStr: string) => {
        if (activeTab === "custom") return `${startDateStr} → ${endDateStr}`;

        const date = new Date(startDateStr);
        const year = date.getFullYear();
        const month = date.getMonth(); // 0-11

        if (activeTab === "month") {
            return `Tháng ${month + 1} năm ${year}`;
        }
        if (activeTab === "quarter") {
            const quarter = Math.floor(month / 3) + 1;
            return `Quý ${quarter} năm ${year}`;
        }
        if (activeTab === "year") {
            return `Năm ${year}`;
        }
        return `${startDateStr} → ${endDateStr}`;
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div>
                    <h3 className="font-bold text-gray-900 text-lg">Đối Soát & So Sánh Doanh Thu</h3>
                    <p className="text-xs text-gray-500 mt-0.5">So sánh hiệu suất doanh thu giữa hai chu kỳ tùy chọn</p>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${isGrowth ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}>
                    {isGrowth ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {isGrowth ? `+${rate}%` : `${rate}%`}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-gray-100 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                <div className="p-6 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span>Kỳ hiện tại ({getPeriodLabel(dateFilter.fromDate, dateFilter.toDate)})</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                        {current.toLocaleString("vi-VN")} <span className="text-sm font-normal text-gray-500">đ</span>
                    </div>
                </div>

                <div className="p-6 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Kỳ đối chứng ({getPeriodLabel(dateFilter.compareFromDate, dateFilter.compareToDate)})</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-600">
                        {previous.toLocaleString("vi-VN")} <span className="text-sm font-normal text-gray-500">đ</span>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-gray-50/70 flex flex-wrap items-center justify-between gap-2 text-sm px-6">
                <span className="text-gray-600 font-medium flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-gray-400" /> Biến động chênh lệch:
                </span>
                <div className={`font-semibold text-base ${isGrowth ? "text-emerald-600" : "text-rose-600"}`}>
                    {isGrowth ? "Tăng trưởng: +" : "Sụt giảm: "}
                    {difference.toLocaleString("vi-VN")} đ
                </div>
            </div>
        </div>
    );
}