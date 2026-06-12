export interface Branch {
    id: string;
    name: string;
    address: string;
    phone: string;
    imageUrl?: string;
    operatingHours: string; // "08:00 - 20:00"
}

export interface BookingSlot {
    time: string; // "08:00", "09:00"...
    available: boolean;
    maxCapacity: number;
    currentBookings: number;
}
