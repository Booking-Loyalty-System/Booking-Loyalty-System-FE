import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BookingRepositoryImplement } from '../infrastructure/repositories/booking/booking.repository.implement.ts';
import type { CreateBookingInput, MyBookingRecord } from '../domain/models/booking/booking.model.ts';

const bookingRepository = new BookingRepositoryImplement();

export const useBooking = (options?: { loadMyBookings?: boolean }) => {
    const queryClient = useQueryClient();

    // -- Queries --
    const myBookingsQuery = useQuery<MyBookingRecord[]>({
        queryKey: ['my_bookings'],
        queryFn: () => bookingRepository.getMyBookings(),
        enabled: options?.loadMyBookings ?? true,
    });

    // -- Dùng chung hàm Invalidate cho gọn --
    const invalidateBookings = () => {
        queryClient.invalidateQueries({ queryKey: ['my_bookings'] });
        queryClient.invalidateQueries({ queryKey: ['staff_bookings'] }); // Refresh cả danh sách của staff nếu có
    };

    // -- Mutations: Khách hàng --
    const createBookingMutation = useMutation({
        mutationFn: (bookingData: CreateBookingInput) => bookingRepository.createBooking(bookingData),
        onSuccess: (data) => {
            console.log("Đặt lịch thành công:", data);
            invalidateBookings();
        },
        onError: (error) => console.error("Lỗi khi tạo booking:", error)
    });

    const cancelBookingMutation = useMutation({
        mutationFn: ({ id, reason }: { id: string; reason: string }) => bookingRepository.cancelBooking(id, reason),
        onSuccess: invalidateBookings,
        onError: (error) => console.error("Lỗi khi hủy đặt lịch:", error)
    });

    // -- Mutations: Staff Workflow --
    const confirmMutation = useMutation({
        mutationFn: (id: string) => bookingRepository.confirmBooking(id),
        onSuccess: invalidateBookings,
    });

    const checkInMutation = useMutation({
        mutationFn: ({ id, staffId }: { id: string; staffId: string }) => bookingRepository.checkInBooking(id, staffId),
        onSuccess: invalidateBookings,
    });

    const queueMutation = useMutation({
        mutationFn: ({ id, bayId }: { id: string; bayId: string }) => bookingRepository.queueBooking(id, bayId),
        onSuccess: invalidateBookings,
    });

    const startMutation = useMutation({
        mutationFn: ({ id, bayId }: { id: string; bayId: string}) => bookingRepository.startBooking(id, bayId),
        onSuccess: invalidateBookings,
    });

    const checkoutMutation = useMutation({
        mutationFn: (id: string) => bookingRepository.checkOutBooking(id),
        onSuccess: invalidateBookings,
    });

    const staffCancelMutation = useMutation({
        mutationFn: ({ id, cancel }: { id: string; cancel: string }) => bookingRepository.staffCancelBooking(id, cancel),
        onSuccess: invalidateBookings,
    });

    const noShowMutation = useMutation({
        mutationFn: (id: string) => bookingRepository.noShowBooking(id),
        onSuccess: invalidateBookings,
    });

    const completedMutation = useMutation({
        mutationFn: (id: string) => bookingRepository.completed(id),
        onSuccess: invalidateBookings,
    });

    const qr = useMutation({
        mutationFn: (qrPayload: string) => bookingRepository.scan_qr(qrPayload)
    });

    return {
        // Data & Status chung
        myBookings: myBookingsQuery.data || [],
        isLoading: myBookingsQuery.isLoading,
        isFetchingBookings: myBookingsQuery.isFetching,
        error: createBookingMutation.error,

        scanQr: qr.mutateAsync,
        isScanning: qr.isPending,

        // Actions: Customer
        createBooking: createBookingMutation.mutateAsync,
        isBooking: createBookingMutation.isPending,
        cancelBooking: cancelBookingMutation.mutateAsync,
        isCanceling: cancelBookingMutation.isPending,

        // Actions: Staff
        confirmBooking: confirmMutation.mutateAsync,
        isConfirming: confirmMutation.isPending,

        checkInBooking: checkInMutation.mutateAsync,
        isCheckingIn: checkInMutation.isPending,

        queueBooking: queueMutation.mutateAsync,
        isQueuing: queueMutation.isPending,

        startBooking: startMutation.mutateAsync,
        isStarting: startMutation.isPending,

        checkoutBooking: checkoutMutation.mutateAsync,
        isCheckingOut: checkoutMutation.isPending,

        staffCancelBooking: staffCancelMutation.mutateAsync,
        isStaffCanceling: staffCancelMutation.isPending,

        noShowBooking: noShowMutation.mutateAsync,
        isNoShowing: noShowMutation.isPending,

        completedBooking: completedMutation.mutateAsync,
        isCompleted: completedMutation.isPending,
    };
};