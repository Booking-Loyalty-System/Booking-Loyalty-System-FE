import React, { useState, useEffect, useMemo } from "react";
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
import { VehicleFormModal } from "@/features/products/presentation/components/customer/VehicleFormModal";
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
import { TierPriorityWindow } from "@/features/products/presentation/components/customer/TierPriorityWindow";
import { VehicleSelection } from "@/features/products/presentation/components/customer/VehicleSelection";
import { NearestBranches } from "../../components/NearestBranches";
import { WashPackageSelection } from "@/features/products/presentation/components/customer/WashPackageSelection";
import { DateTimeSelection } from "@/features/products/presentation/components/customer/DateTimeSelection";
import { BookingSummary } from "@/features/products/presentation/components/customer/BookingSummary";

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
import { VoucherSelection } from "@/features/products/presentation/pages/customer/VoucherSelection";
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
    <div className="max-w-2xl mx-auto my-8 bg-white dark:bg-gradient-to-br dark:from-[#13151A] dark:to-[#1a1525] border border-slate-100 dark:border-white/5 rounded-3xl shadow-xl overflow-hidden p-8 text-center font-sans antialiased animate-fade-in">
      <div className="flex flex-col items-center justify-center space-y-3 mb-6">
        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-full text-emerald-500 dark:text-emerald-400">
          <CheckCircle2 className="w-16 h-16" />
        </div>
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:text-white tracking-tight">
          {t("bookWash.successTitle", { defaultValue: "Đặt Lịch Thành Công!" })}
        </h1>
        <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
          {t("bookWash.successSubtitle", {
            defaultValue:
              "Vui lòng kiểm tra lại thông tin biên nhận cuối cùng của bạn dưới đây.",
          })}
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl p-6 mb-8 flex flex-col items-center justify-center">
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
          {t("bookWash.bookingCodeLabel", {
            defaultValue: "Mã Đặt Lịch (Booking Code)",
          })}
        </span>
        <span className="text-3xl font-mono font-black text-blue-600 dark:text-blue-400 tracking-wider mb-6 block">
          {qrValue}
        </span>
        <div className="p-4 bg-white dark:bg-white rounded-xl border border-slate-200 dark:border-white/10 shadow-sm inline-block">
          <QRCodeSVG
            value={qrValue}
            size={160}
            level="H"
            includeMargin={false}
          />
        </div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-4 text-center">
          {t("bookWash.qrInstruction", {
            defaultValue:
              "Đưa mã này cho nhân viên quét khi bạn đến cửa hàng nhé!",
          })}
        </p>
      </div>

      <div className="text-left space-y-4 border-b border-dashed border-slate-200 dark:border-white/10 pb-6 mb-6 px-4">
        <div className="flex items-start gap-3">
          <Car className="w-5 h-5 text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {t("bookWash.vehicleInfoLabel", { defaultValue: "Thông Tin Xe" })}
            </p>
            <p className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">
              {booking.vehiclePlate || vehicleInfo?.licensePlate}
              <span className="text-slate-400 dark:text-slate-500 font-medium ml-2">
                ({booking.vehicleName || vehicleInfo?.vehicleName})
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <CreditCard className="w-5 h-5 text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {t("bookWash.serviceSelectedLabel", {
                defaultValue: "Gói Dịch Vụ Đã Chọn",
              })}
            </p>
            <p className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">
              {booking.washPackageName || packageInfo?.name}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {t("bookWash.appointmentDateLabel", { defaultValue: "Ngày Hẹn" })}
            </p>
            <p className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">
              {booking.bookingDate}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {t("bookWash.timeSlotLabel", { defaultValue: "Khung Giờ" })}
            </p>
            <p className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">
              {booking.startTime}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-2 px-4 mb-8">
        <span className="text-base font-bold text-slate-500 dark:text-slate-400">
          {t("bookWash.totalCostLabel", {
            defaultValue: "Tổng chi phí thanh toán:",
          })}
        </span>
        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:text-white">
          {formatCurrency(booking.totalPrice)}
        </span>
      </div>

      <button
        onClick={onContinue}
        className="w-full bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
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
  const { validatePromotion, getEligiblePromotions } = usePromotion();

  // 🌟 LẤY LỊCH SỬ ĐỔI THƯỞNG VÀ DANH SÁCH VOUCHER ĐÃ MAP SẴN
  const { isLoadingRedemptions, redemptions, myVouchers, isLoadingVouchers } =
    useReward();

  const totalWashes = customerMe?.totalWashes ?? 0;
  const earnedFreeWashes = Math.floor(totalWashes / 7);
  const redeemedFreeWashes = Array.isArray(redemptions)
    ? redemptions.filter(
        (r) =>
          r &&
          (r.rewardName === "Phần thưởng Rửa Xe Miễn Phí" ||
            r.rewardName === "Free Car Wash Reward" ||
            r.rewardName.includes("Miễn Phí") ||
            r.rewardName.includes("Free Wash")),
      ).length
    : 0;
  const availableFreeWashes = Math.max(
    0,
    earnedFreeWashes - redeemedFreeWashes,
  );

  const bookingWindow = customerMe?.bookingWindow || 7;
  const dynamicDateSlots = useMemo(() => {
    return generateUpcomingDates(bookingWindow);
  }, [bookingWindow]);
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
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [appliedPromotion, setAppliedPromotion] = useState<Promotion | null>(
    null,
  );
  const [eligiblePromotions, setEligiblePromotions] = useState<Promotion[]>([]);
  const [isLoadingEligible, setIsLoadingEligible] = useState(false);
  const [hasAppliedAutoPromo, setHasAppliedAutoPromo] = useState(false);

  // 4. Derived states (Được đưa lên trên để tránh lỗi Block-scoped variable hoisting)
  const selectedDateSlot = dynamicDateSlots.find(
    (d) => d.apiDate === selectedDate,
  );
  const currentVehicle = vehicles.find(
    (v: Vehicle) => v.id === selectedVehicleId,
  );
  const currentPackage = washPackages.find(
    (p: WashPackage) => p.id === selectedPackageId,
  );

  // Lấy chunk startDate dựa trên ngày đang chọn (mỗi chunk 7 ngày)
  const selectedDateIndex = useMemo(() => {
    return dynamicDateSlots.findIndex((d) => d.apiDate === selectedDate);
  }, [dynamicDateSlots, selectedDate]);

  const chunkStartDate = useMemo(() => {
    if (selectedDateIndex === -1 || dynamicDateSlots.length === 0)
      return dynamicDateSlots[0]?.apiDate;
    const chunkIndex = Math.floor(selectedDateIndex / 7) * 7;
    return dynamicDateSlots[chunkIndex]?.apiDate;
  }, [dynamicDateSlots, selectedDateIndex]);

  const { weeklySummary, isLoading: isLoadingSlots } = useTimeSlot({
    branchId: selectedBranchId,
    startDate: chunkStartDate,
  });

  // Fetch eligible promotions when selectedBranchId changes
  useEffect(() => {
    if (!selectedBranchId) {
      setEligiblePromotions([]);
      setAppliedPromotion(null);
      setHasAppliedAutoPromo(false);
      return;
    }

    const fetchEligible = async () => {
      setIsLoadingEligible(true);
      try {
        const data = await getEligiblePromotions(selectedBranchId);
        setEligiblePromotions(data);
      } catch (err) {
        console.error("Failed to fetch eligible promotions:", err);
      } finally {
        setIsLoadingEligible(false);
      }
    };

    fetchEligible();
  }, [selectedBranchId, getEligiblePromotions]);

  // Reset auto-apply tracker when branch or package changes
  useEffect(() => {
    setHasAppliedAutoPromo(false);
  }, [selectedBranchId, selectedPackageId]);

  // Auto-apply best promotion — bỏ qua nếu voucher hiện tại là Free Wash
  useEffect(() => {
    // Nếu voucher đang chọn là Free Wash → không áp dụng promotion
    const isActiveFreeWash = !!(
      selectedVoucher && (selectedVoucher as any).isFreeWash === true
    );
    if (isActiveFreeWash) {
      setAppliedPromotion(null);
      setHasAppliedAutoPromo(true);
      return;
    }

    if (
      hasAppliedAutoPromo ||
      isLoadingEligible ||
      !selectedBranchId ||
      !selectedPackageId ||
      eligiblePromotions.length === 0
    ) {
      return;
    }

    const packagePrice = currentPackage?.price || 0;
    if (packagePrice <= 0) return;

    const validPromos = eligiblePromotions
      .map((promo) => {
        if (
          promo.minSpend !== null &&
          promo.minSpend !== undefined &&
          packagePrice < promo.minSpend
        ) {
          return null;
        }

        let calculatedDiscount = 0;
        if (promo.discountType === "Percentage") {
          calculatedDiscount = Math.floor(
            packagePrice * (promo.discountValue / 100),
          );
        } else if (promo.discountType === "FixedAmount") {
          calculatedDiscount = Math.min(packagePrice, promo.discountValue);
        }

        return {
          promo,
          discount: calculatedDiscount,
        };
      })
      .filter(
        (item): item is { promo: Promotion; discount: number } => item !== null,
      );

    if (validPromos.length > 0) {
      validPromos.sort((a, b) => {
        if (b.discount !== a.discount) {
          return b.discount - a.discount;
        }
        const aPriority = (a.promo as any).priorityLevel || 0;
        const bPriority = (b.promo as any).priorityLevel || 0;
        if (bPriority !== aPriority) {
          return bPriority - aPriority;
        }
        return b.promo.discountValue - a.promo.discountValue;
      });

      const bestPromo = validPromos[0].promo;
      setAppliedPromotion(bestPromo);
      setHasAppliedAutoPromo(true);
      toast.success(
        t("bookWash.toastAutoPromoApplied", {
          defaultValue: `Đã tự động áp dụng ưu đãi tốt nhất: ${
            bestPromo.name || bestPromo.code
          }`,
        }),
      );
    } else {
      setAppliedPromotion(null);
      setHasAppliedAutoPromo(true);
    }
  }, [
    hasAppliedAutoPromo,
    isLoadingEligible,
    selectedBranchId,
    selectedPackageId,
    eligiblePromotions,
    currentPackage,
    selectedVoucher,
    t,
  ]);

  // Reset selected voucher if the selected wash package becomes incompatible
  useEffect(() => {
    if (
      selectedVoucher &&
      selectedVoucher.washPackageId &&
      selectedVoucher.washPackageId !== selectedPackageId
    ) {
      setSelectedVoucher(null);
      toast.warning(
        "Voucher đã bị gỡ bỏ do không tương thích với gói dịch vụ mới chọn.",
      );
    }
  }, [selectedPackageId, selectedVoucher]);

  // 5. Handlers
  const validateNewVehicle = () => {
    const normalizedPlate = vehicleFormData.licensePlate.trim().toUpperCase();

    if (!normalizedPlate) {
      toast.error(
        t("bookWash.vehicle.licensePlateRequired", {
          defaultValue: "Biển số xe không được để trống.",
        }),
      );
      return null;
    }

    if (normalizedPlate.length > 20) {
      toast.error(
        t("bookWash.vehicle.licensePlateTooLong", {
          defaultValue: "Biển số xe không được vượt quá 20 ký tự.",
        }),
      );
      return null;
    }

    if (!["Small", "Medium", "Large"].includes(vehicleFormData.type)) {
      toast.error(
        t("bookWash.vehicle.invalidType", {
          defaultValue: "Loại xe phải là Small, Medium hoặc Large.",
        }),
      );
      return null;
    }

    if (vehicles.length >= 5) {
      toast.error(
        t("bookWash.vehicle.maxVehicles", {
          defaultValue: "Mỗi khách hàng chỉ được lưu tối đa 5 xe.",
        }),
      );
      return null;
    }

    const duplicatedPlate = vehicles.some(
      (vehicle: Vehicle) =>
        vehicle.licensePlate?.trim().toUpperCase() === normalizedPlate,
    );

    if (duplicatedPlate) {
      toast.error(
        t("bookWash.vehicle.duplicatePlate", {
          defaultValue: "Biển số xe này đã tồn tại.",
        }),
      );
      return null;
    }

    return normalizedPlate;
  };

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

    const normalizedPlate = validateNewVehicle();
    if (!normalizedPlate) return;

    setIsCreating(true);
    try {
      await createVehicle({
        ...vehicleFormData,
        licensePlate: normalizedPlate,
        brand: vehicleFormData.brand.trim(),
        vehicleName: vehicleFormData.vehicleName.trim(),
        model: vehicleFormData.model.trim(),
        color: vehicleFormData.color.trim(),
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

  // Lấy message lỗi từ API và nhận diện trường hợp cùng một xe đã đặt cùng ngày/khung giờ.
  // Backend vẫn phải là nơi validate chính để tránh 2 request đồng thời tạo booking trùng nhau.
  const getBookingErrorMessage = (error: unknown): string => {
    if (!error || typeof error !== "object") {
      return t("bookWash.toastBookingError", {
        defaultValue: "Đã xảy ra lỗi khi tạo lịch đặt, vui lòng thử lại.",
      });
    }

    const apiError = error as {
      message?: string;
      response?: {
        status?: number;
        data?:
          | string
          | {
              message?: string;
              error?: string;
              title?: string;
            };
      };
    };

    const responseData = apiError.response?.data;

    const serverMessage =
      typeof responseData === "string"
        ? responseData
        : responseData?.message ||
          responseData?.error ||
          responseData?.title ||
          apiError.message ||
          "";

    const normalizedMessage = serverMessage.toLowerCase();
    const status = apiError.response?.status;

    const mentionsVehicle =
      normalizedMessage.includes("vehicle") ||
      normalizedMessage.includes("car") ||
      normalizedMessage.includes("xe");

    const mentionsTime =
      normalizedMessage.includes("slot") ||
      normalizedMessage.includes("time") ||
      normalizedMessage.includes("khung giờ") ||
      normalizedMessage.includes("giờ");

    const mentionsDuplicate =
      normalizedMessage.includes("already") ||
      normalizedMessage.includes("duplicate") ||
      normalizedMessage.includes("conflict") ||
      normalizedMessage.includes("exist") ||
      normalizedMessage.includes("đã đặt") ||
      normalizedMessage.includes("trùng");

    if (
      (status === 409 && mentionsVehicle && mentionsTime) ||
      (mentionsVehicle && mentionsTime && mentionsDuplicate)
    ) {
      return t("bookWash.toastVehicleSlotConflict", {
        defaultValue:
          "Xe này đã có lịch đặt trong cùng ngày và khung giờ. Vui lòng chọn khung giờ khác.",
      });
    }

    return (
      serverMessage ||
      t("bookWash.toastBookingError", {
        defaultValue: "Đã xảy ra lỗi khi tạo lịch đặt, vui lòng thử lại.",
      })
    );
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
    if (!selectedDate)
      return toast.error(
        t("bookWash.toastNoDate", {
          defaultValue: "Vui lòng chọn ngày đặt lịch!",
        }),
      );
    if (!selectedTime)
      return toast.error(
        t("bookWash.toastNoTime", { defaultValue: "Vui lòng chọn khung giờ!" }),
      );

    if (!currentVehicle) {
      return toast.error(
        t("bookWash.toastInvalidVehicle", {
          defaultValue: "Xe đã chọn không còn hợp lệ. Vui lòng chọn lại.",
        }),
      );
    }

    if (!currentPackage) {
      return toast.error(
        t("bookWash.toastInvalidPackage", {
          defaultValue: "Gói rửa đã chọn không còn hợp lệ. Vui lòng chọn lại.",
        }),
      );
    }

    if (!selectedDateSlot) {
      return toast.error(
        t("bookWash.toastInvalidDate", {
          defaultValue:
            "Ngày đã chọn không hợp lệ hoặc vượt quá thời gian đặt trước của hạng thành viên.",
        }),
      );
    }

    const today = new Date();
    const bookingDay = new Date(`${selectedDate}T00:00:00`);
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    if (Number.isNaN(bookingDay.getTime()) || bookingDay < startOfToday) {
      return toast.error(
        t("bookWash.toastPastDate", {
          defaultValue: "Ngày đặt lịch không được nằm trong quá khứ.",
        }),
      );
    }

    const apiStartTime = convertTo24HourFormat(selectedTime);
    const startTimeWithSeconds =
      apiStartTime.split(":").length === 2
        ? `${apiStartTime}:00`
        : apiStartTime;
    const bookingStart = new Date(`${selectedDate}T${startTimeWithSeconds}`);

    if (
      !Number.isNaN(bookingStart.getTime()) &&
      bookingStart.getTime() <= Date.now()
    ) {
      return toast.error(
        t("bookWash.toastPastTime", {
          defaultValue: "Giờ đặt lịch phải ở tương lai.",
        }),
      );
    }

    setIsCreating(true);
    try {
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
      toast.error(getBookingErrorMessage(err));
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    if (dynamicDateSlots.length > 0 && !selectedDate) {
      setSelectedDate(dynamicDateSlots[0].apiDate);
    }
  }, [dynamicDateSlots, selectedDate]);

  // 6. Renders
  if (
    isLoadingVehicles ||
    isLoadingPackages ||
    isLoadingRedemptions ||
    isLoadingVouchers
  ) {
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
          activeVouchers={myVouchers as any}
          selectedVoucherId={selectedVoucher?.id || ""}
          onSelectVoucher={(voucher) => {
            // Bỏ chọn voucher → reset tracker để promotion tự động apply lại
            if (!voucher) {
              setSelectedVoucher(null);
              setHasAppliedAutoPromo(false);
              return;
            }
            if (!selectedPackageId) {
              toast.error(
                t("bookWash.toastNoPackage", {
                  defaultValue: "Vui lòng chọn gói rửa xe trước!",
                }),
              );
              return;
            }
            if (
              (voucher as any).washPackageId &&
              (voucher as any).washPackageId !== selectedPackageId
            ) {
              toast.error("Voucher này không thể dùng cho gói đó!");
              return;
            }
            // Nếu là voucher Free Wash → clear promotion ngay lập tức
            if ((voucher as any).isFreeWash === true) {
              setAppliedPromotion(null);
              setHasAppliedAutoPromo(true);
            }
            setSelectedVoucher(voucher);
          }}
          totalPoints={customerMe?.availablePoint ?? 0}
          availableFreeWashes={availableFreeWashes}
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
