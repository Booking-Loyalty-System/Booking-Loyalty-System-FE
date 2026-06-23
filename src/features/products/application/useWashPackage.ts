import { useQuery } from '@tanstack/react-query';
import { WashPackageRepositoryImplement } from '../infrastructure/repositories/wash-package/wash-package.repository.implement.ts';
import { WashPackageRepositoryMock } from '../infrastructure/repositories/wash-package/wash-package.repository.mock.ts';
import type { WashPackage } from '../domain/models/wash-package/wash-package.model.ts';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';

const washPackageRepository = useMock
    ? new WashPackageRepositoryMock()
    : new WashPackageRepositoryImplement();

export const useWashPackage = (packageId?: string) => {
    const {
        data: washPackages = [],
        isLoading: isLoadingPackages,
        error: fetchPackagesError
    } = useQuery<WashPackage[]>({
        queryKey: ['wash_packages'],
        queryFn: () => washPackageRepository.getAllPackages(),
        staleTime: 1000 * 60 * 5, // Cache trong 5 phút giống bên Vehicle
    });

    const {
        data: washPackageDetail = null,
        isLoading: isLoadingDetail,
        error: fetchDetailError
    } = useQuery<WashPackage | null>({
        queryKey: ['wash_package_detail', packageId],
        queryFn: () => washPackageRepository.getPackageById(packageId!),
        enabled: !!packageId, // Chỉ tự động kích hoạt khi có ID truyền vào
        staleTime: 1000 * 60 * 5,
    });

    return {
        washPackages,
        washPackageDetail,
        isLoading: isLoadingPackages || isLoadingDetail,
        isLoadingPackages,
        isLoadingDetail,
        error: fetchPackagesError || fetchDetailError,
    };
};