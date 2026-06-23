import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminWashPackageRepositoryImplement } from '../infrastructure/repositories/admin-wash-package/admin-wash-package.repository.implement';
import { toast } from 'sonner';

// 🌟 1. Import Models từ Domain
import type { 
    WashPackageResponseData, 
    CreateWashPackageInput, 
    UpdateWashPackageInput 
} from '../domain/models/admin-wash-package/admin-wash-package.model';

// 🌟 2. Export (chuyển tiếp) Models để UI import cho gọn
export type { WashPackageResponseData, CreateWashPackageInput, UpdateWashPackageInput };

const packageRepo = new AdminWashPackageRepositoryImplement();

export const useWashPackage = () => {
    const queryClient = useQueryClient();

    const { data: packages = [], isLoading, isError } = useQuery({
        queryKey: ['admin_wash_packages'],
        queryFn: () => packageRepo.getAll(),
    });

    const createMutation = useMutation({
        mutationFn: (data: CreateWashPackageInput) => packageRepo.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_wash_packages'] });
            toast.success("Thêm gói rửa xe thành công!");
        },
        onError: (error: any) => toast.error("Lỗi khi thêm: " + error.message)
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateWashPackageInput }) => packageRepo.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_wash_packages'] });
            toast.success("Cập nhật gói rửa xe thành công!");
        },
        onError: (error: any) => toast.error("Lỗi cập nhật: " + error.message)
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => packageRepo.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_wash_packages'] });
            toast.success("Xóa gói rửa xe thành công!");
        },
        onError: (error: any) => toast.error("Lỗi xóa: " + error.message)
    });

    const toggleStatus = async (pkg: WashPackageResponseData) => {
        await updateMutation.mutateAsync({
            id: pkg.id,
            data: {
                name: pkg.name,
                description: pkg.description,
                price: pkg.price,
                durationMinutes: pkg.durationMinutes,
                features: pkg.features,
                vehicleType: pkg.vehicleType,
                isActive: !pkg.isActive
            }
        });
    };

    return {
        packages,
        isLoading,
        isError,
        createPackage: createMutation.mutateAsync,
        updatePackage: updateMutation.mutateAsync,
        deletePackage: deleteMutation.mutateAsync,
        toggleStatus,
    };
};