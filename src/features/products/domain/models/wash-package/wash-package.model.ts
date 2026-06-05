export interface WashPackage {
    id: string; 
    name: string | null;
    description: string | null;
    price: number;
    durationMinutes: number;
    features: string[] | null;
    vehicleType: string | null;
    isActive?: boolean | null;
}