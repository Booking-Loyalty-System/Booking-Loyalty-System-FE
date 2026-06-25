import type { Voucher } from "../../../domain/models/voucher/voucher.model.ts";

export interface IVoucherRepository {
    getMyVouchers(): Promise<Voucher[]>;
    redeemVoucher(rewardId: string): Promise<Voucher>;
    useVoucher(voucherId: string): Promise<void>;
}
