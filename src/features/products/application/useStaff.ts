import { useQuery } from '@tanstack/react-query';
import { StaffBookingRepositoryImplement } from '../infrastructure/repositories/staff/staff.repository.implement';
import type { StaffProfile } from '../domain/models/staff/staff.dto.ts';

const staffRepository = new StaffBookingRepositoryImplement();

export const useStaff = () => {
    const {
        data: staffProfile = null,
        isLoading,
        error,
        refetch
    } = useQuery<StaffProfile | null>({
        queryKey: ['staff_profile_me'],
        queryFn: () => staffRepository.getProfile(),
        staleTime: 1000 * 60 * 5, // Cache dữ liệu trong 5 phút để tránh gọi API liên tục
        retry: 1, // Tùy chọn: chỉ thử lại 1 lần nếu lỗi (ví dụ token hết hạn)
    });

    return {
        staffProfile,
        isLoading,
        error,
        refetch // Trả về refetch để phòng trường hợp muốn tự cập nhật lại profile
    };
};