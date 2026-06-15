import { useQuery } from '@tanstack/react-query';
import { TimeSlotRepositoryImplement } from '../infrastructure/repositories/time-slot/time-slot.repository.implement.ts';
import type { DailyTimeSlotsSummaryDto } from '../domain/models/time-slot/time-slot.dto.ts';

const timeSlotRepository = new TimeSlotRepositoryImplement();

interface UseTimeSlotProps {
    branchId: string | null | undefined;
    startDate?: string; // Định dạng YYYY-MM-DD
}

export const useTimeSlot = ({ branchId, startDate }: UseTimeSlotProps) => {

    const {
        data: weeklySummary = [],
        isLoading: isLoadingWeekly,
        error: fetchWeeklyError,
        isFetching: isFetchingWeekly
    } = useQuery<DailyTimeSlotsSummaryDto[]>({
        queryKey: ['time_slots_weekly', branchId, startDate],
        queryFn: () => timeSlotRepository.getWeeklySummary(branchId!, startDate),
        enabled: !!branchId && !!startDate,
        staleTime: 1000 * 60 * 2,
    });

    return {
        weeklySummary,
        isLoading: isLoadingWeekly,
        isFetching: isFetchingWeekly,
        error: fetchWeeklyError,
    };
};