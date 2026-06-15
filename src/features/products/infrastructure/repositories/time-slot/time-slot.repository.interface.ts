import type { DailyTimeSlotsSummaryDto } from "../../../domain/models/time-slot/time-slot.dto.ts";

export interface ITimeSlotRepository {
    getWeeklySummary(branchId: string, startDate?: string): Promise<DailyTimeSlotsSummaryDto[]>;
}