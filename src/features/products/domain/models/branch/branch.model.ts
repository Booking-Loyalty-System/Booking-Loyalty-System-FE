export interface Branch {
    id: string;
    branchName: string;
    address: string;
    hotline: string;
    operatingHours: string;
    status: string;
    latitude: number;
    longitude: number;
}

export interface MapModalProps {
    isOpen: boolean;
    onClose: () => void;
    branches: Branch[];
    selectedBranchId?: string; // Tự động focus vào chi nhánh được click
}

export interface NearestBranchesProps {
    selectedBranchId: string;
    onSelectBranch: (id: string) => void;
}

export interface MapBranch {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    address?: string;
}