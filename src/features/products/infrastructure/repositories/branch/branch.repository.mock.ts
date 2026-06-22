import type { IBranchRepository } from "./branch.repository.interface.ts";
import type { Branch } from "../../../domain/models/branch/branch.model.ts";

const MOCK_BRANCHES: Branch[] = [
    {
        id: "branch_01",
        branchName: "AutoWash Quận 1",
        address: "123 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh",
        hotline: "1900 1234",
        operatingHours: "07:00 - 21:00",
        status: "Active",
        latitude: 10.7725,
        longitude: 106.6980
    },
    {
        id: "branch_02",
        branchName: "AutoWash Quận 7",
        address: "456 Nguyễn Thị Thập, Phường Tân Phong, Quận 7, TP. Hồ Chí Minh",
        hotline: "1900 5678",
        operatingHours: "07:00 - 21:00",
        status: "Active",
        latitude: 10.7415,
        longitude: 106.7025
    },
    {
        id: "branch_03",
        branchName: "AutoWash Bình Thạnh",
        address: "789 Điện Biên Phủ, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh",
        hotline: "1900 9012",
        operatingHours: "07:00 - 22:00",
        status: "Active",
        latitude: 10.8018,
        longitude: 106.7145
    }
];

export class BranchRepositoryMock implements IBranchRepository {
    async getAllBranch(): Promise<Branch[]> {
        await new Promise(resolve => setTimeout(resolve, 200));
        return MOCK_BRANCHES;
    }

    async getBranchById(id: string): Promise<Branch> {
        await new Promise(resolve => setTimeout(resolve, 100));
        const found = MOCK_BRANCHES.find(b => b.id === id);
        if (!found) {
            throw new Error(`Branch with id ${id} not found`);
        }
        return found;
    }
}
