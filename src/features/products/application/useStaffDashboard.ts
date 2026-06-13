import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StaffBookingRepositoryImplement } from '../infrastructure/repositories/staff/staff.repository.implement';
import { StaffBookingRepositoryMock } from '../infrastructure/repositories/staff/staff.repository.mock';
import { format } from 'date-fns';

// Using a simple check for mock data, can be refined based on env
const useMock = true; 
const staffRepository = useMock ? new StaffBookingRepositoryMock() : new StaffBookingRepositoryImplement();

export const useStaffDashboard = () => {
    const queryClient = useQueryClient();
    const today = format(new Date(), 'yyyy-MM-dd');

    const { data: bookings = [], isLoading, isError } = useQuery({
        queryKey: ['staff-bookings', today],
        queryFn: () => staffRepository.getStaffBookings(today),
    });

    const checkInMutation = useMutation({
        mutationFn: (id: string) => staffRepository.checkInBooking(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff-bookings', today] }),
    });

    const queueMutation = useMutation({
        mutationFn: (id: string) => staffRepository.queueBooking(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff-bookings', today] }),
    });

    const startMutation = useMutation({
        mutationFn: ({ id, staffId }: { id: string; staffId: string }) => 
            staffRepository.startService(id, staffId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff-bookings', today] }),
    });

    const finishMutation = useMutation({
        mutationFn: (id: string) => staffRepository.finishService(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff-bookings', today] }),
    });

    const checkoutMutation = useMutation({
        mutationFn: (id: string) => staffRepository.checkoutBooking(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff-bookings', today] }),
    });

    const cancelMutation = useMutation({
        mutationFn: ({ id, reason }: { id: string; reason: string }) => 
            staffRepository.cancelBookingByStaff(id, reason),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff-bookings', today] }),
    });

    const noShowMutation = useMutation({
        mutationFn: (id: string) => staffRepository.markAsNoShow(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff-bookings', today] }),
    });

    return {
        bookings,
        isLoading,
        isError,
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
