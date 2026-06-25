export interface IPaymentRepository {
    /** * Gửi request lên cổng thanh toán để sinh link VNPay sandbox/production
     */
    createCheckoutUrl(bookingId: string): Promise<string>;
    createPayOsUrl(bookingId: string): Promise<string>;
}