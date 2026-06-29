import React, { useEffect, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { CarWithEffects } from "@/shared/car-with-effect.tsx";
import { toast } from 'sonner';

// ==========================================
// 📋 TYPES & INTERFACES
// ==========================================
type StepType =
    | 'exterior_wash'
    | 'tire_cleaning'
    | 'window_cleaning'
    | 'interior_vacuum'
    | 'dashboard_polish'
    | 'wax_coating'
    | 'leather_conditioning'
    | 'engine_cleaning'
    | 'ceramic_spray'
    | 'air_freshener';

interface WashStep {
    id: number;
    type: StepType;
    name: string;
    desc: string;
    camPos: [number, number, number];
}

// ==========================================
// 🎯 INTERFACES CỦA CÁC HUD GIAO DIỆN RIÊNG BIỆT (2D OVERLAY)
// ==========================================

// 1. Rửa ngoại thất
const ExteriorWashUI: React.FC = () => (
    <div className="bg-slate-950/85 backdrop-blur-md text-white p-4 rounded-2xl border border-blue-500/40 shadow-xl animate-in fade-in slide-in-from-bottom-3 pointer-events-auto">
        <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest animate-pulse">● Đang xịt gầm & vỏ xe</span>
            <span className="text-[10px] bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded font-mono">HỆ THỐNG VÒI CAO ÁP</span>
        </div>
        <div className="grid grid-cols-2 gap-2 my-2 text-xs">
            <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Áp lực nước</span>
                <span className="font-bold font-mono text-blue-400 text-sm">135 Bar</span>
            </div>
            <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Lưu lượng vòi phun</span>
                <span className="font-bold font-mono text-slate-200 text-sm">14 L/phút</span>
            </div>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-blue-500 h-full w-4/5 rounded-full animate-pulse" />
        </div>
    </div>
);

// 2. Vệ sinh & làm bóng lốp xe
const TireCleaningUI: React.FC = () => (
    <div className="bg-slate-950/85 backdrop-blur-md text-white p-4 rounded-2xl border border-emerald-500/40 shadow-xl animate-in fade-in slide-in-from-bottom-3 pointer-events-auto">
        <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">● Xử lý mâm & lốp xe</span>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded font-mono">DƯỠNG CAO SU</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed mb-2">Chổi lô tự động đang đánh sạch má lốp và quét dung dịch phục hồi độ đen bóng sâu.</p>
        <div className="flex gap-2">
            <span className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-1 rounded text-emerald-400 font-mono">Tốc độ chổi: 240 RPM</span>
            <span className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-1 rounded text-slate-300 font-mono">Độ phủ: 100%</span>
        </div>
    </div>
);

// 3. Vệ sinh kính xe
const WindowCleaningUI: React.FC = () => (
    <div className="bg-slate-950/85 backdrop-blur-md text-white p-4 rounded-2xl border border-cyan-500/40 shadow-xl animate-in fade-in slide-in-from-bottom-3 pointer-events-auto">
        <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">● Làm sạch bề mặt kính</span>
            <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded font-mono">KÍNH KHÔNG VỆT</span>
        </div>
        <div className="text-xs text-slate-300 space-y-1">
            <div className="flex justify-between"><span className="text-slate-400">Khu vực:</span> <span>Kính lái + Kính hậu + Gương chiếu hậu</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Dung dịch ứng dụng:</span> <span className="text-cyan-400 font-medium">Glass Cleaner X-2</span></div>
        </div>
    </div>
);

// 4. Hút bụi nội thất
const InteriorVacuumUI: React.FC = () => (
    <div className="bg-slate-950/85 backdrop-blur-md text-white p-4 rounded-2xl border border-purple-500/40 shadow-xl animate-in fade-in slide-in-from-bottom-3 pointer-events-auto">
        <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest animate-pulse">● Hút bụi & lọc khí cabin</span>
            <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded font-mono">LỰC HÚT ĐÁY</span>
        </div>
        <p className="text-xs text-slate-300 mb-2">Lực hút xoáy Cyclone dọn sạch thảm sàn, các rãnh ghế và các ngóc ngách khuất.</p>
        <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Áp suất hút chân không:</span>
            <span className="font-mono text-purple-400 font-bold">22,000 Pa</span>
        </div>
    </div>
);

// 5. Đánh bóng taplo
const DashboardPolishUI: React.FC = () => (
    <div className="bg-slate-950/85 backdrop-blur-md text-white p-4 rounded-2xl border border-amber-500/40 shadow-xl animate-in fade-in slide-in-from-bottom-3 pointer-events-auto">
        <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">● Phục hồi bề mặt nhựa nhám</span>
            <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded font-mono">BẢO VỆ UV</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">Đang quét lớp phủ dưỡng chất nano lên bảng điều khiển, chống bạc màu và chống bám bụi bẩn tĩnh điện.</p>
    </div>
);

// 6. Phủ sáp bóng sơn (Wax)
const WaxCoatingUI: React.FC = () => (
    <div className="bg-slate-950/85 backdrop-blur-md text-white p-4 rounded-2xl border border-rose-500/40 shadow-xl animate-in fade-in slide-in-from-bottom-3 pointer-events-auto">
        <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">● Phủ sáp tăng bóng bảo vệ</span>
            <span className="text-[10px] bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded font-mono">CARNAUBA WAX</span>
        </div>
        <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded border border-slate-800">
                <span className="text-slate-400">Máy đánh bóng quỹ đạo:</span>
                <span className="font-mono text-rose-400 font-semibold">3,500 OPM</span>
            </div>
            <p className="text-[11px] text-slate-400">Giúp lấp đầy các vết xước dăm siêu nhỏ, tạo độ sâu óng ánh cho màu sơn gốc.</p>
        </div>
    </div>
);

// 7. Bảo dưỡng bề mặt da
const LeatherConditioningUI: React.FC = () => (
    <div className="bg-slate-950/85 backdrop-blur-md text-white p-4 rounded-2xl border border-orange-500/40 shadow-xl animate-in fade-in slide-in-from-bottom-3 pointer-events-auto">
        <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">● Chăm sóc ghế da cao cấp</span>
            <span className="text-[10px] bg-orange-950 text-orange-300 px-1.5 py-0.5 rounded font-mono">PH BALANCED</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">Thoa dầu dưỡng chất tự nhiên vào biểu bì da ghế, tăng độ đàn hồi, ngăn ngừa nứt nẻ do nhiệt độ môi trường.</p>
    </div>
);

// 8. Vệ sinh khoang máy
const EngineCleaningUI: React.FC = () => (
    <div className="bg-slate-950/85 backdrop-blur-md text-white p-4 rounded-2xl border border-yellow-500/40 shadow-xl animate-in fade-in slide-in-from-bottom-3 pointer-events-auto">
        <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest animate-pulse">● Làm sạch khoang động cơ</span>
            <span className="text-[10px] bg-yellow-950 text-yellow-300 px-1.5 py-0.5 rounded font-mono">HƠI NƯỚC NÓNG</span>
        </div>
        <div className="text-xs space-y-1 my-1">
            <div className="flex justify-between"><span className="text-slate-400">Nhiệt độ luồng hơi:</span> <span className="font-mono text-yellow-400 font-bold">140°C</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Trạng thái cảm biến:</span> <span className="text-emerald-400 font-medium">Đã bọc cách điện an toàn</span></div>
        </div>
    </div>
);

// 9. Xịt phủ Ceramic bảo vệ sơn
const CeramicSprayUI: React.FC = () => (
    <div className="bg-slate-950/85 backdrop-blur-md text-white p-4 rounded-2xl border border-indigo-500/40 shadow-xl animate-in fade-in slide-in-from-bottom-3 pointer-events-auto">
        <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">● Kích hoạt màng phủ Ceramic</span>
            <span className="text-[10px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded font-mono">SIO2 LIÊN KẾT</span>
        </div>
        <p className="text-xs text-slate-300 mb-2">Tạo lớp màng bảo vệ siêu cứng tăng hiệu ứng kháng nước lá sen, chống oxy hóa lớp bóng bề mặt.</p>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full w-1/2 rounded-full animate-pulse" />
        </div>
    </div>
);

// 10. Xịt thơm khử mùi
const AirFreshenerUI: React.FC = () => (
    <div className="bg-slate-950/85 backdrop-blur-md text-white p-4 rounded-2xl border border-fuchsia-500/40 shadow-xl animate-in fade-in slide-in-from-bottom-3 pointer-events-auto">
        <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest">● Khử khuẩn & Xịt nước hoa</span>
            <span className="text-[10px] bg-fuchsia-950 text-fuchsia-300 px-1.5 py-0.5 rounded font-mono">AIR PURIFIER</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">Hệ thống xông tinh dầu đang phát tán phân tử khử mùi trong toàn bộ hệ thống điều hòa không khí cabin xe.</p>
    </div>
);

// 🔍 BẢN ĐỒ TRA CỨU COMPONENT HUD TỰ ĐỘNG THEO LOẠI BƯỚC
const STEP_UI_LOOKUP: Record<StepType, React.ComponentType> = {
    exterior_wash: ExteriorWashUI,
    tire_cleaning: TireCleaningUI,
    window_cleaning: WindowCleaningUI,
    interior_vacuum: InteriorVacuumUI,
    dashboard_polish: DashboardPolishUI,
    wax_coating: WaxCoatingUI,
    leather_conditioning: LeatherConditioningUI,
    engine_cleaning: EngineCleaningUI,
    ceramic_spray: CeramicSprayUI,
    air_freshener: AirFreshenerUI,
};

// ==========================================
// 📦 CẤU HÌNH GÓI DỊCH VỤ MẪU CHUẨN ĐẦU VÀO
// ==========================================
const PACKAGES_CONFIG: Record<string, { label: string; steps: WashStep[] }> = {
    express: {
        label: "Gói Nhanh (Express)",
        steps: [
            { id: 1, type: 'exterior_wash', name: 'Rửa ngoại thất', desc: 'Xịt nước áp lực cao sạch bụi bẩn bề mặt sơn.', camPos: [15, 6, 15] },
            { id: 2, type: 'tire_cleaning', name: 'Vệ sinh lốp xe', desc: 'Chà rửa mâm lốp và làm sạch hệ thống phanh.', camPos: [10, 1.5, 10] },
            { id: 3, type: 'window_cleaning', name: 'Vệ sinh kính xe', desc: 'Lau sạch các bề mặt kính lái, kính hông và gương.', camPos: [0, 5, 12] },
        ]
    },
    standard: {
        label: "Gói Cơ Bản (Standard)",
        steps: [
            { id: 1, type: 'exterior_wash', name: 'Rửa ngoại thất', desc: 'Xịt nước áp lực cao sạch bụi bẩn bề mặt sơn.', camPos: [15, 6, 15] },
            { id: 2, type: 'interior_vacuum', name: 'Hút bụi nội thất', desc: 'Hút sạch bụi bẩn sàn xe, thảm để chân và các khe hở.', camPos: [0, 4, 8] },
            { id: 3, type: 'dashboard_polish', name: 'Đánh bóng taplo', desc: 'Lau dọn và phủ lớp dưỡng bóng bề mặt bảng điều khiển.', camPos: [0, 3, 5] },
            { id: 4, type: 'tire_cleaning', name: 'Làm bóng lốp', desc: 'Quét dung dịch bảo dưỡng giúp lốp đen bóng như mới.', camPos: [-10, 1.5, 10] },
            { id: 5, type: 'air_freshener', name: 'Xịt thơm khử mùi', desc: 'Khử khuẩn và phun tinh dầu hương thơm tự nhiên.', camPos: [0, 5, 10] },
        ]
    },
    premium: {
        label: "Gói Cao Cấp (Premium)",
        steps: [
            { id: 1, type: 'exterior_wash', name: 'Rửa ngoại thất toàn diện', desc: 'Rửa sạch sâu vỏ xe, gầm xe và các hốc bánh.', camPos: [15, 8, 15] },
            { id: 2, type: 'interior_vacuum', name: 'Vệ sinh nội thất chuyên sâu', desc: 'Giặt sấy thảm, vệ sinh trần xe, sàn xe và các cửa gió điều hòa.', camPos: [0, 4, 8] },
            { id: 3, type: 'wax_coating', name: 'Phủ sáp bóng sơn (Wax)', desc: 'Tạo lớp sáp bảo vệ tăng độ sâu và độ bóng cho màu sơn.', camPos: [12, 6, -12] },
            { id: 4, type: 'leather_conditioning', name: 'Bảo dưỡng bề mặt da', desc: 'Thoa kem dưỡng chuyên dụng chống nứt nẻ cho ghế da.', camPos: [0, 3, 6] },
            { id: 5, type: 'engine_cleaning', name: 'Vệ sinh khoang máy', desc: 'Dọn sạch bụi, lá cây và dưỡng các đường ống cao su trong capo.', camPos: [0, 5, -10] },
            { id: 6, type: 'ceramic_spray', name: 'Xịt phủ Ceramic', desc: 'Xịt phủ dung dịch tạo hiệu ứng lá sen kháng nước vượt trội.', camPos: [15, 5, 15] },
        ]
    }
};

// ==========================================
// 🚀 MAIN WORKSPACE COMPONENT
// ==========================================
export const AutoWashSimulationTest: React.FC = () => {
    const [currentPackageKey, setCurrentPackageKey] = useState<string>('express');
    const currentSteps = PACKAGES_CONFIG[currentPackageKey].steps;

    const [activeStep, setActiveStep] = useState<WashStep>(currentSteps[0]);
    const [showComplete, setShowComplete] = useState(false);
    const [isAutoPlay, setIsAutoPlay] = useState(false);

    useEffect(() => {
        setActiveStep(currentSteps[0]);
        setShowComplete(false);
    }, [currentPackageKey, currentSteps]);

    const handleCloseModalAndUpdateStatus = async () => {
        toast.info("[TEST MODE] Giả lập gửi trạng thái Completed...");
        setTimeout(() => {
            toast.success("[TEST MODE] Đã mô phỏng quy trình hoàn tất xe thành công!");
            setShowComplete(false);
            setActiveStep(currentSteps[0]);
        }, 1000);
    };

    const handleNextStep = useCallback(() => {
        const currentIndex = currentSteps.findIndex((s) => s.id === activeStep.id);

        if (currentIndex === currentSteps.length - 1) {
            setShowComplete(true);
        } else {
            setActiveStep(currentSteps[currentIndex + 1]);
        }
    }, [activeStep.id, currentSteps]);

    useEffect(() => {
        if (showComplete || !isAutoPlay) return;

        const interval = setInterval(() => {
            handleNextStep();
        }, 5000);

        return () => clearInterval(interval);
    }, [handleNextStep, showComplete, isAutoPlay]);

    // Tìm kiếm Component HUD tương ứng dựa trên 'type' của step hiện tại
    const ActiveHUDComponent = STEP_UI_LOOKUP[activeStep.type];

    return (
        <div className="w-full max-w-[1200px] mx-auto p-6 space-y-4">

            {/* 🛠️ BẢNG ĐIỀU KHIỂN CHẾ ĐỘ SANDBOX DEVELOPER */}
            <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                <div>
                    <h3 className="text-amber-800 font-bold text-sm flex items-center gap-2">
                        <span>🛠️</span> WORKSHOP DEV & DESIGN SANDBOX
                    </h3>
                    <p className="text-amber-600 text-xs mt-0.5">
                        Thay đổi các gói dịch vụ tùy chọn để kiểm tra tính tương thích hiển thị của giao diện HUD thời gian thực.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <select
                        value={currentPackageKey}
                        onChange={(e) => setCurrentPackageKey(e.target.value)}
                        className="bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none shadow-sm focus:border-amber-500"
                    >
                        {Object.entries(PACKAGES_CONFIG).map(([key, value]) => (
                            <option key={key} value={key}>{value.label}</option>
                        ))}
                    </select>

                    <label className="inline-flex items-center cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-amber-300 text-xs font-semibold text-slate-700 shadow-sm select-none">
                        <input
                            type="checkbox"
                            checked={isAutoPlay}
                            onChange={(e) => setIsAutoPlay(e.target.checked)}
                            className="mr-2 accent-blue-600"
                        />
                        Auto Play (5s)
                    </label>
                </div>
            </div>

            {/* KHOANG MÔ PHỎNG CHÍNH MÀN HÌNH CHĂM SÓC XE */}
            <div className="w-full bg-white rounded-3xl p-6 shadow-md flex flex-col md:flex-row gap-6 h-[600px] relative border border-slate-100">

                {/* Khu vực Canvas 3D Viewport */}
                <div className="flex-1 bg-slate-100 rounded-2xl overflow-hidden relative">
                    <Canvas camera={{ fov: 45, position: activeStep.camPos }}>
                        <color attach="background" args={['#f1f5f9']} />
                        <ambientLight intensity={1.5} />
                        <spotLight position={[15, 20, 15]} angle={0.3} penumbra={1} intensity={3} castShadow />

                        <Stage environment="apartment" intensity={0.7} adjustCamera={false} shadows={{ type: 'contact', opacity: 0.4, blur: 1.5 }}>
                            {/* Ép kiểu hoặc truyền activeStep.type làm prop cho CarWithEffects xử lý hiệu ứng 3D nếu cần */}
                            <CarWithEffects
                                currentStep={activeStep.id}
                                activePackage={currentSteps.map(s => s.type)}
                            />
                        </Stage>

                        <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2} makeDefault enableDamping dampingFactor={0.05} />
                    </Canvas>

                    {/* Tiêu đề góc nhìn camera cố định phía trên bên trái */}
                    <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 p-4 rounded-xl max-w-[280px]">
                        <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-600 text-white rounded mb-1.5 inline-block font-mono">
                            KEY: {activeStep.type}
                        </span>
                        <h4 className="text-white font-bold text-sm">{activeStep.name}</h4>
                        <p className="text-slate-400 text-xs mt-1 leading-relaxed">{activeStep.desc}</p>
                    </div>

                    {/* 🎯 KHOANG CHỨA GIAO DIỆN RIÊNG CHO TỪNG BƯỚC (DỰA TRÊN TYPE KHÔNG TRÙNG LẶP) */}
                    <div className="absolute bottom-4 left-4 right-4 pointer-events-none z-10 max-w-sm">
                        {ActiveHUDComponent ? <ActiveHUDComponent /> : null}
                    </div>
                </div>

                {/* Khu vực Sidebar Quản lý quy trình phía bên phải */}
                <div className="w-full md:w-[320px] flex flex-col justify-between py-2">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 mb-0.5">Quy Trình Tự Động</h2>
                        <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md inline-block mb-4">
                            {PACKAGES_CONFIG[currentPackageKey].label}
                        </span>
                        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                            {currentSteps.map((step, idx) => {
                                const isSelected = activeStep.id === step.id;
                                return (
                                    <button
                                        key={step.id}
                                        onClick={() => {
                                            setActiveStep(step);
                                            setIsAutoPlay(false); // Dừng chạy tự động khi dev click xem tay
                                        }}
                                        className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${isSelected ? 'bg-blue-50 border-blue-500 shadow-sm' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                                            }`}
                                    >
                                        <div>
                                            <span className={`text-[10px] font-bold block ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}>
                                                BƯỚC 0{idx + 1}
                                            </span>
                                            <span className={`text-sm font-semibold ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
                                                {step.name}
                                            </span>
                                        </div>
                                        <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'}`} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Hệ thống cụm nút thao tác */}
                    <button
                        onClick={handleNextStep}
                        disabled={showComplete}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-colors shadow-md shadow-blue-100 text-center block mt-4 disabled:opacity-50"
                    >
                        {activeStep.id === currentSteps.length ? "Hoàn Tất Quy Trình Rửa ✔" : "Kích Hoạt Bước Tiếp Theo →"}
                    </button>

                    {/* Lớp phủ mờ Modal chúc mừng khi hoàn thành gói cước */}
                    {showComplete && (
                        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm transition-opacity">
                            <div className="bg-white p-8 rounded-2xl shadow-2xl text-center transform animate-in zoom-in max-w-[340px] mx-4">
                                <div className="text-5xl mb-4">🎉</div>
                                <h2 className="text-2xl font-bold text-slate-800">Hoàn tất!</h2>
                                <p className="text-slate-600 mt-2 text-sm">Hệ thống mô phỏng gói dịch vụ đã thực hiện thành công.</p>
                                <button
                                    onClick={handleCloseModalAndUpdateStatus}
                                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors shadow-md"
                                >
                                    Đóng & Xác nhận (Mock)
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};