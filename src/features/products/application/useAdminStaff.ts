import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import { toast } from 'sonner';

import { AdminStaffRepositoryImplement } from '../infrastructure/repositories/admin-staff/admin-staff.repository.implement';

import { AdminBranchRepositoryImplement } from '../infrastructure/repositories/admin-branch/admin-branch.repository.implement';

import type {
    CreateAdminStaffInput,
    UpdateAdminStaffInput,
} from '../domain/models/admin-staff/admin-staff.model';

const staffRepo = new AdminStaffRepositoryImplement();

const branchRepo =
    new AdminBranchRepositoryImplement();

export const useAdminStaff = () => {
    const queryClient = useQueryClient();

    // ============================
    // GET ALL STAFF
    // ============================

    const {
        data: staffs = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['admin_staff'],
        queryFn: () => staffRepo.getAll(),
    });

    // ============================
    // GET ALL BRANCH
    // ============================

    const {
        data: branches = [],
        isLoading: isLoadingBranches,
    } = useQuery({
        queryKey: ['admin_branches'],
        queryFn: () => branchRepo.getAll(),
    });

    // ============================
    // CREATE STAFF
    // ============================

    const createMutation = useMutation({
        mutationFn: (
            data: CreateAdminStaffInput
        ) => staffRepo.create(data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['admin_staff'],
            });

            toast.success(
                'Staff created successfully'
            );
        },

        onError: (error: any) => {
            const message =
                error?.response?.data?.message ??
                'Failed to create staff';

            toast.error(message);
        },
    });

    // ============================
    // UPDATE STAFF
    // ============================

    const updateMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: UpdateAdminStaffInput;
        }) => staffRepo.update(id, data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['admin_staff'],
            });

            toast.success(
                'Staff updated successfully'
            );
        },

        onError: (error: any) => {
            const message =
                error?.response?.data?.message ??
                'Failed to update staff';

            toast.error(message);
        },
    });

    // ============================
    // DELETE STAFF
    // ============================

    const deleteMutation = useMutation({
        mutationFn: (id: string) =>
            staffRepo.delete(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['admin_staff'],
            });

            toast.success(
                'Staff deleted successfully'
            );
        },

        onError: (error: any) => {
            const message =
                error?.response?.data?.message ??
                'Failed to delete staff';

            toast.error(message);
        },
    });

    return {
        staffs,
        branches,

        isLoading,
        isError,
        isLoadingBranches,

        createStaff: createMutation.mutateAsync,
        updateStaff: updateMutation.mutateAsync,
        deleteStaff: deleteMutation.mutateAsync,

        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};