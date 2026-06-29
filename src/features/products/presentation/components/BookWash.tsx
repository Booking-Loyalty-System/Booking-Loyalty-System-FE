import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { useTranslation } from "react-i18next";
import {
  CheckCircle2,
  Calendar,
  Clock,
  Car,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { useVehicle } from "@/features/products/application/useVehicle.ts";
import { useWashPackage } from "@/features/products/application/useWashPackage.ts";
import { useBooking } from "@/features/products/application/useBooking.ts";
import { VehicleFormModal } from "@/features/products/presentation/components/VehicleFormModal.tsx";
import type {
  Vehicle,
  VehicleFormData,
  VehicleItem,
} from "@/features/products/domain/models/vehicle/vehicle.model.ts";
import {
  detectVehicleType,
  VEHICLE_NAMES_BY_BRAND,
} from "@/shared/constants/vehicle-data";

// Import UI Components
import { TierPriorityWindow } from "@/features/products/presentation/components/TierPriorityWindow.tsx";
import { VehicleSelection } from "@/features/products/presentation/components/VehicleSelection.tsx";
import { NearestBranches } from "./NearestBranches";
import { WashPackageSelection } from "@/features/products/presentation/components/WashPackageSelection.tsx";
import { DateTimeSelection } from "@/features/products/presentation/components/DateTimeSelection.tsx";
import { BookingSummary } from "@/features/products/presentation/components/BookingSummary.tsx";

// Import Utils & Constants
import {
  generateUpcomingDates,
  convertTo24HourFormat,
} from "@/shared/constants/booking-data.ts";
import { toast } from "sonner";
import type { WashPackage } from "@/features/products/domain/models/wash-package/wash-package.model.ts";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { useTimeSlot } from "@/features/products/application/useTimeSlot.ts";
import { useCustomerMe } from "@/features/products/application/useCustomer.ts";
import { VoucherSelection } from "@/features/products/presentation/components/VoucherSelection.tsx";
import type { Voucher } from "@/features/products/domain/models/voucher/voucher.model.ts";
import { usePromotion } from "@/features/products/application/usePromotion.ts";
import type { Promotion } from "@/features/products/domain/models/promotion/promotion.dto.ts";

// 🌟 IMPORT HOOK REWARD
import { useReward } from "@/features/products/application/useReward.ts";

interface CreatedBookingData {
  id: string;
  bookingCode: string;
  bookingDate: string;
  startTime: string;
  totalPrice: number;
  washPackageName?: string;
  vehiclePlate?: string;
  vehicleName?: string;
}

interface SuccessScreenProps {
  booking: CreatedBookingData;
  vehicleInfo?: Vehicle;
  packageInfo?: WashPackage;
  onContinue: () => void;
}

// --- SCREEN CON: THÀNH CÔNG ---
const BookingSuccessScreen: React.FC<SuccessScreenProps> = ({
  booking,
  vehicleInfo,
  packageInfo,
  onContinue,
}) => {
  const { t } = useTranslation("customer");
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"],
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [booking]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const qrValue = booking.bookingCode || booking.id;

  return (
    <div className="max-w-2xl mx-auto my-8 bg-white border border-slate-100 rounded-3xl shadow-xl overflow-hidden p-8 text-center font-sans antialiased animate-fade-in">
      <div className="flex flex-col items-center justify-center space-y-3 mb-6">
        <div className="p-4 bg-emerald-50 rounded-full text-emerald-500">
          <CheckCircle2 className="w-16 h-16" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {t("bookWash.successTitle", { defaultValue: "Đặt Lịch Thành Công!" })}
        </h1>
        <p className="text-sm font-medium text-slate-400">
          {t("bookWash.successSubtitle", {
            defaultValue:
              "Vui lòng kiểm tra lại thông tin biên nhận cuối cùng của bạn dưới đây.",
          })}
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-8 flex flex-col items-center justify-center">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
          {t("bookWash.bookingCodeLabel", {
            defaultValue: "Mã Đặt Lịch (Booking Code)",
          })}
        </span>
        <span className="text-3xl font-mono font-black text-blue-600 tracking-wider mb-6 block">
          {qrValue}
        </span>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm inline-block">
          <QRCodeSVG
            value={qrValue}
            size={160}
            level="H"
            includeMargin={false}
          />
        </div>
        <p className="text-xs font-medium text-slate-500 mt-4 text-center">
          {t("bookWash.qrInstruction", {
            defaultValue:
              "Đưa mã này cho nhân viên quét khi bạn đến cửa hàng nhé!",
          })}
        </p>
      </div>

      <div className="text-left space-y-4 border-b border-dashed border-slate-200 pb-6 mb-6 px-4">
        <div className="flex items-start gap-3">
          <Car className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t("bookWash.vehicleInfoLabel", { defaultValue: "Thông Tin Xe" })}
            </p>
            <p className="text-sm font-extrabold text-slate-800 mt-0.5">
              {booking.vehiclePlate || vehicleInfo?.licensePlate}
              <span className="text-slate-400 font-medium ml-2">
                ({booking.vehicleName || vehicleInfo?.vehicleName})
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <CreditCard className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t("bookWash.serviceSelectedLabel", {
                defaultValue: "Gói Dịch Vụ Đã Chọn",
              })}
            </p>
            <p className="text-sm font-extrabold text-slate-800 mt-0.5">
              {booking.washPackageName || packageInfo?.name}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t("bookWash.appointmentDateLabel", { defaultValue: "Ngày Hẹn" })}
            </p>
            <p className="text-sm font-extrabold text-slate-800 mt-0.5">
              {booking.bookingDate}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t("bookWash.timeSlotLabel", { defaultValue: "Khung Giờ" })}
            </p>
            <p className="text-sm font-extrabold text-slate-800 mt-0.5">
              {booking.startTime}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-2 px-4 mb-8">
        <span className="text-base font-bold text-slate-500">
          {t("bookWash.totalCostLabel", {
            defaultValue: "Tổng chi phí thanh toán:",
          })}
        </span>
        <span className="text-2xl font-black text-slate-900">
          {formatCurrency(booking.totalPrice)}
        </span>
      </div>

      <button
        onClick={onContinue}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
      >
        <span>
          {t("bookWash.viewHistoryBtn", {
            defaultValue: "Xem Lịch Sử Đặt Lịch",
          })}
        </span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

// --- COMPONENT CHÍNH ---
export const BookWash: React.FC = () => {
  const { t } = useTranslation("customer");
  // 1. API & Data Hooks
  const {
    vehicles,
    isLoading: isLoadingVehicles,
    createVehicle,
  } = useVehicle();
  const { washPackages, isLoading: isLoadingPackages } = useWashPackage();
  const { createBooking, isBooking } = useBooking();
  const { customerMe } = useCustomerMe();
  const { validatePromotion } = usePromotion();

  // 🌟 LẤY LỊCH SỬ ĐỔI THƯỞNG VÀ DANH SÁCH VOUCHER ĐÃ MAP SẴN
  const { redeemedVouchersOnly, isLoadingRedemptions } = useReward();

  const dynamicDateSlots = generateUpcomingDates(7);
  const navigate = useNavigate();

  // 2. Local States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [vehicleFormData, setVehicleFormData] = useState<VehicleFormData>({
    licensePlate: "",
    brand: "",
    vehicleName: "",
    model: "",
    color: "",
    type: "Small",
    isPrimary: false,
  });
  const [createdBooking, setCreatedBooking] =
    useState<CreatedBookingData | null>(null);

  // 3. Selection States
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [selectedPackageId, setSelectedPackageId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(
    dynamicDateSlots[0].apiDate,
  );
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [appliedPromotion, setAppliedPromotion] = useState<Promotion | null>(
    null,
  );

  const { weeklySummary, isLoading: isLoadingSlots } = useTimeSlot({
    branchId: selectedBranchId,
    startDate: dynamicDateSlots[0]?.apiDate,
  });

  // 4. Derived states
  const selectedDateSlot = dynamicDateSlots.find(
    (d) => d.apiDate === selectedDate,
  );
  const currentVehicle = vehicles.find(
    (v: Vehicle) => v.id === selectedVehicleId,
  );
  const currentPackage = washPackages.find(
    (p: WashPackage) => p.id === selectedPackageId,
  );

  // 5. Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setVehicleFormData((prev) => {
      const updated = {
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      };
      if (name === "brand") {
        updated.vehicleName = "";
        updated.type = "Small";
      }
      if (name === "vehicleName") {
        updated.type = detectVehicleType(updated.brand, value);
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await createVehicle({
        ...vehicleFormData,
        vehicleType: vehicleFormData.type,
      });
      setVehicleFormData({
        licensePlate: "",
        type: "Small",
        vehicleName: "",
        brand: "",
        model: "",
        color: "",
        isPrimary: false,
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi tạo xe:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedVehicleId)
      return toast.error(
        t("bookWash.toastNoVehicle", {
          defaultValue: "Vui lòng chọn xe của bạn!",
        }),
      );
    if (!selectedBranchId)
      return toast.error(
        t("bookWash.toastNoBranch", {
          defaultValue: "Vui lòng chọn chi nhánh!",
        }),
      );
    if (!selectedPackageId)
      return toast.error(
        t("bookWash.toastNoPackage", {
          defaultValue: "Vui lòng chọn gói rửa xe!",
        }),
      );
    if (!selectedTime)
      return toast.error(
        t("bookWash.toastNoTime", { defaultValue: "Vui lòng chọn khung giờ!" }),
      );

    setIsCreating(true);
    try {
      const apiStartTime = convertTo24HourFormat(selectedTime);

      const newBookingData = await createBooking({
        vehicleId: selectedVehicleId,
        branchId: selectedBranchId,
        washPackageId: selectedPackageId,
        bookingDate: selectedDate,
        startTime: apiStartTime,
        rewardRedemptionId: selectedVoucher?.id || undefined,
        promotionCode: appliedPromotion?.code || undefined,
      });

      setCreatedBooking(newBookingData as unknown as CreatedBookingData);
    } catch (err) {
      console.error("Booking failed:", err);
      toast.error(
        t("bookWash.toastBookingError", {
          defaultValue: "Đã xảy ra lỗi khi tạo lịch đặt, vui lòng thử lại.",
        }),
      );
    } finally {
      setIsCreating(false);
    }
  };

  // 6. Renders
  if (isLoadingVehicles || isLoadingPackages || isLoadingRedemptions) {
    return (
      <div className="p-10 text-center font-medium">
        {t("bookWash.loadingInfo", {
          defaultValue: "Đang tải thông tin đặt lịch...",
        })}
      </div>
    );
  }

  if (createdBooking) {
    return (
      <BookingSuccessScreen
        booking={createdBooking}
        vehicleInfo={currentVehicle}
        packageInfo={currentPackage}
        onContinue={() => navigate("/booking-history")}
      />
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start max-w-7xl mx-auto pb-12">
      {/* CỘT TRÁI */}
      <div className="flex-1 space-y-10 w-full">
        <TierPriorityWindow />

        <VehicleSelection
          vehicles={vehicles as unknown as VehicleItem[]}
          selectedVehicleId={selectedVehicleId}
          onSelectVehicle={setSelectedVehicleId}
          onAddNewVehicle={() => setIsModalOpen(true)}
        />

        <VehicleFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          formData={vehicleFormData}
          setFormData={setVehicleFormData}
          handleInputChange={handleInputChange}
          onSubmit={handleSubmit}
          isCreating={isCreating}
          currentVehicleNames={
            VEHICLE_NAMES_BY_BRAND[vehicleFormData.brand] || []
          }
        />

        <NearestBranches
          selectedBranchId={selectedBranchId}
          onSelectBranch={(branchId) => {
            setSelectedBranchId(branchId);
            setAppliedPromotion(null);
          }}
        />

        <WashPackageSelection
          washPackages={washPackages}
          selectedPackageId={selectedPackageId}
          onSelectPackage={setSelectedPackageId}
        />

        <VoucherSelection
          activeVouchers={redeemedVouchersOnly as any}
          selectedVoucherId={selectedVoucher?.id || ""}
          onSelectVoucher={setSelectedVoucher}
          totalPoints={customerMe?.availablePoint ?? 0}
          currentCycleWashes={(customerMe as any)?.currentCycleWashes ?? 0}
        />

        <DateTimeSelection
          dynamicDateSlots={dynamicDateSlots}
          weeklySummary={weeklySummary}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          selectedTime={selectedTime}
          onSelectTime={setSelectedTime}
          isLoadingSlots={isLoadingSlots}
        />
      </div>

      {/* CỘT PHẢI - Bảng tóm tắt hóa đơn */}
      <BookingSummary
        selectedPackageId={selectedPackageId}
        selectedTime={selectedTime}
        currentVehicle={currentVehicle}
        currentPackage={currentPackage}
        selectedDateSlot={selectedDateSlot}
        isBooking={isBooking || isCreating}
        onConfirmBooking={handleConfirmBooking}
        selectedVoucher={selectedVoucher}
        appliedPromotion={appliedPromotion}
        onApplyPromotion={async (code) => {
          const subtotal = currentPackage?.price || 0;

          if (!selectedBranchId) {
            return "Vui lòng chọn chi nhánh trước khi áp dụng mã giảm giá.";
          }

          try {
            const res = await validatePromotion({
              code,
              subtotal,
              branchId: selectedBranchId,
              serviceId: selectedPackageId,
            });

            // In ra console để xem chính xác dữ liệu có hình thù như thế nào
            console.log("🔥 Kết quả nhận được từ API Promotion:", res);

            const payload = res as any;

            // Kịch bản 1: API trả về đúng form { success: true, data: {...} }
            if (
              payload.success === true &&
              payload.data &&
              typeof payload.data.discountAmount !== "undefined"
            ) {
              setAppliedPromotion(payload.data);
              return true;
            }

            // Kịch bản 2: httpClient đã tự bóc tách vỏ, payload chính là data chứa discountAmount luôn
            if (typeof payload.discountAmount !== "undefined") {
              setAppliedPromotion(payload);
              return true;
            }

            // Kịch bản 3: Rớt vào catch của block try/catch (isValid = false)
            if (payload.isValid === false) {
              return payload.errorMessage || "Mã giảm giá không hợp lệ.";
            }

            // Fallback cuối cùng
            return (
              payload.message ||
              payload.errorMessage ||
              "Mã giảm giá không hợp lệ."
            );
          } catch (error) {
            console.error("Lỗi Exception khi apply mã:", error);
            return "Đã xảy ra lỗi hệ thống, vui lòng thử lại sau.";
          }
        }}
        onRemovePromotion={() => setAppliedPromotion(null)}
      />
    </div>
  );
};
