import React from 'react';
import { useAdminDashboard } from '../../../application/useAdminDashboard';
import { DollarSign, BarChart3, Loader2 } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

export function AdminAnalytics() {
  const { chartData, analyticsData, filters, setFilters, isLoading, isError } = useAdminDashboard();

  // Tạo danh sách các Chi nhánh độc nhất để map màu sắc linh hoạt cho Bar Chart
  const uniqueBranches = React.useMemo(() => {
    if (!chartData || chartData.length === 0) return [];
    const branchMap = new Map<string, string>();
    chartData.forEach(item => {
      item.branchRevenues?.forEach(br => {
        branchMap.set(br.branchId, br.branchName);
      });
    });
    return Array.from(branchMap.entries()).map(([id, name]) => ({ id, name }));
  }, [chartData]);

  // Biến đổi cấu trúc mảng để Recharts vẽ Stacked Bar Chart (Biểu đồ cột chồng chi nhánh)
  const branchChartData = React.useMemo(() => {
    if (!chartData) return [];
    return chartData.map(item => {
      const dataPoint: any = { name: item.label };
      item.branchRevenues?.forEach(br => {
        dataPoint[br.branchName] = br.revenue;
      });
      return dataPoint;
    });
  }, [chartData]);

  // Bảng màu cho các chi nhánh khác nhau
  const branchColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  const handleChartClick = (state: any) => {
    if (!state || !state.activeLabel) return;

    const clickedLabel = state.activeLabel.toString();
    const extractedNumber = parseInt(clickedLabel.replace(/\D/g, ''), 10);

    if (isNaN(extractedNumber)) return;

    if (filters.type === 'YEAR') {
      setFilters({
        type: 'MONTH',
        year: filters.year,
        value: extractedNumber
      });
    }

    else if (filters.type === 'QUARTER') {
      const startMonthOfQuarter = (extractedNumber - 1) * 3 + 1;
      setFilters({
        type: 'MONTH',
        year: filters.year,
        value: startMonthOfQuarter
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        Đã có lỗi xảy ra khi tải dữ liệu thống kê. Vui lòng thử lại sau!
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      {/* Header & Filter Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Phân Tích Doanh Thu</h3>
          <p className="text-gray-500">Theo dõi dòng tiền và hiệu suất hoạt động kinh doanh</p>
        </div>

        {/* Bộ lọc Dynamic */}
        <div className="flex flex-wrap gap-3">
          {/* Chọn Loại báo cáo */}
          <select
            value={filters.type}
            onChange={(e) => {
              const type = e.target.value as 'MONTH' | 'QUARTER' | 'YEAR';
              setFilters({
                type,
                year: filters.year,
                value: type === 'MONTH' ? 1 : type === 'QUARTER' ? 1 : undefined
              });
            }}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="MONTH">Xem theo Tháng</option>
            <option value="QUARTER">Xem theo Quý</option>
            <option value="YEAR">Xem theo Năm</option>
          </select>

          {/* Chọn Giá trị cụ thể đi kèm (Tháng hoặc Quý) */}
          {filters.type === 'MONTH' && (
            <select
              value={filters.value}
              onChange={(e) => setFilters({ ...filters, value: Number(e.target.value) })}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
              ))}
            </select>
          )}

          {filters.type === 'QUARTER' && (
            <select
              value={filters.value}
              onChange={(e) => setFilters({ ...filters, value: Number(e.target.value) })}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>Quý 1</option>
              <option value={2}>Quý 2</option>
              <option value={3}>Quý 3</option>
              <option value={4}>Quý 4</option>
            </select>
          )}

          {/* Chọn Năm */}
          <select
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: Number(e.target.value) })}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>Năm {y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Thẻ hiển thị Tổng số liệu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tổng doanh thu kỳ hiện tại</p>
            <p className="text-2xl font-bold text-gray-900">
              {analyticsData?.totalRevenue?.toLocaleString('vi-VN')} VND
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-50 rounded-lg">
            <BarChart3 className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Số lượng phân đoạn ghi nhận</p>
            <p className="text-2xl font-bold text-gray-900">{chartData?.length || 0} Điểm mốc</p>
          </div>
        </div>
      </div>

      {/* Khu vực Biểu đồ */}
      <div className="grid grid-cols-1 gap-8">

        {/* Biểu đồ Xu hướng Doanh thu (So với chu kỳ trước) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h4 className="text-xl font-bold text-gray-900 mb-6">Xu Hướng Tăng Trưởng Doanh Thu</h4>
          {/* Tăng chiều cao lên h-[500px] để kéo dãn trục đứng */}
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                <defs>
                  <linearGradient id="currentRevColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 13, fontWeight: 500 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 13 }} tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(value: any) => [`${Number(value).toLocaleString('vi-VN')} VND`]} />
                <Legend verticalAlign="top" height={40} iconSize={16} wrapperStyle={{ fontSize: 14, fontWeight: 500 }} />
                <Area type="monotone" name="Kỳ này" dataKey="currentPeriodRevenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#currentRevColor)" />
                <Area type="monotone" name="Cùng kỳ năm ngoái" dataKey="previousPeriodRevenue" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ Cột Chồng Phân Rã Theo Chi Nhánh */}
        {/* Biểu đồ Cột Nhóm Phân Rã Theo Chi Nhánh (Đứng kế nhau) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h4 className="text-xl font-bold text-gray-900 mb-6">Doanh Thu Chi Tiết Theo Chi Nhánh</h4>

          {/* Bọc thêm một lớp div hỗ trợ cuộn ngang tự động nếu dữ liệu quá dày (ví dụ 31 ngày) */}
          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {/* Nếu hiển thị dạng MONTH (nhiều ngày), ép min-width rộng ra để các cột đứng giãn ra thoải mái */}
            <div className="h-[500px]" style={{ minWidth: filters.type === 'MONTH' ? '1400px' : '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={branchChartData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }} barGap={4} onClick={handleChartClick} className={filters.type !== 'MONTH' ? 'cursor-pointer' : ''}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 13, fontWeight: 500 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 13 }} tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(value: any) => [`${Number(value).toLocaleString('vi-VN')} VND`]} />
                  <Legend verticalAlign="top" height={40} iconSize={16} wrapperStyle={{ fontSize: 14, fontWeight: 500 }} />
                  {uniqueBranches.map((branch, index) => (
                    <Bar
                      key={branch.id}
                      dataKey={branch.name}
                      fill={branchColors[index % branchColors.length]}
                      radius={[4, 4, 0, 0]}
                      maxBarSize={30} // Giới hạn kích thước cột tối đa để không bị quá to khi ít dữ liệu
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}