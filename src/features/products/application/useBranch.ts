import { useQuery } from '@tanstack/react-query';
import { BranchRepositoryImplement } from '../infrastructure/repositories/branch/branch.repository.implement';

const branchRepository = new BranchRepositoryImplement();

export const useBranch = () => {
    // Hook lấy danh sách tất cả chi nhánh
    const useGetAllBranches = () => {
        return useQuery({
            queryKey: ['branches'],
            queryFn: () => branchRepository.getAllBranches(),
        });
    };

    // Hook lấy slot trống theo chi nhánh và ngày
    // Chúng ta truyền branchId và date vào queryKey để react-query tự động fetch lại khi khách đổi ngày hoặc đổi chi nhánh
    const useGetAvailableSlots = (branchId: string, date: string) => {
        return useQuery({
            queryKey: ['available-slots', branchId, date],
            queryFn: () => branchRepository.getAvailableSlots(branchId, date),
            enabled: !!branchId && !!date, // Chỉ chạy khi đã có đủ branchId và date
        });
    };

    return {
        useGetAllBranches,
        useGetAvailableSlots,
    };
};
