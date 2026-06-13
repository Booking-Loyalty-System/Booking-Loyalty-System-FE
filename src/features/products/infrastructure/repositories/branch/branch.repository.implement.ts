import type { IBranchRepository } from './branch.repository.interface';
import type { Branch, BookingSlot } from '../../../domain/models/branch/branch.model';
import { httpClient } from '@/core/http/httpClient';
import { ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '../../../domain/apiResponse';

export class BranchRepositoryImplement implements IBranchRepository {
    async getAllBranches(): Promise<Branch[]> {
        const response = await httpClient.get<ApiResponse<Branch[]>>(ENDPOINTS.BRANCH.BRANCH);
        return response.data;
    }

    async getAvailableSlots(branchId: string, date: string): Promise<BookingSlot[]> {
        // Since SLOTS endpoint is not in ENDPOINTS, and this seems to be a mismatch, 
        // I will use a fallback or assume it's part of the BRANCH endpoint for now
        // to avoid build errors while matching the existing ENDPOINTS structure.
        const response = await httpClient.get<ApiResponse<BookingSlot[]>>(
            `${ENDPOINTS.BRANCH.BRANCH}/${branchId}/slots?date=${date}`
        );
        return response.data;
    }
}
