import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { VehicleRepositoryImplement } from '../infrastructure/repositories/vehicle/vehicle.repository.implement.ts';

import type { Vehicle, CreateVehicleInput } from '../domain/models/vehicle/vehicle.model.ts';

const vehicleRepository = new VehicleRepositoryImplement();

export const useVehicle = () => {
    const queryClient = useQueryClient();

    // 1. Dữ liệu trả về cuối cùng cho UI vẫn là mảng Vehicle[]
    const { data: vehicles = [], isLoading: isLoadingVehicles, error: fetchError } = useQuery<Vehicle[]>({
        queryKey: ['my_vehicles'],
        queryFn: () => vehicleRepository.getMyVehicles(),
        staleTime: 1000 * 60 * 5,
    });

    // 2. Đầu vào từ UI truyền xuống vẫn là CreateVehicleInput
    const createVehicleMutation = useMutation({
        mutationFn: (vehicleData: CreateVehicleInput) =>
            vehicleRepository.createVehicle(vehicleData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my_vehicles'] });
        },
    });

    return {
        vehicles,
        isLoading: isLoadingVehicles,
        isCreating: createVehicleMutation.isPending,
        error: fetchError || createVehicleMutation.error,
        createVehicle: createVehicleMutation.mutateAsync,
    };
};