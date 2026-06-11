import React, { useState } from 'react';
import { BranchStep } from '../components/booking/BranchStep';
import { PackageStep } from '../components/booking/PackageStep';
import { VehicleStep } from '../components/booking/VehicleStep';
import { SlotStep } from '../components/booking/SlotStep';
import { PaymentStep } from '../components/booking/PaymentStep';
import type { PaymentMethod } from '../components/booking/PaymentStep';
import { SummaryStep, BookingSuccessModal } from '../components/booking/SummaryStep';
import type { Branch } from '../../domain/models/branch/branch.model';
import type { WashPackage } from '../../domain/models/wash-package/wash-package.model';
import type { Vehicle } from '../../domain/models/vehicle/vehicle.model';
import { CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type BookingStep = 'branch' | 'package' | 'vehicle' | 'slot' | 'payment' | 'summary';

export const BookingPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<BookingStep>('branch');
    
    // State lưu trữ dữ liệu khách hàng chọn qua từng bước
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
    const [selectedPackage, setSelectedPackage] = useState<WashPackage | null>(null);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedSlot, setSelectedSlot] = useState<string>('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('card');
    const [pointsUsed, setPointsUsed] = useState(0);

    // State cho thành công
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [bookingCode, setBookingCode] = useState('');

    // Hàm chuyển bước
    const nextStep = () => {
        if (currentStep === 'branch') setCurrentStep('package');
        else if (currentStep === 'package') setCurrentStep('vehicle');
        else if (currentStep === 'vehicle') setCurrentStep('slot');
        else if (currentStep === 'slot') setCurrentStep('payment');
        else if (currentStep === 'payment') setCurrentStep('summary');
    };

    const prevStep = () => {
        if (currentStep === 'package') setCurrentStep('branch');
        else if (currentStep === 'vehicle') setCurrentStep('package');
        else if (currentStep === 'slot') setCurrentStep('vehicle');
        else if (currentStep === 'payment') setCurrentStep('slot');
        else if (currentStep === 'summary') setCurrentStep('payment');
    };

    // Render thanh tiến trình (Step Indicator)
    const renderStepIndicator = () => {
        const steps: { key: BookingStep; label: string }[] = [
            { key: 'branch', label: 'Branch' },
            { key: 'package', label: 'Package' },
            { key: 'vehicle', label: 'Vehicle' },
            { key: 'slot', label: 'Time' },
            { key: 'payment', label: 'Payment' },
            { key: 'summary', label: 'Review' },
        ];

        return (
            <div className="flex items-center justify-between max-w-3xl mx-auto mb-12">
                {steps.map((step, index) => {
                    const isActive = currentStep === step.key;
                    const isCompleted = steps.findIndex(s => s.key === currentStep) > index;

                    return (
                        <React.Fragment key={step.key}>
                            <div className="flex flex-col items-center relative">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                    isActive ? 'border-blue-600 bg-blue-600 text-white' :
                                    isCompleted ? 'border-green-500 bg-green-500 text-white' :
                                    'border-gray-200 bg-white text-gray-400'
                                }`}>
                                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : index + 1}
                                </div>
                                <span className={`absolute -bottom-7 text-xs font-bold whitespace-nowrap ${
                                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                                }`}>
                                    {step.label}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-4 ${
                                    steps.findIndex(s => s.key === currentStep) > index ? 'bg-green-500' : 'bg-gray-100'
                                }`} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            {renderStepIndicator()}

            <div className="mt-16 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm min-h-[500px] flex flex-col">
                <div className="flex-1">
                    {currentStep === 'branch' && (
                        <BranchStep 
                            selectedBranchId={selectedBranch?.id}
                            onSelect={(branch) => {
                                setSelectedBranch(branch);
                                nextStep();
                            }} 
                        />
                    )}

                    {currentStep === 'package' && (
                        <PackageStep
                            selectedPackageId={selectedPackage?.id}
                            onSelect={(pkg) => {
                                setSelectedPackage(pkg);
                                nextStep();
                            }}
                        />
                    )}

                    {currentStep === 'vehicle' && (
                        <VehicleStep
                            selectedVehicleId={selectedVehicle?.id}
                            onSelect={(vehicle) => {
                                setSelectedVehicle(vehicle);
                                nextStep();
                            }}
                        />
                    )}

                    {currentStep === 'slot' && selectedBranch && (
                        <SlotStep
                            branchId={selectedBranch.id}
                            selectedDate={selectedDate}
                            selectedSlot={selectedSlot}
                            onSelect={(date, slot) => {
                                setSelectedDate(date);
                                setSelectedSlot(slot);
                            }}
                        />
                    )}

                    {currentStep === 'payment' && selectedPackage && (
                        <PaymentStep
                            totalAmount={selectedPackage.price}
                            selectedMethod={selectedPaymentMethod}
                            onSelect={(method, pts) => {
                                setSelectedPaymentMethod(method);
                                setPointsUsed(pts);
                            }}
                        />
                    )}

                    {currentStep === 'summary' && selectedBranch && selectedPackage && selectedVehicle && (
                        <SummaryStep
                            branch={selectedBranch}
                            pkg={selectedPackage}
                            vehicle={selectedVehicle}
                            date={selectedDate}
                            slot={selectedSlot}
                            paymentMethod={selectedPaymentMethod}
                            pointsUsed={pointsUsed}
                            onEdit={(step) => setCurrentStep(step)}
                            onSuccess={(code) => {
                                setBookingCode(code);
                                setShowSuccessModal(true);
                            }}
                        />
                    )}
                </div>

                {/* Navigation Buttons */}
                {currentStep !== 'summary' && (
                    <div className="mt-12 flex items-center justify-between border-t border-gray-50 pt-8">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 'branch'}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                                currentStep === 'branch' 
                                ? 'text-gray-300 cursor-not-allowed' 
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Back
                        </button>

                        {(currentStep === 'slot' || currentStep === 'payment') && (
                            <button
                                onClick={nextStep}
                                disabled={currentStep === 'slot' && (!selectedDate || !selectedSlot)}
                                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${
                                    (currentStep === 'slot' && (!selectedDate || !selectedSlot))
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
                                }`}
                            >
                                {currentStep === 'payment' ? 'Review Order' : 'Next Step'}
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <BookingSuccessModal 
                    bookingCode={bookingCode} 
                    onClose={() => navigate('/booking-history')} 
                />
            )}
        </div>
    );
};
