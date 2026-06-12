import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { BookingRepositoryImplement } from '../infrastructure/repositories/booking/booking.repository.implement';
import type { CreateBookingInput } from '../domain/models/booking/booking.model';

const bookingRepository = new BookingRepositoryImplement();

export const useBooking = () => {
    const queryClient = useQueryClient();

    const createBookingMutation = useMutation({
        mutationFn: (bookingData: CreateBookingInput) =>
            bookingRepository.createBooking(bookingData),
        onSuccess: () => {
            // Làm mới danh sách lịch sử đặt lịch nếu có
            queryClient.invalidateQueries({ queryKey: ['booking-history'] });
        },
    });

    const useGetMyBookings = () => {
        return useQuery({
            queryKey: ['booking-history'],
            queryFn: () => bookingRepository.getMyBookings(),
        });
    };

    const useGetBookingById = (bookingId: string) => {
        return useQuery({
            queryKey: ['booking-detail', bookingId],
            queryFn: () => bookingRepository.getBookingById(bookingId),
            enabled: !!bookingId,
            refetchInterval: 5000, // Tự động làm mới mỗi 5 giây để theo dõi trạng thái live
        });
    };

    const useCancelBooking = () => {
        return useMutation({
            mutationFn: (bookingId: string) => bookingRepository.cancelBooking(bookingId),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['booking-history'] });
            },
        });
    };

    return {
        createBooking: createBookingMutation.mutateAsync,
        isCreating: createBookingMutation.isPending,
        error: createBookingMutation.error,
        isSuccess: createBookingMutation.isSuccess,
        data: createBookingMutation.data,
        useGetMyBookings,
        useGetBookingById,
        useCancelBooking,
    };
};
