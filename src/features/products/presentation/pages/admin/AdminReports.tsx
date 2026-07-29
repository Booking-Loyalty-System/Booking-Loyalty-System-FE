import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FileText,
  FileSpreadsheet,
  Calendar,
} from "lucide-react";
import { RevenueComparisonCard } from "../../components/RevenueComparisonCard";

// Định nghĩa các kiểu filter nhanh
type FilterMode = "custom" | "month" | "quarter" | "year";

export function AdminReports() {
  const { t } = useTranslation("customer");
  const [dateFilter, setDateFilter] = useState({
    fromDate: "2026-06-01",
    toDate: "2026-07-30",
    compareFromDate: "2026-05-01",
    compareToDate: "2026-05-31",
  });

  const [activeTab, setActiveTab] = useState<FilterMode>("custom");

  const formatDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Hàm tính toán ngày tự động để so sánh
  const handleQuickFilter = (mode: FilterMode) => {
    setActiveTab(mode);
    const now = new Date();
    const currentYear = now.getFullYear();

    if (mode === "month") {
      const fromDate = new Date(currentYear, now.getMonth(), 1);
      const toDate = new Date(currentYear, now.getMonth() + 1, 0);
      const compareFromDate = new Date(currentYear, now.getMonth() - 1, 1);
      const compareToDate = new Date(currentYear, now.getMonth(), 0);
      setDateFilter({
        fromDate: formatDateString(fromDate),
        toDate: formatDateString(toDate),
        compareFromDate: formatDateString(compareFromDate),
        compareToDate: formatDateString(compareToDate),
      });
    } else if (mode === "quarter") {
      const currentQuarter = Math.floor(now.getMonth() / 3);
      const fromDate = new Date(currentYear, currentQuarter * 3, 1);
      const toDate = new Date(currentYear, (currentQuarter + 1) * 3, 0);
      const compareFromDate = new Date(currentYear, (currentQuarter - 1) * 3, 1);
      const compareToDate = new Date(currentYear, currentQuarter * 3, 0);
      setDateFilter({
        fromDate: formatDateString(fromDate),
        toDate: formatDateString(toDate),
        compareFromDate: formatDateString(compareFromDate),
        compareToDate: formatDateString(compareToDate),
      });
    } else if (mode === "year") {
      setDateFilter({
        fromDate: `${currentYear}-01-01`,
        toDate: `${currentYear}-12-31`,
        compareFromDate: `${currentYear - 1}-01-01`,
        compareToDate: `${currentYear - 1}-12-31`,
      });
    }
  };

  const handleQuarterChange = (type: "current" | "compare", field: "q" | "year", value: string) => {
    const isCurrent = type === "current";
    const currentPrefix = isCurrent ? "fromDate" : "compareFromDate";
    const toPrefix = isCurrent ? "toDate" : "compareToDate";

    const currentDateStr = dateFilter[currentPrefix];
    let year = parseInt(currentDateStr.split("-")[0]);
    let q = Math.ceil(parseInt(currentDateStr.split("-")[1]) / 3);

    if (field === "q") q = parseInt(value);
    if (field === "year") year = parseInt(value);

    const startMonth = (q - 1) * 3 + 1;
    const endMonth = q * 3;
    const lastDay = new Date(year, endMonth, 0).getDate();

    setDateFilter({
      ...dateFilter,
      [currentPrefix]: `${year}-${String(startMonth).padStart(2, "0")}-01`,
      [toPrefix]: `${year}-${String(endMonth).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`,
    });
  };

  const handleYearChange = (type: "current" | "compare", yearValue: string) => {
    const year = parseInt(yearValue) || new Date().getFullYear();
    setDateFilter({
      ...dateFilter,
      ...(type === "current"
        ? { fromDate: `${year}-01-01`, toDate: `${year}-12-31` }
        : { compareFromDate: `${year}-01-01`, compareToDate: `${year}-12-31` }),
    });
  };

  const getQuarter = (dateString: string) => Math.ceil(parseInt(dateString.split("-")[1]) / 3);
  const getYear = (dateString: string) => dateString.split("-")[0];

  const handleExportPDF = () => alert("Exporting report as PDF...");
  const handleExportExcel = () => alert("Exporting report as Excel...");

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('adminReports.title')}</h1>
            <p className="text-gray-500">
              Comprehensive business insights and financial comparisons
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
              <FileText className="w-4 h-4" /> {t('adminReports.exportPDF')}
            </button>
            <button onClick={handleExportExcel} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
              <FileSpreadsheet className="w-4 h-4" /> {t('adminReports.exportExcel')}
            </button>
          </div>
        </div>

        {/* Bộ Lọc Ngày Cho API Đối Soát Doanh Thu */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" /> {t('adminReports.setupComparisonTitle')}
            </h3>

            <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
              <button onClick={() => handleQuickFilter("custom")} className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "custom" ? "bg-white text-blue-600 shadow-xs" : "text-gray-500 hover:text-gray-900"}`}>{t('adminReports.custom')}</button>
              <button onClick={() => handleQuickFilter("month")} className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "month" ? "bg-white text-blue-600 shadow-xs" : "text-gray-500 hover:text-gray-900"}`}>{t('adminReports.byMonth')}</button>
              <button onClick={() => handleQuickFilter("quarter")} className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "quarter" ? "bg-white text-blue-600 shadow-xs" : "text-gray-500 hover:text-gray-900"}`}>{t('adminReports.byQuarter')}</button>
              <button onClick={() => handleQuickFilter("year")} className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "year" ? "bg-white text-blue-600 shadow-xs" : "text-gray-500 hover:text-gray-900"}`}>{t('adminReports.byYear')}</button>
            </div>
          </div>

          <div className="mt-4">
            {/* CHẾ ĐỘ CUSTOM: HIỂN THỊ 4 Ô NGÀY */}
            {activeTab === "custom" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-500">{t('adminReports.currentPeriodFrom')}</label><input type="date" value={dateFilter.fromDate} onChange={(e) => setDateFilter({ ...dateFilter, fromDate: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-hidden" /></div>
                <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-500">{t('adminReports.currentPeriodTo')}</label><input type="date" value={dateFilter.toDate} onChange={(e) => setDateFilter({ ...dateFilter, toDate: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-hidden" /></div>
                <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-500">{t('adminReports.comparePeriodFrom')}</label><input type="date" value={dateFilter.compareFromDate} onChange={(e) => setDateFilter({ ...dateFilter, compareFromDate: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-hidden" /></div>
                <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-500">{t('adminReports.comparePeriodTo')}</label><input type="date" value={dateFilter.compareToDate} onChange={(e) => setDateFilter({ ...dateFilter, compareToDate: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-hidden" /></div>
              </div>
            )}

            {/* CHẾ ĐỘ THÁNG: HIỂN THỊ CHỌN THÁNG/NĂM */}
            {activeTab === "month" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">{t('adminReports.currentMonth')}</label>
                  <input type="month" value={dateFilter.fromDate.substring(0, 7)}
                    onChange={(e) => {
                      const [y, m] = e.target.value.split("-");
                      const lastDay = new Date(Number(y), Number(m), 0).getDate();
                      setDateFilter({ ...dateFilter, fromDate: `${y}-${m}-01`, toDate: `${y}-${m}-${lastDay}` });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">{t('adminReports.compareMonth')}</label>
                  <input type="month" value={dateFilter.compareFromDate.substring(0, 7)}
                    onChange={(e) => {
                      const [y, m] = e.target.value.split("-");
                      const lastDay = new Date(Number(y), Number(m), 0).getDate();
                      setDateFilter({ ...dateFilter, compareFromDate: `${y}-${m}-01`, compareToDate: `${y}-${m}-${lastDay}` });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden"
                  />
                </div>
              </div>
            )}

            {/* CHẾ ĐỘ QUÝ: HIỂN THỊ DROP SELECT QUÝ */}
            {activeTab === "quarter" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">{t('adminReports.currentQuarter')}</label>
                  <div className="flex gap-2">
                    <select value={getQuarter(dateFilter.fromDate)} onChange={(e) => handleQuarterChange("current", "q", e.target.value)} className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg outline-hidden">
                      <option value={1}>{t('adminReports.quarterPlaceholder', { q: 1 })}</option><option value={2}>{t('adminReports.quarterPlaceholder', { q: 2 })}</option><option value={3}>{t('adminReports.quarterPlaceholder', { q: 3 })}</option><option value={4}>{t('adminReports.quarterPlaceholder', { q: 4 })}</option>
                    </select>
                    <input type="number" value={getYear(dateFilter.fromDate)} onChange={(e) => handleQuarterChange("current", "year", e.target.value)} className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg outline-hidden" placeholder={t('adminReports.yearPlaceholder')} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">{t('adminReports.compareQuarter')}</label>
                  <div className="flex gap-2">
                    <select value={getQuarter(dateFilter.compareFromDate)} onChange={(e) => handleQuarterChange("compare", "q", e.target.value)} className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg outline-hidden">
                      <option value={1}>{t('adminReports.quarterPlaceholder', { q: 1 })}</option><option value={2}>{t('adminReports.quarterPlaceholder', { q: 2 })}</option><option value={3}>{t('adminReports.quarterPlaceholder', { q: 3 })}</option><option value={4}>{t('adminReports.quarterPlaceholder', { q: 4 })}</option>
                    </select>
                    <input type="number" value={getYear(dateFilter.compareFromDate)} onChange={(e) => handleQuarterChange("compare", "year", e.target.value)} className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg outline-hidden" placeholder={t('adminReports.yearPlaceholder')} />
                  </div>
                </div>
              </div>
            )}

            {/* CHẾ ĐỘ NĂM: CHỈ NHẬP NĂM */}
            {activeTab === "year" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">{t('adminReports.currentYear')}</label>
                  <input type="number" value={getYear(dateFilter.fromDate)} onChange={(e) => handleYearChange("current", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">{t('adminReports.compareYear')}</label>
                  <input type="number" value={getYear(dateFilter.compareFromDate)} onChange={(e) => handleYearChange("compare", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden" />
                </div>
              </div>
            )}
          </div>
        </div>

        <RevenueComparisonCard dateFilter={dateFilter} activeTab={activeTab} />
      </div>
    </div>
  );
}