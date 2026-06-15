import { httpClient } from "@/core/http/httpClient.ts";
import type { ApiResponse } from "@/features/products/domain/apiResponse.ts"; // Dùng chung ApiResponse mẫu của ông
import { ENDPOINTS } from "@/core/api/endpoints.ts";
import type { DailyTimeSlotsSummaryDto } from "../../../domain/models/time-slot/time-slot.dto.ts";
import type { ITimeSlotRepository } from "./time-slot.repository.interface.ts";

export class TimeSlotRepositoryImplement implements ITimeSlotRepository {
    async getWeeklySummary(branchId: string, startDate?: string): Promise<DailyTimeSlotsSummaryDto[]> {
        const params: Record<string, string> = { branchId };
        if (startDate) {
            params.startDate = startDate;
        }

        const response = await httpClient.get<ApiResponse<DailyTimeSlotsSummaryDto[]>>(
            ENDPOINTS.TIME_SLOT.WEEK_SUMMARY,
            { params }
        );

        return (response as unknown as DailyTimeSlotsSummaryDto[]) ?? [];
    }
}