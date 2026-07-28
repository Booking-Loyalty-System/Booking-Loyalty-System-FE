import type {
    AdminStaffResponseData,
    CreateAdminStaffInput,
    UpdateAdminStaffInput,
} from '../../../domain/models/admin-staff/admin-staff.model';

export interface IAdminStaffRepository {
    getAll(): Promise<AdminStaffResponseData[]>;

    getById(id: string): Promise<AdminStaffResponseData>;

    create(
        data: CreateAdminStaffInput
    ): Promise<AdminStaffResponseData>;

    update(
        id: string,
        data: UpdateAdminStaffInput
    ): Promise<AdminStaffResponseData>;

    delete(id: string): Promise<void>;
}