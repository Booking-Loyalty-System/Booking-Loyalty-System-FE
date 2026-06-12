import React, { useState } from "react";
import {
  CheckCircle2,
  MapPin,
  Package,
  Car,
  Clock,
  Award,
  Gift,
  Mail,
  ArrowRight,
  Loader2,
  X,
  CreditCard,
  Wallet,
  Smartphone,
  Zap,
} from "lucide-react";
import type { Branch } from "../../../../domain/models/branch/branch.model";
import type { WashPackage } from "../../../../domain/models/wash-package/wash-package.model";
import type { Vehicle } from "../../../../domain/models/vehicle/vehicle.model";
import type { PaymentMethod } from "./PaymentStep";
import { useLoyalty } from "@/features/products/application/useLoyalty";
import { useBooking } from "@/features/products/application/useBooking";
import { format } from "date-fns";
import { toast } from "sonner";

interface SummaryStepProps {
  branch: Branch;
  pkg: WashPackage;
  vehicle: Vehicle;
  date: string;
  slot: string;
  paymentMethod: PaymentMethod;
  pointsUsed: number;
  onSuccess: (bookingCode: string) => void;
  onEdit: (step: "branch" | "package" | "vehicle" | "slot" | "payment") => void;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({
  branch,
  pkg,
  vehicle,
  date,
  slot,
  paymentMethod,
  pointsUsed,
  onSuccess,
  onEdit,
}) => {
  const { useGetLoyaltyInfo } = useLoyalty();
  const { data: loyaltyInfo } = useGetLoyaltyInfo();
  const { createBooking, isCreating } = useBooking();
  const [voucherCode, setVoucherCode] = useState("");

  const discountFromPoints = pointsUsed * 0.1;
  const finalTotal = Math.max(0, pkg.price - discountFromPoints);

  // Tính toán số điểm sẽ nhận được
  const estimatedPoints = Math.round(
    finalTotal * (loyaltyInfo?.multiplier || 1.0),
  );

  const handleConfirm = async () => {
    try {
      const result = await createBooking({
        branchId: branch.id,
        washPackageId: pkg.id,
        vehicleId: vehicle.id,
        bookingDate: date,
        startTime: slot,
        voucherCode: voucherCode || undefined,
        usePoints: pointsUsed > 0 ? pointsUsed : undefined,
      });

      if (result && result.bookingCode) {
        toast.success("Booking confirmed! Check your email.");
        onSuccess(result.bookingCode);
      }
    } catch (error) {
      toast.error("Failed to create booking. Please try again.");
      console.error("Booking failed:", error);
    }
  };

  const getPaymentIcon = () => {
    switch (paymentMethod) {
      case "card":
        return <CreditCard className="w-5 h-5" />;
      case "qr":
        return <Smartphone className="w-5 h-5" />;
      case "cash":
        return <Wallet className="w-5 h-5" />;
    }
  };

  const getPaymentLabel = () => {
    switch (paymentMethod) {
      case "card":
        return "Credit Card";
      case "qr":
        return "QR Payment";
      case "cash":
        return "Pay at Counter";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Review & Confirm
        </h2>
        <p className="text-slate-500 font-medium">
          Please double check your appointment details
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Summary Cards */}
        <div className="space-y-4">
          {/* Location & Time */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-start gap-5 group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Location & Schedule
                </span>
                <button
                  onClick={() => onEdit("branch")}
                  className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest"
                >
                  Change
                </button>
              </div>
              <h4 className="font-black text-slate-900 text-lg mt-1">
                {branch.name}
              </h4>
              <p className="text-sm text-slate-500 font-medium">
                {branch.address}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-700 font-black text-sm">
                  <Clock className="w-4 h-4" />
                  <span>
                    {format(new Date(date), "EEEE, MMM dd")} @ {slot}
                  </span>
                </div>
                <button
                  onClick={() => onEdit("slot")}
                  className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest"
                >
                  Edit Time
                </button>
              </div>
            </div>
          </div>

          {/* Vehicle & Service */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                  <Car className="w-5 h-5" />
                </div>
                <button
                  onClick={() => onEdit("vehicle")}
                  className="text-[10px] font-black text-blue-600 uppercase tracking-widest"
                >
                  Edit
                </button>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                  Vehicle
                </span>
                <h4 className="font-black text-slate-900 mt-1">
                  {vehicle.vehicleName}
                </h4>
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-1 inline-block">
                  {vehicle.licensePlate}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                  <Package className="w-5 h-5" />
                </div>
                <button
                  onClick={() => onEdit("package")}
                  className="text-[10px] font-black text-blue-600 uppercase tracking-widest"
                >
                  Edit
                </button>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                  Service
                </span>
                <h4 className="font-black text-slate-900 mt-1">{pkg.name}</h4>
                <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded mt-1 inline-block">
                  ${pkg.price}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method chosen */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                {getPaymentIcon()}
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                  Payment Method
                </span>
                <h4 className="font-black text-slate-900 text-lg mt-0.5">
                  {getPaymentLabel()}
                </h4>
              </div>
            </div>
            <button
              onClick={() => onEdit("payment")}
              className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest"
            >
              Change
            </button>
          </div>
        </div>

        {/* Right: Loyalty & Payment Calculation */}
        <div className="space-y-6">
          {/* Loyalty Points Preview */}
          <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden group shadow-2xl shadow-slate-200">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                <Award className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="font-black tracking-tight text-lg">
                Rewards Summary
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  You will earn
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">
                    +{estimatedPoints}
                  </span>
                  <span className="text-[10px] font-black text-blue-400 uppercase">
                    pts
                  </span>
                </div>
              </div>
              {pointsUsed > 0 && (
                <div className="space-y-1">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    Points used
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-rose-400">
                      -{pointsUsed}
                    </span>
                    <span className="text-[10px] font-black text-rose-400 uppercase">
                      pts
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Voucher Input */}
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-2">
              <Gift className="w-4 h-4 text-pink-500" />
              Promo Code
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter code..."
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-100 focus:bg-white outline-none transition-all"
              />
              <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-colors shadow-lg shadow-slate-100">
                Apply
              </button>
            </div>
          </div>

          {/* Final Price Breakdown */}
          <div className="bg-white border-2 border-slate-50 rounded-[40px] p-8 space-y-4 shadow-sm">
            <div className="flex justify-between text-sm font-bold text-slate-500">
              <span>Service Base Price</span>
              <span className="text-slate-900">${pkg.price.toFixed(2)}</span>
            </div>
            {pointsUsed > 0 && (
              <div className="flex justify-between text-sm font-bold text-emerald-600">
                <span>Points Discount</span>
                <span>-${discountFromPoints.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-6 border-t border-slate-100 flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                  Final Amount
                </p>
                <p className="text-4xl font-black text-blue-600 tracking-tighter">
                  ${finalTotal.toFixed(2)}
                </p>
              </div>
              <button
                onClick={handleConfirm}
                disabled={isCreating}
                className="bg-blue-600 text-white px-10 py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 flex items-center gap-3 disabled:opacity-50 group active:scale-95"
              >
                {isCreating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Confirm
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUCCESS MODAL COMPONENT (Upgraded) ---
interface SuccessModalProps {
  bookingCode: string;
  onClose: () => void;
}

export const BookingSuccessModal: React.FC<SuccessModalProps> = ({
  bookingCode,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500">
      <div className="bg-white rounded-[48px] max-w-lg w-full p-12 text-center relative shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-500">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-2xl transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
          Booking Confirmed!
        </h2>
        <p className="text-slate-500 font-bold mb-10 px-4">
          Your car wash is scheduled. We've sent the details and a QR code to
          your email.
        </p>

        <div className="bg-blue-600 rounded-[32px] p-8 mb-10 shadow-2xl shadow-blue-500/30 group">
          <span className="text-[10px] font-black text-blue-100 uppercase tracking-[0.3em] mb-2 block opacity-80">
            Appointment ID
          </span>
          <span className="text-4xl font-black text-white tracking-widest uppercase">
            {bookingCode}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3 text-left">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-600 shadow-sm shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <p className="text-[10px] font-black text-slate-500 leading-tight uppercase tracking-wider">
              Check your Inbox for QR
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3 text-left">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <p className="text-[10px] font-black text-slate-500 leading-tight uppercase tracking-wider">
              Points Added to Account
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-slate-900 text-white py-6 rounded-[24px] font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-slate-900/10 active:scale-[0.98]"
        >
          View My Bookings
        </button>
      </div>
    </div>
  );
};
