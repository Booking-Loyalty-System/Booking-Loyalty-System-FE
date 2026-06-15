import type {Branch} from "@/features/products/domain/models/branch/branch.model.ts";

export interface IBranchRepository {
    getAllBranch(): Promise<Branch[]>;
    getBranchById(id: string): Promise<Branch>;
}