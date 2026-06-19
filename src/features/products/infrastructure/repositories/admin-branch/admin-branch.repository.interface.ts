import type {
    CreateBranchInput,
    UpdateBranchInput,
    BranchResponseData
} from "@/features/products/domain/models/admin-branch/admin-branch.model.ts"; 

export interface IAdminBranchRepository {
    getAll(): Promise<BranchResponseData[]>;
    create(data: CreateBranchInput): Promise<BranchResponseData>;
    update(id: string, data: UpdateBranchInput): Promise<BranchResponseData>;
    delete(id: string): Promise<void>;
}