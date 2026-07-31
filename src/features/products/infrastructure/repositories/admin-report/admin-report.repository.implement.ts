import { httpClient } from '@/core/http/httpClient';
import { ENDPOINTS } from '@/core/api/endpoints';

export interface RevenueExportParams {
    CurrentFromDate?: string;
    CurrentToDate?: string;
    CompareFromDate?: string;
    CompareToDate?: string;
}

export class AdminReportRepository {
    /**
     * Xuất báo cáo doanh thu ra file Excel.
     * API trả về blob nhị phân (application/vnd.openxmlformats-officedocument.spreadsheetml.sheet).
     */
    async exportRevenueExcel(params: RevenueExportParams): Promise<Blob> {
        const response = await httpClient.get<Blob>(
            ENDPOINTS.REPORT.REVENUE_EXPORT_EXCEL,
            {
                responseType: 'blob',
                params: {
                    CurrentFromDate: params.CurrentFromDate,
                    CurrentToDate: params.CurrentToDate,
                    CompareFromDate: params.CompareFromDate,
                    CompareToDate: params.CompareToDate,
                },
            }
        );
        return response;
    }
}
