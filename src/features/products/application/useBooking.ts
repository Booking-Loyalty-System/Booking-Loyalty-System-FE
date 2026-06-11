import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BookingRepositoryImplement } from '../infrastructure/repositories/booking/booking.repository.implement.ts';
import type { CreateBookingInput } from '../domain/models/booking/booking.model.ts';

const bookingRepository = new BookingRepositoryImplement();

export const useBooking = () => {
    const queryClient = useQueryClient();

    // Sử dụng useMutation cho việc tạo mới Booking
    const createBookingMutation = useMutation({
        mutationFn: (bookingData: CreateBookingInput) =>
            bookingRepository.createBooking(bookingData),
        onSuccess: () => {
            // Sau khi đặt lịch thành công, làm mới danh sách booking hoặc các query liên quan
            queryClient.invalidateQueries({ queryKey: ['my_bookings'] });
        },
    });

    return {
        // Trạng thái đang xử lý (true khi đang gửi request)
        isBooking: createBookingMutation.isPending,

        // Trả về error nếu có
        error: createBookingMutation.error,

        // Hàm gọi thực thi booking
        createBooking: createBookingMutation.mutateAsync,

        // Trả về dữ liệu kết quả sau khi mutate xong (tùy chọn)
        bookingResult: createBookingMutation.data,
    };
};