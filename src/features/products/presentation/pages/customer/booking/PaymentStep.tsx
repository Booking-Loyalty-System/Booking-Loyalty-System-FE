import React, { useState } from "react";
import {
  CreditCard,
  Smartphone,
  Wallet,
  CheckCircle2,
  Info,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useLoyalty } from "@/features/products/application/useLoyalty";

export type PaymentMethod = "card" | "qr" | "cash";

interface PaymentStepProps {
  totalAmount: number;
  selectedMethod: PaymentMethod;
  onSelect: (method: PaymentMethod, pointsUsed: number) => void;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  totalAmount,
  selectedMethod,
  onSelect,
}) => {
  const { useGetLoyaltyInfo } = useLoyalty();
  const { data: loyaltyInfo } = useGetLoyaltyInfo();
  const [usePoints, setUsePoints] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);

  const availablePoints = loyaltyInfo?.totalPoints || 0;
  const pointValue = pointsToUse * 0.1; // Giả sử 1 điểm = 0.1 USD
  const finalTotal = Math.max(0, totalAmount - pointValue);

  const handleMethodSelect = (method: PaymentMethod) => {
    onSelect(method, pointsToUse);
  };

  const togglePoints = (checked: boolean) => {
    setUsePoints(checked);
    if (!checked) {
      setPointsToUse(0);
      onSelect(selectedMethod, 0);
    }
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(
      Number(e.target.value),
      availablePoints,
      totalAmount * 10,
    );
    setPointsToUse(val);
    onSelect(selectedMethod, val);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Choose Payment Method
        </h2>
        <p className="text-slate-500 font-medium">
          Select how you'd like to pay for your service
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            id: "card",
            label: "Credit Card",
            icon: CreditCard,
            desc: "Visa, Mastercard",
            color: "blue",
          },
          {
            id: "qr",
            label: "QR Pay",
            icon: Smartphone,
            desc: "Scan to pay",
            color: "purple",
          },
          {
            id: "cash",
            label: "Pay at Counter",
            icon: Wallet,
            desc: "Cash or POS",
            color: "emerald",
          },
        ].map((method) => {
          const Icon = method.icon;
          const isActive = selectedMethod === method.id;
          return (
            <button
              key={method.id}
              onClick={() => handleMethodSelect(method.id as PaymentMethod)}
              className={`relative p-8 rounded-[32px] border-2 flex flex-col items-center text-center gap-4 transition-all duration-300 group ${
                isActive
                  ? "border-blue-600 bg-blue-50/50 shadow-xl shadow-blue-500/10"
                  : "border-slate-100 bg-white hover:border-blue-200 hover:shadow-lg"
              }`}
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600"
                }`}
              >
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <h4
                  className={`font-black tracking-tight ${isActive ? "text-blue-600" : "text-slate-900"}`}
                >
                  {method.label}
                </h4>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                  {method.desc}
                </p>
              </div>
              {isActive && (
                <div className="absolute top-4 right-4 text-blue-600">
                  <CheckCircle2 className="w-6 h-6 fill-blue-600 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Loyalty Points Section */}
      <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full -mr-32 -mt-32 blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-[24px] flex items-center justify-center border border-white/10 group-hover:rotate-12 transition-transform">
              <Zap className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">
                Use Loyalty Points
              </h3>
              <p className="text-slate-400 text-sm font-medium mt-1">
                You have{" "}
                <span className="text-white font-black">
                  {availablePoints} points
                </span>{" "}
                available.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {usePoints && (
              <div className="flex flex-col items-end">
                <input
                  type="number"
                  value={pointsToUse}
                  onChange={handlePointsChange}
                  className="w-24 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-center font-black outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-1">
                  -${pointValue.toFixed(2)} Off
                </span>
              </div>
            )}
            <button
              onClick={() => togglePoints(!usePoints)}
              className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                usePoints
                  ? "bg-rose-500 text-white"
                  : "bg-white text-slate-900 hover:bg-blue-50"
              }`}
            >
              {usePoints ? "Cancel" : "Apply Points"}
            </button>
          </div>
        </div>
      </div>

      {/* Price Summary Panel */}
      <div className="bg-white border-2 border-slate-100 rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-900 tracking-tight">
              Secure Payment
            </h4>
            <p className="text-sm text-slate-500 font-medium">
              Your transaction is encrypted and safe.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="text-right">
            <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em]">
              Total to Pay
            </p>
            <p className="text-4xl font-black text-blue-600 tracking-tighter">
              ${finalTotal.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 justify-center text-slate-400">
        <Info className="w-4 h-4" />
        <p className="text-xs font-bold uppercase tracking-widest">
          Pricing includes all applicable taxes and fees
        </p>
      </div>
    </div>
  );
};
