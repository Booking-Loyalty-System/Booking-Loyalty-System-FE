// 💡 1. Danh sách các Brand ô tô mẫu cố định để gợi ý cho người dùng
export const CAR_BRANDS = [
    "Toyota", "Honda", "Mazda", "Hyundai", "Kia",
    "Ford", "Mitsubishi", "Nissan", "Suzuki", "Subaru", "VinFast",
    "Mercedes-Benz", "BMW", "Audi", "Lexus", "Volvo", "Porsche",
    "Land Rover", "Tesla", "BYD", "MG", "Peugeot",
    "Chevrolet", "Ferrari", "Lamborghini", "Rolls-Royce", "Bentley"
].sort();

// 💡 2. Map toàn bộ Vehicle Name phổ biến theo từng Brand (Dùng để hiển thị gợi ý động)
export const VEHICLE_NAMES_BY_BRAND: Record<string, string[]> = {
    "Toyota": ["Vios", "Camry", "Corolla Altis", "Innova", "Fortuner", "Raize", "Corolla Cross", "Yaris Cross", "Veloz Cross", "Avanza", "Hilux", "Land Cruiser"],
    "Honda": ["City", "Civic", "Accord", "HR-V", "CR-V", "BR-V", "Brio"],
    "Mazda": ["Mazda 2", "Mazda 3", "Mazda 6", "CX-3", "CX-30", "CX-5", "CX-8", "BT-50"],
    "Hyundai": ["Grand i10", "Accent", "Elantra", "Creta", "Stargazer", "Tucson", "Santa Fe", "Palisade", "Custin", "Ioniq 5"],
    "Kia": ["Morning", "Soluto", "K3", "K5", "Sonet", "Seltos", "Carens", "Sportage", "Sorento", "Carnival"],
    "Ford": ["Ranger", "Ranger Raptor", "Everest", "Explorer", "Territory", "Transit"],
    "Mitsubishi": ["Xpander", "Xforce", "Attrage", "Outlander", "Pajero Sport", "Triton"],
    "Nissan": ["Almera", "Navara", "Kicks", "Terra", "X-Trail"],
    "Suzuki": ["Swift", "Ertiga", "XL7", "Jimny", "Ciaz"],
    "Subaru": ["Forester", "Outback", "WRX", "BRZ"],
    "VinFast": ["VF e34", "VF 3", "VF 5", "VF 6", "VF 7", "VF 8", "VF 9", "Fadil", "Lux A2.0", "Lux SA2.0"],
    "Mercedes-Benz": ["C-Class (C200, C300)", "E-Class (E200, E300)", "S-Class (S450)", "GLC 200", "GLC 300", "GLE 450", "GLS 450", "C63 AMG", "G63 AMG"],
    "BMW": ["3 Series (320i, 330i)", "5 Series (520i, 530i)", "7 Series", "X1", "X3", "X5", "X6", "X7", "Z4"],
    "Audi": ["A4", "A6", "A8", "Q3", "Q5", "Q7", "Q8", "e-tron GT"],
    "Lexus": ["ES 250", "IS 300", "LS 500", "NX 350", "RX 350", "RX 500h", "GX 550", "LX 600"],
    "Volvo": ["XC40", "XC60", "XC90", "S60", "S90", "V60 Cross Country"],
    "Porsche": ["911 Carrera", "718 Cayman", "Panamera", "Macan", "Cayenne", "Taycan"],
    "Land Rover": ["Range Rover Evoque", "Range Rover Velar", "Range Rover Sport", "Defender 90", "Defender 110", "Defender 130", "Discovery"],
    "Tesla": ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck"],
    "BYD": ["Atto 3", "Dolphin", "Seal", "Han", "Tang"],
    "MG": ["MG5", "MG ZS", "MG HS", "Cyberster", "MG7"],
    "Peugeot": ["2008", "3008", "5008", "408"],
    "Chevrolet": ["Cruze", "Colorado", "Trailblazer", "Spark", "Captiva"],
    "Ferrari": ["488 GTB", "SF90 Stradale", "F8 Tributo", "Roma", "Portofino", "Purosangue"],
    "Lamborghini": ["Aventador", "Huracan", "Urus", "Revuelto"],
    "Rolls-Royce": ["Phantom", "Ghost", "Ghost Extended", "Cullinan", "Spectre"],
    "Bentley": ["Continental GT", "Flying Spur", "Bentayga"]
};

// 💡 3. Hàm tự động đoán Vehicle Type dựa trên quy tắc từ khóa (Áp dụng cho toàn bộ các hãng)
export const detectVehicleType = (brand: string, name: string): 'Small' | 'Medium' | 'Large' => {
    const txt = `${brand} ${name}`.toLowerCase();

    // Dòng xe bán tải / Xe 16 chỗ / SUV siêu lớn (Large)
    if (
        txt.includes('ranger') || txt.includes('raptor') || txt.includes('triton') ||
        txt.includes('navara') || txt.includes('colorado') || txt.includes('hilux') ||
        txt.includes('transit') || txt.includes('cybertruck') || txt.includes('defender 130') ||
        txt.includes('g63') || txt.includes('gls') || txt.includes('lx 600') || txt.includes('land cruiser')
    ) {
        return 'Large';
    }

    // Dòng SUV / CUV / MPV / 5-7 chỗ tầm trung & vừa (Medium)
    if (
        txt.includes('cx-') || txt.includes('cr-v') || txt.includes('hr-v') || txt.includes('br-v') ||
        txt.includes('fortuner') || txt.includes('innova') || txt.includes('raize') || txt.includes('cross') || txt.includes('veloz') || txt.includes('avanza') ||
        txt.includes('tucson') || txt.includes('santa fe') || txt.includes('creta') || txt.includes('palisade') || txt.includes('custin') || txt.includes('stargazer') ||
        txt.includes('sorento') || txt.includes('sportage') || txt.includes('carnival') || txt.includes('carens') || txt.includes('sonet') || txt.includes('seltos') ||
        txt.includes('everest') || txt.includes('explorer') || txt.includes('territory') ||
        txt.includes('xpander') || txt.includes('xforce') || txt.includes('outlander') || txt.includes('pajero') ||
        txt.includes('kicks') || txt.includes('terra') || txt.includes('x-trail') ||
        txt.includes('xl7') || txt.includes('ertiga') || txt.includes('jimny') ||
        txt.includes('forester') || txt.includes('outback') ||
        txt.includes('vf e34') || txt.includes('vf 3') || txt.includes('vf 5') || txt.includes('vf 6') || txt.includes('vf 7') || txt.includes('vf 8') || txt.includes('vf 9') || txt.includes('lux sa') ||
        txt.includes('glc') || txt.includes('gle') ||
        txt.includes('x1') || txt.includes('x3') || txt.includes('x5') || txt.includes('x6') || txt.includes('x7') ||
        txt.includes('q3') || txt.includes('q5') || txt.includes('q7') || txt.includes('q8') ||
        txt.includes('nx') || txt.includes('rx') || txt.includes('gx') ||
        txt.includes('xc') || txt.includes('v60') ||
        txt.includes('macan') || txt.includes('cayenne') ||
        txt.includes('range rover') || txt.includes('defender') || txt.includes('discovery') ||
        txt.includes('model y') || txt.includes('model x') ||
        txt.includes('atto 3') || txt.includes('tang') ||
        txt.includes('zs') || txt.includes('hs') ||
        txt.includes('2008') || txt.includes('3008') || txt.includes('5008') || txt.includes('408') ||
        txt.includes('trailblazer') || txt.includes('captiva') ||
        txt.includes('purosangue') || txt.includes('urus') || txt.includes('cullinan') || txt.includes('bentayga')
    ) {
        return 'Medium';
    }

    // Mặc định là các dòng Sedan, Hatchback, Đô thị nhỏ hoặc Siêu xe gầm thấp (Small)
    return 'Small';
};