import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { CarWithEffects } from "@/shared/car-with-effect.tsx";
import { toast } from 'sonner';

import { useBooking } from '../features/products/application/useBooking.ts';

type StepType =
    | 'exterior_wash'
    | 'tire_cleaning'
    | 'window_cleaning'
    | 'interior_vacuum'
    | 'tire_shine'
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

const FEATURE_MAP: Record<string, { type: StepType; name: string; desc: string; camPos: [number, number, number] }> = {
    "Exterior wash": { type: 'exterior_wash', name: 'Rửa ngoại thất', desc: 'Xịt nước áp lực cao sạch bụi bẩn bề mặt sơn.', camPos: [15, 6, 15] },
    "Interior vacuum": { type: 'interior_vacuum', name: 'Hút bụi nội thất', desc: 'Hút sạch bụi bẩn sàn xe, thảm để chân và các khe hở.', camPos: [0, 4, 8] },
    "Dashboard polish": { type: 'dashboard_polish', name: 'Đánh bóng taplo', desc: 'Lau dọn và phủ lớp dưỡng bóng bề mặt bảng điều khiển.', camPos: [0, 3, 5] },
    "Tire shine": { type: 'tire_cleaning', name: 'Làm bóng lốp', desc: 'Quét dung dịch bảo dưỡng giúp lốp đen bóng như mới.', camPos: [-10, 1.5, 10] },
    "Air freshener": { type: 'air_freshener', name: 'Xịt thơm khử mùi', desc: 'Khử khuẩn và phun tinh dầu hương thơm tự nhiên.', camPos: [0, 5, 10] },
    "Tire cleaning": { type: 'tire_cleaning', name: 'Vệ sinh lốp xe', desc: 'Chà rửa mâm lốp và làm sạch hệ thống phanh.', camPos: [10, 1.5, 10] },
    "Window cleaning": { type: 'window_cleaning', name: 'Vệ sinh kính xe', desc: 'Lau sạch các bề mặt kính lái, kính hông và gương.', camPos: [0, 5, 12] },
    "Full exterior wash": { type: 'exterior_wash', name: 'Rửa ngoại thất toàn diện', desc: 'Rửa sạch sâu vỏ xe, gầm xe và các hốc bánh.', camPos: [15, 8, 15] },
    "Interior deep clean": { type: 'interior_vacuum', name: 'Vệ sinh nội thất chuyên sâu', desc: 'Giặt sấy thảm, vệ sinh trần xe, sàn xe và các cửa gió điều hòa.', camPos: [0, 4, 8] },
    "Wax coating": { type: 'wax_coating', name: 'Phủ sáp bóng sơn (Wax)', desc: 'Tạo lớp sáp bảo vệ tăng độ sâu và độ bóng cho màu sơn.', camPos: [12, 6, -12] },
    "Leather conditioning": { type: 'leather_conditioning', name: 'Bảo dưỡng bề mặt da', desc: 'Thoa kem dưỡng chuyên dụng chống nứt nẻ cho ghế da.', camPos: [0, 3, 6] },
    "Engine bay cleaning": { type: 'engine_cleaning', name: 'Vệ sinh khoang máy', desc: 'Dọn sạch bụi, lá cây và dưỡng các đường ống cao su trong capo.', camPos: [0, 5, -10] },
    "Ceramic spray": { type: 'ceramic_spray', name: 'Xịt phủ Ceramic', desc: 'Xịt phủ dung dịch tạo hiệu ứng lá sen kháng nước vượt trội.', camPos: [15, 5, 15] },
    "Tire shine": { type: 'tire_shine', name: 'Làm bóng lốp', desc: 'Quét dung dịch bảo dưỡng giúp lốp đen bóng như mới.', camPos: [-10, 1.5, 10] },
};

const ExteriorWashUI: React.FC = () => (
    <div className="bg-slate-950/85 backdrop-blur-md text-white p-4 rounded-2xl border border-blue-500/40 shadow-xl animate-in fade-in max-w-[280px]">
        <h5 className="font-bold text-xs text-blue-400 uppercase tracking-widest mb-1">Hệ thống vòi phun</h5>
        <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Áp lực: <strong className="text-white">150 Bar</strong></span>
            <span className="text-slate-500">|</span>
            <span>Lưu lượng: <strong className="text-white">12L/p</strong></span>
        </div>
    </div>
);

const TireCleaningUI: React.FC = () => (
    <div className="bg-slate-950/85 backdrop-blur-md text-white p-4 rounded-2xl border border-amber-500/40 shadow-xl animate-in fade-in max-w-[280px]">
        <h5 className="font-bold text-xs text-amber-400 uppercase tracking-widest mb-1">Chổi lô thông minh</h5>
        <div className="text-[11px] text-slate-300 space-y-0.5">
            <div>Cơ chế: <strong className="text-white">Xoay đảo chiều liên tục</strong></div>
            <div>Dung dịch bọt: <strong className="text-white">Active Foam Tire</strong></div>
        </div>
    </div>
);

const InteriorUI: React.FC<{ title: string; colorClass: string }> = ({ title, colorClass }) => (
    <div className="bg-slate-950/85 backdrop-blur-md text-white p-4 rounded-2xl border border-slate-700 shadow-xl animate-in fade-in max-w-[280px]">
        <h5 className={`font-bold text-xs ${colorClass} uppercase tracking-widest mb-1`}>{title}</h5>
        <p className="text-[11px] text-slate-400">Đang mô phỏng mở cửa xe và thao tác khu vực nội thất...</p>
    </div>
);

const STEP_UI_LOOKUP: Record<StepType, React.FC | null> = {
    exterior_wash: ExteriorWashUI,
    tire_cleaning: TireCleaningUI,
    tire_shine: TireCleaningUI,
    window_cleaning: () => <div className="bg-slate-950/85 backdrop-blur-md text-white p-3 rounded-xl border border-teal-500/40 text-[11px]">🧽 Đang vệ sinh các mặt kính xe...</div>,
    interior_vacuum: () => <InteriorUI title="Hút bụi chân không" colorClass="text-purple-400" />,
    dashboard_polish: () => <InteriorUI title="Dưỡng bóng Taplo" colorClass="text-indigo-400" />,
    leather_conditioning: () => <InteriorUI title="Bảo dưỡng Ghế Da" colorClass="text-sky-400" />,
    air_freshener: () => <InteriorUI title="Khử mùi Nội thất" colorClass="text-pink-400" />,
    wax_coating: () => <div className="bg-slate-950/85 backdrop-blur-md text-white p-3 rounded-xl border border-yellow-500/40 text-[11px]">✨ Kính hoạt cánh tay phủ màng sáp bóng Wax sơn...</div>,
    ceramic_spray: () => <div className="bg-slate-950/85 backdrop-blur-md text-white p-3 rounded-xl border border-cyan-500/40 text-[11px]">🛡️ Phun dung dịch tạo lớp bảo vệ Ceramic...</div>,
    engine_cleaning: () => <div className="bg-slate-950/85 backdrop-blur-md text-white p-4 rounded-2xl border border-red-500/40 shadow-xl text-[11px]">⚙️ Đang dọn dẹp khoang động cơ bằng hơi nước nóng...</div>,
};

// ==========================================
// 🚀 MAIN COMPONENT
// ==========================================
export const AutoWashSimulation: React.FC = () => {
    const { myBookings, completedBooking, isCompleted } = useBooking();

    // Lấy TẤT CẢ các xe đang trong trạng thái rửa (InProgress)
    const inProgressBookings = useMemo(() => {
        return myBookings.filter(b => b.status === 'InProgress');
    }, [myBookings]);

    // Trạng thái quản lý lịch đặt đang được CHỌN ĐỂ XEM
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

    // Tự động chọn xe đầu tiên khi component load nếu có xe đang rửa
    useEffect(() => {
        if (inProgressBookings.length > 0 && !selectedBookingId) {
            setSelectedBookingId(inProgressBookings[0].id);
        }
    }, [inProgressBookings, selectedBookingId]);

    // Booking đang được chọn để hiển thị mô phỏng
    const activeBooking = useMemo(() => {
        return inProgressBookings.find(b => b.id === selectedBookingId) || null;
    }, [inProgressBookings, selectedBookingId]);


    // Parse mảng features động từ API Response dựa trên booking ĐANG CHỌN
    const currentSteps = useMemo<WashStep[]>(() => {
        if (!activeBooking || !activeBooking.features) {
            return [{ id: 1, type: 'exterior_wash', name: 'Rửa ngoại thất', desc: 'Đang chuẩn bị...', camPos: [15, 6, 15] }];
        }

        try {
            const rawFeatures: string[] = typeof activeBooking.features === 'string'
                ? JSON.parse(activeBooking.features)
                : activeBooking.features;

            let counter = 1;
            const mapped: WashStep[] = [];

            rawFeatures.forEach((featStr) => {
                const config = FEATURE_MAP[featStr.trim()];
                if (config) {
                    mapped.push({
                        id: counter++,
                        type: config.type,
                        name: config.name,
                        desc: config.desc,
                        camPos: config.camPos
                    });
                }
            });

            return mapped.length > 0 ? mapped : [
                { id: 1, type: 'exterior_wash', name: 'Rửa ngoại thất', desc: 'Xịt nước áp lực cao.', camPos: [15, 6, 15] }
            ];
        } catch (e) {
            console.error("Lỗi parse features:", e);
            return [{ id: 1, type: 'exterior_wash', name: 'Rửa ngoại thất', desc: 'Xịt nước áp lực cao.', camPos: [15, 6, 15] }];
        }
    }, [activeBooking]);


    const [activeStep, setActiveStep] = useState<WashStep | null>(null);
    const [showComplete, setShowComplete] = useState(false);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    // Khi khách chọn đổi xe -> Reset lại về bước đầu tiên
    useEffect(() => {
        if (currentSteps.length > 0) {
            setActiveStep(currentSteps[0]);
            setShowComplete(false);
        }
    }, [currentSteps, selectedBookingId]);

    const progressPercent = useMemo(() => {
        if (!activeStep || currentSteps.length === 0) return 0;
        if (showComplete) return 100;

        const currentIndex = currentSteps.findIndex(s => s.id === activeStep.id);
        if (currentIndex === -1) return 0;

        return Math.round(((currentIndex + 1) / currentSteps.length) * 100);
    }, [activeStep, currentSteps, showComplete]);


    const handleCloseModalAndUpdateStatus = async () => {
        if (!activeBooking) {
            toast.error("Không tìm thấy mã đặt lịch hợp lệ!");
            return;
        }
        try {
            await completedBooking(activeBooking.id);
            toast.success(`Đã hoàn thành xe ${activeBooking.vehiclePlate}!`);
            setShowComplete(false);

            // Xóa khỏi danh sách theo dõi nếu đã hoàn thành (Logic re-fetch myBookings sẽ lo việc này)
            setSelectedBookingId(null);

        } catch (error) {
            toast.error("Cập nhật lên máy chủ thất bại!");
        }
    };

    const handleNextStep = useCallback(() => {
        if (!activeStep) return;
        const currentIndex = currentSteps.findIndex((s) => s.id === activeStep.id);

        if (currentIndex === currentSteps.length - 1) {
            setShowComplete(true);
        } else {
            setActiveStep(currentSteps[currentIndex + 1]);
        }
    }, [activeStep, currentSteps]);

    useEffect(() => {
        if (showComplete || !isAutoPlay || !activeStep) return;

        const interval = setInterval(() => {
            handleNextStep();
        }, 5000);

        return () => clearInterval(interval);
    }, [handleNextStep, showComplete, isAutoPlay, activeStep]);


    // Giao diện khi khách không có xe nào đang InProgress
    if (inProgressBookings.length === 0) {
        return (
            <div className="w-full max-w-[1200px] mx-auto bg-white rounded-3xl p-6 shadow-md flex items-center justify-center h-[600px]">
                <div className="text-center">
                    <div className="text-4xl mb-3 animate-bounce">🚗</div>
                    <p className="text-slate-500 font-medium text-sm">Hiện tại bạn không có xe nào đang được phục vụ tại trạm.</p>
                </div>
            </div>
        );
    }

    const ActiveHUDComponent = activeStep ? STEP_UI_LOOKUP[activeStep.type] : null;

    return (
        <div className="w-full max-w-[1200px] mx-auto bg-white rounded-3xl p-6 shadow-md flex flex-col md:flex-row gap-6 h-[650px] relative">

            {/* VÙNG 1: SIDEBAR - DANH SÁCH CÁC XE ĐANG RỬA */}
            <div className="w-full md:w-[240px] flex flex-col border-r border-slate-100 pr-4">
                <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    Xe Đang Rửa ({inProgressBookings.length})
                </h3>

                <div className="space-y-3 overflow-y-auto custom-scrollbar pr-2">
                    {inProgressBookings.map((booking) => {
                        const isSelected = booking.id === selectedBookingId;
                        return (
                            <button
                                key={booking.id}
                                onClick={() => setSelectedBookingId(booking.id)}
                                className={`w-full text-left p-3.5 rounded-xl border transition-all ${isSelected
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200'
                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                                    }`}
                            >
                                <div className={`text-[10px] font-bold mb-1 tracking-wider ${isSelected ? 'text-blue-200' : 'text-slate-500'}`}>
                                    BIỂN SỐ
                                </div>
                                <div className="font-bold text-lg mb-0.5">{booking.vehiclePlate}</div>
                                <div className={`text-xs truncate ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                                    {booking.vehicleName}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* VÙNG 2: CANVAS 3D CAMERA TRẠM RỬA */}
            {activeBooking && activeStep ? (
                <>
                    <div className="flex-1 bg-slate-100 rounded-2xl overflow-hidden relative">
                        <Canvas camera={{ fov: 45, position: activeStep.camPos }}>
                            <color attach="background" args={['#f1f5f9']} />
                            <ambientLight intensity={1.5} />
                            <spotLight position={[15, 20, 15]} angle={0.3} penumbra={1} intensity={3} castShadow />

                            <Stage environment="apartment" intensity={0.7} adjustCamera={false} shadows={{ type: 'contact', opacity: 0.4, blur: 1.5 }}>
                                <CarWithEffects
                                    currentStep={activeStep.id}
                                    activePackage={currentSteps.map(s => s.type)}
                                />
                            </Stage>

                            <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2} makeDefault enableDamping dampingFactor={0.05} />
                        </Canvas>

                        {/* Tiêu đề góc nhìn camera */}
                        <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 p-4 rounded-xl max-w-[280px]">
                            <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-600 text-white rounded mb-1.5 inline-block font-mono">
                                KEY: {activeStep.type}
                            </span>
                            <h4 className="text-white font-bold text-sm">{activeStep.name}</h4>
                            <p className="text-slate-400 text-xs mt-1 leading-relaxed">{activeStep.desc}</p>
                        </div>

                        {/* Giao diện HUD 2D động */}
                        {ActiveHUDComponent && (
                            <div className="absolute bottom-4 left-4 z-10">
                                <ActiveHUDComponent />
                            </div>
                        )}

                        {/* Thanh tiến độ (%) động */}
                        <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-700/50 flex items-center gap-3 min-w-[200px]">
                            <div className="flex-1">
                                <div className="flex justify-between text-[11px] text-slate-400 font-medium mb-1">
                                    <span>Tiến độ tổng thể</span>
                                    <span className="text-blue-400 font-bold">{progressPercent}%</span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1.5 rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* VÙNG 3: DANH SÁCH BƯỚC ĐANG CHẠY */}
                    <div className="w-full md:w-[280px] flex flex-col justify-between py-2">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">Quy Trình Rửa</h2>
                                </div>

                                <button
                                    onClick={() => setIsAutoPlay(!isAutoPlay)}
                                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold border transition-all ${isAutoPlay ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'
                                        }`}
                                >
                                    {isAutoPlay ? '▶ Auto' : '⏸ Manual'}
                                </button>
                            </div>

                            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md inline-block mb-4">
                                Gói: {activeBooking.washPackageName || 'Tùy biến'}
                            </span>

                            {/* Render mảng bước động của Booking Đang Chọn */}
                            <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                                {currentSteps.map((step, idx) => {
                                    const isSelected = activeStep.id === step.id;
                                    const isDone = showComplete || (activeStep.id > step.id);

                                    return (
                                        <button
                                            key={step.id}
                                            onClick={() => {
                                                setActiveStep(step);
                                                setIsAutoPlay(false);
                                            }}
                                            className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${isSelected ? 'bg-blue-50 border-blue-500 shadow-sm' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                                                }`}
                                        >
                                            <div className="flex-1 pr-2">
                                                <span className={`text-[9px] font-bold block ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}>
                                                    BƯỚC {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                                                </span>
                                                <h5 className={`font-bold text-xs mt-0.5 ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                                                    {step.name}
                                                </h5>
                                            </div>
                                            <div>
                                                {isDone ? (
                                                    <span className="text-emerald-500 text-xs font-bold">✓</span>
                                                ) : isSelected ? (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                                                ) : (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={handleNextStep}
                                disabled={showComplete}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-colors shadow-md block mt-4 disabled:opacity-50"
                            >
                                {activeStep.id === currentSteps.length ? "Hoàn Tất Xe Này ✔" : "Bước Tiếp Theo →"}
                            </button>
                        </div>
                    </div>
                </>
            ) : null}

            {/* MODAL HOÀN THÀNH */}
            {showComplete && (
                <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in rounded-3xl">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-[340px] mx-4 transform animate-in zoom-in">
                        <div className="text-5xl mb-4">🎉</div>
                        <h2 className="text-2xl font-bold text-slate-800">Hoàn tất rửa xe!</h2>
                        <p className="text-slate-600 mt-2 text-sm">Quy trình cho xe biển số <span className="font-bold">{activeBooking?.vehiclePlate}</span> đã hoàn thành.</p>
                        <button
                            onClick={handleCloseModalAndUpdateStatus}
                            disabled={isCompleted}
                            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors shadow-md disabled:opacity-50"
                        >
                            {isCompleted ? 'Đang lưu kết quả...' : 'Xác nhận & Cập nhật'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};