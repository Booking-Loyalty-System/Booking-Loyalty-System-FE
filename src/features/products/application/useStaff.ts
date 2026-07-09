import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { StaffBookingRepositoryImplement } from '../infrastructure/repositories/staff/staff.repository.implement';
import type { StaffProfile } from '../domain/models/staff/staff.dto.ts';
import { toast } from 'sonner';

const staffRepository = new StaffBookingRepositoryImplement();

export const useStaff = () => {
    const queryClient = useQueryClient();
    const {
        data: staffProfile = null,
        isLoading,
        error,
        refetch
    } = useQuery<StaffProfile | null>({
        queryKey: ['staff_profile_me'],
        queryFn: () => staffRepository.getProfile(),
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });

    const createStaffMutation = useMutation({
        mutationFn: (payload: any) => staffRepository.createStaff(payload),
        onSuccess: () => {
            // Làm mới cache danh sách nếu có (ví dụ: ['admin_staffs'])
            queryClient.invalidateQueries({ queryKey: ['admin_staffs'] });
            toast.success('Thêm nhân viên vào chi nhánh thành công!');
        },
        onError: (error: Error) => {
            toast.error('Lỗi khi thêm nhân viên: ' + error.message);
        }
    });

    return {
        staffProfile,
        isLoading,
        error,
        refetch,
        createStaff: createStaffMutation.mutateAsync,
        isCreatingStaff: createStaffMutation.isPending
    };
};