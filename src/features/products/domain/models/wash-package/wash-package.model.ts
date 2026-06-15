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

export interface WashPackageSelectionProps {
    washPackages: WashPackage[];
    selectedPackageId: string;
    onSelectPackage: (id: string) => void;
}