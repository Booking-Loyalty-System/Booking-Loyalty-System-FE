import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StaffBookingRepositoryImplement } from '../infrastructure/repositories/staff/staff.repository.implement';
import { StaffBookingRepositoryMock } from '../infrastructure/repositories/staff/staff.repository.mock';
import { format } from 'date-fns';

// Using environment variable to control mock data
const useMock = import.meta.env.VITE_USE_MOCK_STAFF_DATA === 'true'; 
const staffRepository = useMock ? new StaffBookingRepositoryMock() : new StaffBookingRepositoryImplement();

export const useStaffDashboard = () => {
    const queryClient = useQueryClient();
    
    // State quản lý ngày đang chọn, mặc định là ngày hôm nay.
    // Việc dùng State cho phép UI có thể thay đổi ngày thông qua Calendar hoặc DatePicker.
    const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

    const { data: bookings = [], isLoading, isError, refetch } = useQuery({
        queryKey: ['staff-bookings', selectedDate], // QueryKey phụ thuộc vào selectedDate
        queryFn: () => staffRepository.getStaffBookings(selectedDate),
    });

    const checkInMutation = useMutation({
        mutationFn: (id: string) => staffRepository.checkInBooking(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff-bookings', selectedDate] }),
    });

    const queueMutation = useMutation({
        mutationFn: (id: string) => staffRepository.queueBooking(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff-bookings', selectedDate] }),
    });

    const startMutation = useMutation({
        mutationFn: ({ id, staffId }: { id: string; staffId: string }) => 
            staffRepository.startService(id, staffId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff-bookings', selectedDate] }),
    });

    const finishMutation = useMutation({
        mutationFn: (id: string) => staffRepository.finishService(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff-bookings', selectedDate] }),
    });

    const checkoutMutation = useMutation({
        mutationFn: (id: string) => staffRepository.checkoutBooking(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff-bookings', selectedDate] }),
    });

    const cancelMutation = useMutation({
        mutationFn: ({ id, reason }: { id: string; reason: string }) => 
            staffRepository.cancelBookingByStaff(id, reason),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff-bookings', selectedDate] }),
    });

    const noShowMutation = useMutation({
        mutationFn: (id: string) => staffRepository.markAsNoShow(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff-bookings', selectedDate] }),
    });

    return {
        bookings,
        isLoading,
        isError,
        selectedDate,      // Trả ra ngày đang chọn để UI hiển thị
        setSelectedDate,   // Trả ra hàm cập nhật ngày để UI sử dụng (ví dụ chọn từ Calendar)
        refetch,
        actions: {
            checkIn: checkInMutation.mutateAsync,
            queue: queueMutation.mutateAsync,
            start: startMutation.mutateAsync,
            finish: finishMutation.mutateAsync,
            checkout: checkoutMutation.mutateAsync,
            cancel: cancelMutation.mutateAsync,
            noShow: noShowMutation.mutateAsync,
        }
    };
};
