export interface CreateBookingInput {
    vehicleId: string;
    washPackageId: string;
    bookingDate: string;
    startTime: string;
}

export interface BookingResponseData {
    id: string;
    vehicleId: string;
    washPackageId: string;
    bookingDate: string;
    startTime: string;
    status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
    createdAt: string;
}