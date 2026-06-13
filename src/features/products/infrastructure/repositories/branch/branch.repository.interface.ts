import type { Branch, BookingSlot } from '../../../domain/models/branch/branch.model';

export interface IBranchRepository {
    // Lấy danh sách tất cả chi nhánh
    getAllBranches(): Promise<Branch[]>;
    
    // Lấy danh sách các slot giờ trống của một chi nhánh vào một ngày nhất định
    getAvailableSlots(branchId: string, date: string): Promise<BookingSlot[]>;
}
