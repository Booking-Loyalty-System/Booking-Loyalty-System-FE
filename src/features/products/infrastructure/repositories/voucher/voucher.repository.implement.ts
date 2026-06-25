import type { ApiResponse } from "../../../domain/apiResponse.ts";
import { httpClient } from "@/core/http/httpClient.ts";
import { ENDPOINTS } from "@/core/api/endpoints.ts";
import type { IVoucherRepository } from "./voucher.repository.interface.ts";
import type { Voucher, RewardDto } from "../../../domain/models/voucher/voucher.model.ts";

export class VoucherRepositoryImplement implements IVoucherRepository {
    async getMyVouchers(): Promise<Voucher[]> {
        // Gọi API lấy danh sách voucher cá nhân
        // Dùng tiếng Việt giải thích: Dùng httpClient gửi GET request lên backend.
        const response = await httpClient.get<ApiResponse<Voucher[]>>(
            ENDPOINTS.LOYALTY.MY_REDEMPTIONS
        );
        return response.data;
    }

    async redeemVoucher(rewardId: string): Promise<Voucher> {
        // Gửi request đổi voucher bằng điểm thưởng
        const response = await httpClient.post<ApiResponse<Voucher>>(
            ENDPOINTS.LOYALTY.REDEEM(rewardId)
        );
        return response.data;
    }

    async useVoucher(voucherId: string): Promise<void> {
        // API để thông báo sử dụng voucher (thường Backend sẽ tự xử lý khi Confirm Booking,
        // nhưng API này để đồng bộ hóa nếu có).
        await httpClient.post<void>(`/loyalty/vouchers/${voucherId}/use`);
    }

    async getAvailableRewards(): Promise<RewardDto[]> {
        const response = await httpClient.get<ApiResponse<RewardDto[]>>(
            ENDPOINTS.LOYALTY.REWARDS
        );
        return response.data;
    }
}
