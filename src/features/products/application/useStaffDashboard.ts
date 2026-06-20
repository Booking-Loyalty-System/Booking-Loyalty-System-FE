import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StaffBookingRepositoryImplement, type UpdateBookingStatusPayload } from '../infrastructure/repositories/staff/staff.repository.implement';
import { StaffBookingRepositoryMock } from '../infrastructure/repositories/staff/staff.repository.mock';
import { format } from 'date-fns';

// 🌟 DEV MODE TOGGLE: Sử dụng Mock Repository cho đến khi Backend sẵn sàng
const useMock = true;

const staffRepository = useMock
    ? new StaffBookingRepositoryMock()
    : new StaffBookingRepositoryImplement();

export const useStaffDashboard = () => {
    const queryClient = useQueryClient();
    const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

    const { data: bookings = [], isLoading, isError, refetch } = useQuery({
        queryKey: ['staff-bookings', selectedDate],
        queryFn: () => staffRepository.getStaffBookings(selectedDate),
    });

    // 🌟 MUTATION MỚI: Gọi một hàm duy nhất để update trạng thái
    const updateStatusMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateBookingStatusPayload }) =>
            staffRepository.updateBookingStatus(id, payload),
        onSuccess: () => {
            // Tự động load lại danh sách sau khi update thành công
            queryClient.invalidateQueries({ queryKey: ['staff-bookings', selectedDate] });
        },
    });

    return {
        bookings,
        isLoading,
        isError,
        selectedDate,
        setSelectedDate,
        refetch,
        actions: {
            updateStatus: updateStatusMutation.mutateAsync,
        }
    };
};
