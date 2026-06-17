import React, { useEffect, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { CarWithEffects } from "@/shared/car-with-effect.tsx";
import { toast } from 'sonner';

// 🌟 IMPORT THÊM CÁC HOOK CẦN THIẾT
import { useStaffDashboard } from '../features/products/application/useStaffDashboard.ts';
import { useBooking } from '../features/products/application/useBooking.ts'; // 🎯 Thêm hook này để lấy data lịch đặt

const WASH_STEPS = [
    { id: 1, name: '1. Phun nước áp lực cao', desc: 'Hệ thống vòi phun cao áp xịt nước toàn thân xe.', camPos: [15, 6, 15] },
    { id: 2, name: '2. Phun bọt tuyết làm mềm vết bẩn', desc: 'Phun bọt tuyết trắng bao phủ làm mềm vết bẩn.', camPos: [0, 12, 20] },
    { id: 3, name: '3. Cọ rửa tự động thân xe', desc: 'Chổi lô thông minh xoay tròn chà sạch sườn xe.', camPos: [18, 4, 8] },
    { id: 4, name: '4. Rửa sạch bằng nước áp lực cao', desc: 'Rửa sạch xe bằng hệ thống vòi phun cao áp xịt nước toàn thân xe.', camPos: [0, 12, 20] },
    { id: 5, name: '5. Sấy khô siêu tốc', desc: 'Hệ thống quạt thổi khí nóng làm khô bề mặt sơn.', camPos: [0, 8, 18] },
];

interface AutoWashSimulationProps {
    bookingId?: string;   // 🌟 Đổi thành optional (?) vì chạy từ Route sẽ không có prop này
    staffId?: string;
}

export const AutoWashSimulation: React.FC<AutoWashSimulationProps> = ({ bookingId: propBookingId, staffId }) => {
    const [activeStep, setActiveStep] = useState(WASH_STEPS[0]);
    const [showComplete, setShowComplete] = useState(false);

    const { actions } = useStaffDashboard();

    // 🌟 TỰ ĐỘNG DÒ ID KHI CHẠY DẠNG ROUTE ĐỘC LẬP
    const { myBookings } = useBooking();

    // Tìm lịch đặt xe đang chạy (Ưu tiên InProgress, hoặc Queued/Confirmed để tiện test máy)
    const activeBooking = myBookings.find(b => b.status === 'InProgress' || b.status === 'Queued' || b.status === 'Confirmed');

    // Nếu có prop thì ưu tiên dùng prop, không thì lấy ID tự động tìm được
    const bookingId = propBookingId || activeBooking?.id;

    // Hàm xử lý khi kết thúc bước 5
    const handleWashSuccess = useCallback(async () => {
        // 🌟 Bẫy phòng vệ chặn lỗi undefined trước khi gọi API
        if (!bookingId) {
            toast.error("Không tìm thấy mã lịch đặt xe hợp lệ để cập nhật!");
            return;
        }

        setShowComplete(true);
        try {
            await actions.updateStatus({
                id: bookingId,
                payload: {
                    targetStatus: 3, // Hoặc "Completed" tùy theo interface Payload của ông
                    staffId: staffId || undefined
                }
            });
            toast.success("Trạm rửa xe đã hoàn thành công việc và đồng bộ hệ thống!");
        } catch (error) {
            toast.error("Rửa xong rồi nhưng cập nhật trạng thái lên server thất bại.");
        }
    }, [bookingId, staffId, actions]);

    // Tự động nhảy bước tuần tự
    const handleNextStep = useCallback(() => {
        const currentIndex = WASH_STEPS.findIndex((s) => s.id === activeStep.id);

        if (currentIndex === WASH_STEPS.length - 1) {
            handleWashSuccess();
            setActiveStep(WASH_STEPS[0]);
        } else {
            setActiveStep(WASH_STEPS[currentIndex + 1]);
        }
    }, [activeStep.id, handleWashSuccess]);

    // Thiết lập Interval tự động chạy qua các phân đoạn
    useEffect(() => {
        const interval = setInterval(() => {
            handleNextStep();
        }, 5000);
        return () => clearInterval(interval);
    }, [handleNextStep]);

    // 🌟 THÊM GIAO DIỆN CHỜ NẾU HỆ THỐNG CHƯA LOAD XONG ID HOẶC KHÔNG CÓ LỊCH ĐẶT
    if (!bookingId) {
        return (
            <div className="w-full max-w-[1100px] mx-auto bg-white rounded-3xl p-6 shadow-md flex items-center justify-center h-[600px]">
                <div className="text-center">
                    <div className="text-4xl mb-3 animate-bounce">🚗</div>
                    <p className="text-slate-500 font-medium text-sm">
                        Đang đồng bộ dữ liệu trạm rửa xe hoặc không có lịch đặt nào khả dụng...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1100px] mx-auto bg-white rounded-3xl p-6 shadow-md flex flex-col md:flex-row gap-6 h-[600px] relative">
            {/* ... Giữ nguyên toàn bộ phần giao diện return (Canvas, Panel Phải) bên dưới của ông ... */}
            <div className="flex-1 bg-slate-100 rounded-2xl overflow-hidden relative">
                <Canvas camera={{ fov: 45, position: [15, 8, 15] }}>
                    <color attach="background" args={['#f1f5f9']} />
                    <ambientLight intensity={1.5} />
                    <spotLight position={[15, 20, 15]} angle={0.3} penumbra={1} intensity={3} castShadow />
                    <Stage environment="apartment" intensity={0.7} adjustCamera={false} shadows={{ type: 'contact', opacity: 0.4, blur: 1.5 }}>
                        <CarWithEffects currentStep={activeStep.id} />
                    </Stage>
                    <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2} makeDefault enableDamping dampingFactor={0.05} />
                </Canvas>
                <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 p-4 rounded-xl max-w-[280px]">
                    <h4 className="text-white font-bold text-sm">{activeStep.name}</h4>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">{activeStep.desc}</p>
                </div>
            </div>

            <div className="w-full md:w-[320px] flex flex-col justify-between py-2">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Quy Trình Tự Động</h2>
                    <p className="text-xs text-slate-500 mb-6">Mô phỏng camera trạm rửa xe tự động thời gian thực.</p>
                    <div className="space-y-3">
                        {WASH_STEPS.map((step) => {
                            const isSelected = activeStep.id === step.id;
                            return (
                                <button
                                    key={step.id}
                                    onClick={() => setActiveStep(step)}
                                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                                        isSelected ? 'bg-blue-50 border-blue-500 shadow-sm' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                                    }`}
                                >
                                    <div>
                                        <span className={`text-xs font-bold block ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}>
                                            PHÂN ĐOẠN 0{step.id}
                                        </span>
                                        <span className={`text-sm font-semibold ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
                                            {step.name.split('. ')[1]}
                                        </span>
                                    </div>
                                    <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'}`} />
                                </button>
                            );
                        })}
                    </div>
                </div>

                <button
                    onClick={handleNextStep}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-colors shadow-md shadow-blue-100 text-center block mt-4"
                >
                    {activeStep.id === 5 ? "Hoàn Tất Quy Trình Rửa ✔" : "Kích Hoạt Bước Tiếp Theo →"}
                </button>

                {showComplete && (
                    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm transition-opacity">
                        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center transform animate-in zoom-in">
                            <div className="text-5xl mb-4">🎉</div>
                            <h2 className="text-2xl font-bold text-slate-800">Hoàn tất!</h2>
                            <p className="text-slate-600 mt-2">Xe đã sạch bong sáng bóng và trạng thái đã được cập nhật.</p>
                            <button onClick={() => setShowComplete(false)} className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg">
                                Đóng
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};