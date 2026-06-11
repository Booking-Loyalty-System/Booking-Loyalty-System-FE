import type { IBranchRepository } from './branch.repository.interface';
import type { Branch, BookingSlot } from '../../domain/models/branch/branch.model';
import { httpClient } from '@/core/http/httpClient';
import { ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '../../domain/apiResponse';

export class BranchRepositoryImplement implements IBranchRepository {
    async getAllBranches(): Promise<Branch[]> {
        /* === START MOCK DATA ===
        console.log('[Mock] Fetching branches');
        return [
            {
                id: 'br-001',
                name: 'AutoWash Central - District 1',
                address: '123 Le Loi, Ben Thanh Ward, District 1, HCMC',
                phone: '028 3822 1234',
                operatingHours: '08:00 - 20:00',
                isActive: true
            },
            {
                id: 'br-002',
                name: 'AutoWash South - District 7',
                address: '456 Nguyen Van Linh, Tan Phong Ward, District 7, HCMC',
                phone: '028 5411 5678',
                operatingHours: '07:00 - 22:00',
                isActive: true
            }
        ];
        === END MOCK DATA === */

        const response = await httpClient.get<ApiResponse<Branch[]>>(ENDPOINTS.BRANCHES.BASE);
        return response.data;
    }

    async getAvailableSlots(branchId: string, date: string): Promise<BookingSlot[]> {
        /* === START MOCK DATA ===
        console.log(`[Mock] Fetching slots for branch ${branchId} on ${date}`);
        const slots: BookingSlot[] = [];
        const times = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
        
        times.forEach((time) => {
            slots.push({
                time: time,
                available: Math.random() > 0.3, // Random 70% available
                maxCapacity: 3,
                currentBookings: Math.floor(Math.random() * 3)
            });
        });
        return slots;
        === END MOCK DATA === */

        const response = await httpClient.get<ApiResponse<BookingSlot[]>>(
            ENDPOINTS.BRANCHES.SLOTS(branchId, date)
        );
        return response.data;
    }
}
