export const CAR_BRANDS = [
    'Toyota', 'Honda', 'Mazda', 'Hyundai', 'Kia', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Lexus', 'VinFast'
];

export const VEHICLE_NAMES_BY_BRAND: Record<string, string[]> = {
    'Toyota': ['Camry', 'Corolla', 'Vios', 'Fortuner', 'Innova', 'Land Cruiser'],
    'Honda': ['Civic', 'CR-V', 'City', 'Accord', 'HR-V'],
    'Mazda': ['Mazda 3', 'CX-5', 'CX-8', 'Mazda 6'],
    'Hyundai': ['Accent', 'Santa Fe', 'Tucson', 'Elantra', 'Kona'],
    'Kia': ['Cerato', 'Seltos', 'Sorento', 'Morning', 'K3'],
    'VinFast': ['Lux A2.0', 'Lux SA2.0', 'Fadil', 'VF8', 'VF9', 'VFe34'],
};

export const detectVehicleType = (brand: string, model: string): 'Small' | 'Medium' | 'Large' => {
    const modelLower = model.toLowerCase();
    if (modelLower.includes('fadil') || modelLower.includes('morning') || modelLower.includes('i10')) return 'Small';
    if (modelLower.includes('cx-5') || modelLower.includes('tucson') || modelLower.includes('cr-v') || modelLower.includes('fortuner')) return 'Large';
    return 'Medium';
};
