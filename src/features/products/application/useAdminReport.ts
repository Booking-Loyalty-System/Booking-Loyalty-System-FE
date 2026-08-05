import { useState } from 'react';
import { toast } from 'sonner';
import { AdminReportRepository } from '../infrastructure/repositories/admin-report/admin-report.repository.implement';

const reportRepo = new AdminReportRepository();

export interface RevenueExportFilter {
    fromDate: string;
    toDate: string;
    compareFromDate: string;
    compareToDate: string;
}

export const useAdminReport = () => {
    const [isExportingExcel, setIsExportingExcel] = useState(false);

    /**
     * Tải file Excel báo cáo doanh thu từ API và trigger download trên trình duyệt.
     */
    const exportRevenueExcel = async (filter: RevenueExportFilter) => {
        setIsExportingExcel(true);
        try {
            const blob = await reportRepo.exportRevenueExcel({
                CurrentFromDate: filter.fromDate,
                CurrentToDate: filter.toDate,
                CompareFromDate: filter.compareFromDate,
                CompareToDate: filter.compareToDate,
            });

            // Tạo URL tạm thời từ blob và trigger download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const timestamp = new Date().toISOString().replace(/[-:.T]/g, '').slice(0, 15);
            a.download = `Revenue_Report_${timestamp}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            toast.success('Xuất báo cáo Excel thành công!');
        } catch (error: any) {
            toast.error(
                'Lỗi xuất báo cáo: ' + (error?.response?.data?.message || error?.message || 'Đã có lỗi xảy ra')
            );
        } finally {
            setIsExportingExcel(false);
        }
    };

    return {
        isExportingExcel,
        exportRevenueExcel,
    };
};
