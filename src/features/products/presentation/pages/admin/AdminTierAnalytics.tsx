import React from 'react';
import { Users, Loader2, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { useAdminTierStatistic } from '../../../application/useAdminStatistic';

export function AdminTierAnalytics() {
    const { tierStats, filters, setFilters, isLoading, isError } = useAdminTierStatistic();

    // 1. Trích xuất danh sách các hạng (Tiers) duy nhất
    const uniqueTiers = React.useMemo(() => {
        if (!tierStats || tierStats.length === 0) return [];
        const tierNames = new Set<string>();
        tierStats.forEach(period => {
            period.tiers?.forEach(t => tierNames.add(t.tierName));
        });
        return Array.from(tierNames);
    }, [tierStats]);

    // 2. Chuyển đổi dữ liệu tương thích với Recharts cấu trúc ngang
    const chartData = React.useMemo(() => {
        if (!tierStats) return [];
        return tierStats.map(period => {
            const dataPoint: any = { name: period.periodLabel };
            period.tiers?.forEach(t => {
                dataPoint[t.tierName] = t.count;
            });
            return dataPoint;
        });
    }, [tierStats]);

    // Bảng màu sắc tương ứng chuẩn chỉnh cho các hạng thành viên
    const tierColors: { [key: string]: string } = {
        "Bronze": "#b45309", // Nâu đồng
        "Silver": "#9ca3af", // Bạc
        "Gold": "#eab308",   // Vàng
        "Diamond": "#06b6d4" // Kim cương
    };
    const defaultColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 text-center text-rose-500 font-semibold">
                Lỗi tải dữ liệu phân tích biến động hạng thành viên.
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8 animate-fade-in">
            {/* Tiêu đề & Bộ lọc UI sang trọng */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">Biến Động Hạng Thành Viên</h3>
                    <p className="text-sm text-gray-500">Phân tích số lượng khách hàng đạt mốc hạng theo thời gian</p>
                </div>

                <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-inner w-fit h-fit">
                    <button onClick={() => setFilters({ ...filters, criteria: 'month' })} className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${filters.criteria === 'month' ? 'bg-white text-blue-600 shadow-md font-bold' : 'text-gray-500 hover:text-gray-900'}`}>Theo Tháng</button>
                    <button onClick={() => setFilters({ ...filters, criteria: 'quarter' })} className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${filters.criteria === 'quarter' ? 'bg-white text-blue-600 shadow-md font-bold' : 'text-gray-500 hover:text-gray-900'}`}>Theo Quý</button>
                    <button onClick={() => setFilters({ ...filters, criteria: 'year' })} className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${filters.criteria === 'year' ? 'bg-white text-blue-600 shadow-md font-bold' : 'text-gray-500 hover:text-gray-900'}`}>Theo Năm</button>

                    <select
                        value={filters.year}
                        onChange={(e) => setFilters({ ...filters, year: Number(e.target.value) })}
                        className="ml-2 px-3 py-1 bg-transparent text-xs font-bold text-gray-600 border-l border-gray-300 focus:outline-hidden cursor-pointer"
                    >
                        {[2024, 2025, 2026, 2027].map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Khu vực Đồ thị - ĐÃ ĐƯỢC FIX LỖI LAYOUT TỌA ĐỘ */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h4 className="text-md font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" /> Biểu đồ phân bổ tỷ lệ mốc hạng
                </h4>
                {/* Chiều cao động dựa trên số lượng hàng để tránh bị dính chữ */}
                <div style={{ height: chartData.length * 60 + 100, minHeight: '300px', maxHeight: '500px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            layout="vertical" // Biểu đồ hướng dọc (cột hiển thị ngang)
                            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                        >
                            {/* Lưới dọc mờ phía sau */}
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />

                            {/* TRỤC X: Chỉ định rõ loại hiển thị số lượng */}
                            <XAxis
                                type="number"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#6b7280", fontSize: 12 }}
                                tickFormatter={(val) => `${val} user`}
                            />

                            {/* TRỤC Y: Chứa Nhãn Chu Kỳ (ví dụ: Tháng 01/2026) */}
                            <YAxis
                                type="category"
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#4b5563", fontSize: 12, fontWeight: 500 }}
                                width={100}
                            />

                            <Tooltip
                                cursor={{ fill: '#f9fafb' }}
                                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value: any) => [`${value} Khách hàng`]}
                            />

                            <Legend verticalAlign="top" height={40} iconType="circle" wrapperStyle={{ fontSize: 13, fontWeight: 500 }} />

                            {/* VẼ CÁC THANH CỘT CHỒNG NGANG */}
                            {uniqueTiers.map((tierName, index) => (
                                <Bar
                                    key={tierName}
                                    dataKey={tierName} // Tên trường (Bronze, Silver...) lấy từ data
                                    name={tierName}    // Hiển thị ở chú thích ghi chú
                                    stackId="a"        // Gộp chung vào 1 thanh duy nhất xếp chồng lên nhau
                                    fill={tierColors[tierName] || defaultColors[index % defaultColors.length]}
                                    maxBarSize={24}
                                    radius={[0, 0, 0, 0]} // Tránh bo góc lỗi khi xếp chồng
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bảng dữ liệu chi tiết */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h4 className="text-md font-bold text-gray-900">Bảng dữ liệu đối soát chu kỳ</h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase text-gray-500 anonymity-header">
                                <th className="p-4 w-1/4">Chu kỳ thời gian</th>
                                <th className="p-4 text-center">Hạng thành viên</th>
                                <th className="p-4 text-center">Số lượng</th>
                                <th className="p-4 text-center">Tỷ lệ nội bộ kỳ</th>
                                <th className="p-4 text-right">Tăng trưởng với kỳ trước</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {tierStats.map((period) => (
                                <React.Fragment key={period.periodLabel}>
                                    {period.tiers.map((tier, idx) => (
                                        <tr key={tier.tierId} className="hover:bg-gray-50/50 transition-colors">
                                            {idx === 0 && (
                                                <td className="p-4 font-bold text-gray-900 align-middle bg-white border-r border-gray-100" rowSpan={period.tiers.length}>
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                            <Users className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <div className="text-gray-900 font-semibold">{period.periodLabel}</div>
                                                            <div className="text-xs font-normal text-gray-400">Tổng: {period.totalCustomersInPeriod} user</div>
                                                        </div>
                                                    </div>
                                                </td>
                                            )}
                                            <td className="p-4 text-center">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border shadow-2xs" style={{
                                                    backgroundColor: tierColors[tier.tierName] + '12',
                                                    borderColor: tierColors[tier.tierName] + '30',
                                                    color: tierColors[tier.tierName]
                                                }}>
                                                    {tier.tierName}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center font-bold text-gray-800">{tier.count}</td>
                                            <td className="p-4 text-center font-medium text-gray-500">{tier.percentage}%</td>
                                            <td className="p-4 text-right align-middle pr-6">
                                                {tier.percentageChangeFromPrevious === 0 ? (
                                                    <span className="text-gray-400 text-xs font-medium">—</span>
                                                ) : tier.percentageChangeFromPrevious > 0 ? (
                                                    <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                                                        <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 stroke-[2.5]" /> +{tier.percentageChangeFromPrevious}%
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                                                        <ArrowDownRight className="w-3.5 h-3.5 mr-0.5 stroke-[2.5]" /> {tier.percentageChangeFromPrevious}%
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                            {tierStats.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-gray-400 font-medium">
                                        Không có dữ liệu thống kê trong chu kỳ này.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}