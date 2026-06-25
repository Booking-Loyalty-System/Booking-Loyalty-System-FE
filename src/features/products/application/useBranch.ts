import { useQuery } from '@tanstack/react-query';
import { BranchRepositoryImplement } from '../infrastructure/repositories/branch/branch.repository.implement.ts';
import { BranchRepositoryMock } from '../infrastructure/repositories/branch/branch.repository.mock.ts';
import type { Branch } from '../domain/models/branch/branch.model.ts';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';

const branchRepository = useMock
    ? new BranchRepositoryMock()
    : new BranchRepositoryImplement();

export const useBranch = (branchId?: string) => {
    // 1. Lấy toàn bộ danh sách chi nhánh (Branches)
    const {
        data: branches = [],
        isLoading: isLoadingBranches,
        error: fetchBranchesError
    } = useQuery<Branch[]>({
        queryKey: ['branches'], // Đổi key cho đúng ngữ nghĩa
        queryFn: () => branchRepository.getAllBranch(),
        staleTime: 1000 * 60 * 5, // Cache trong 5 phút
    });

    // 2. Lấy thông tin chi tiết của 1 chi nhánh dựa vào branchId
    const {
        data: branchDetail = null,
        isLoading: isLoadingDetail,
        error: fetchDetailError
    } = useQuery<Branch | null>({
        queryKey: ['branch_detail', branchId], // Sử dụng chính xác branchId
        queryFn: () => branchRepository.getBranchById(branchId!), // Gọi hàm từ branchRepository
        enabled: !!branchId, // Chỉ chạy khi branchId có giá trị hợp lệ
        staleTime: 1000 * 60 * 5,
    });

    return {
        branches,
        branchDetail,
        isLoading: isLoadingBranches || isLoadingDetail,
        isLoadingBranches,
        isLoadingDetail,
        error: fetchBranchesError || fetchDetailError,
    };
};