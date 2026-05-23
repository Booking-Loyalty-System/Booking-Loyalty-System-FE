export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    // check response hoặc data để gọi cho chính xác
    data: T;
}