import type { ITimeSlotRepository } from "./time-slot.repository.interface.ts";
import type { DailyTimeSlotsSummaryDto, BranchTimeSlotGroupDto } from "../../../domain/models/time-slot/time-slot.dto.ts";

export class TimeSlotRepositoryMock implements ITimeSlotRepository {
    async getWeeklySummary(branchId: string, startDate?: string): Promise<DailyTimeSlotsSummaryDto[]> {
        await new Promise(resolve => setTimeout(resolve, 300));

        const start = startDate ? new Date(startDate) : new Date();
        const summaries: DailyTimeSlotsSummaryDto[] = [];

        const dayNames = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];

        const standardSlots = [
            { id: "ts_1", start: "08:00", end: "09:00", ratio: "3/5", avail: true },
            { id: "ts_2", start: "09:00", end: "10:00", ratio: "4/5", avail: true },
            { id: "ts_3", start: "10:00", end: "11:00", ratio: "2/5", avail: true },
            { id: "ts_4", start: "11:00", end: "12:00", ratio: "5/5", avail: true },
            { id: "ts_5", start: "13:00", end: "14:00", ratio: "1/5", avail: true },
            { id: "ts_6", start: "14:00", end: "15:00", ratio: "5/5", avail: true },
            { id: "ts_7", start: "15:00", end: "16:00", ratio: "4/5", avail: true },
            { id: "ts_8", start: "16:00", end: "17:00", ratio: "3/5", avail: true },
            { id: "ts_9", start: "17:00", end: "18:00", ratio: "5/5", avail: true },
            { id: "ts_10", start: "18:00", end: "19:00", ratio: "2/5", avail: true },
            { id: "ts_11", start: "19:00", end: "20:00", ratio: "0/5", avail: false }
        ];

        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(start);
            currentDate.setDate(start.getDate() + i);

            const dateStr = currentDate.toISOString().split('T')[0];
            const dayOfWeek = dayNames[currentDate.getDay()];

            const timeSlots: BranchTimeSlotGroupDto[] = standardSlots.map(s => ({
                timeSlotId: `${s.id}_${branchId}_${dateStr}`,
                startTime: s.start,
                endTime: s.end,
                slotRatio: s.ratio,
                isAvailable: s.avail
            }));

            summaries.push({
                date: dateStr,
                dayOfWeek,
                timeSlots
            });
        }

        return summaries;
    }
}
