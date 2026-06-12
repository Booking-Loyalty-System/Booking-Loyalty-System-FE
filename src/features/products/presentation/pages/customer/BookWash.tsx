import React, { useState } from "react";
import {
  Car,
  Plus,
  Info,
  Droplet,
  Sparkles,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import { useVehicle } from "@/features/products/application/useVehicle";
import { useWashPackage } from "@/features/products/application/useWashPackage"; // 🌟 Import hook mới tạo

interface DateSlot {
  dayName: string; // Ví dụ: "Mon"
  dayNum: string; // Ví dụ: "01"
  fullDate: string; // Ví dụ: "Mon Jun 01"
}

interface TimeSlot {
  time: string;
  availableSlots: number;
  totalSlots: number;
  status: "available" | "full" | "limited";
}

// 🛠️ HÀM HELPER: Tự động sinh ra danh sách 7 ngày từ ngày hiện tại trở đi
const generateUpcomingDates = (daysCount: number = 7): DateSlot[] => {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dates: DateSlot[] = [];

  for (let i = 0; i < daysCount; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);

    const dayName = weekdays[d.getDay()];
    const dayNum = String(d.getDate()).padStart(2, "0");
    const monthName = months[d.getMonth()];

    dates.push({
      dayName,
      dayNum,
      fullDate: `${dayName} ${monthName} ${dayNum}`,
    });
  }
  return dates;
};

// 🛠️ HÀM HELPER: Gắn Icon và màu sắc giao diện động dựa theo tên/loại gói từ API trả về
const getPackageUIVisual = (packageName: string | null) => {
  const name = packageName?.toLowerCase() || "";
  if (
    name.includes("premium") ||
    name.includes("vip") ||
    name.includes("cao cấp")
  ) {
    return {
      icon: <Sparkles className="w-5 h-5 text-purple-500" />,
      colorClass: "bg-purple-50",
    };
  }
  if (
    name.includes("ceramic") ||
    name.includes("nano") ||
    name.includes("ultimate")
  ) {
    return {
      icon: <ShieldAlert className="w-5 h-5 text-orange-500" />,
      colorClass: "bg-orange-50",
    };
  }
  // Mặc định cho gói Basic / Gói thường
  return {
    icon: <Droplet className="w-5 h-5 text-blue-500" />,
    colorClass: "bg-blue-50",
  };
};

export const BookWash: React.FC = () => {
  const dynamicDateSlots = generateUpcomingDates(7);

  // 1. State quản lý việc lựa chọn của Khách hàng
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [selectedPackageId, setSelectedPackageId] = useState<string>(""); // Đổi từ ServiceId sang PackageId
  const [selectedDate, setSelectedDate] = useState<string>(
    dynamicDateSlots[0].fullDate,
  );
  const [selectedTime, setSelectedTime] = useState<string>("");

  // 2. Lấy dữ liệu thật từ API qua các Custom Hooks
  const { vehicles, isLoading: isLoadingVehicles } = useVehicle();
  const { washPackages, isLoading: isLoadingPackages } = useWashPackage(); // 🌟 Lấy danh sách gói rửa xe thật

  // 3. Dữ liệu giả lập Danh sách khung giờ
  const timeSlots: TimeSlot[] = [
    { time: "08:00 AM", availableSlots: 2, totalSlots: 4, status: "available" },
    { time: "09:00 AM", availableSlots: 0, totalSlots: 4, status: "full" },
    { time: "10:00 AM", availableSlots: 1, totalSlots: 4, status: "limited" },
    { time: "11:00 AM", availableSlots: 3, totalSlots: 4, status: "available" },
    { time: "12:00 PM", availableSlots: 0, totalSlots: 4, status: "full" },
    { time: "01:00 PM", availableSlots: 2, totalSlots: 4, status: "available" },
    { time: "02:00 PM", availableSlots: 4, totalSlots: 4, status: "available" },
    { time: "03:00 PM", availableSlots: 1, totalSlots: 4, status: "limited" },
    { time: "04:00 PM", availableSlots: 0, totalSlots: 4, status: "full" },
    { time: "05:00 PM", availableSlots: 3, totalSlots: 4, status: "available" },
    { time: "06:00 PM", availableSlots: 4, totalSlots: 4, status: "available" },
  ];

  const handleAddNewVehicle = () => {
    alert("Redirecting to Add New Vehicle interface...");
  };

  // Tìm thông tin đối tượng đã chọn để hiển thị ở cột Summary bên phải
  const currentVehicle = vehicles.find((v) => v.id === selectedVehicleId);
  const currentPackage = washPackages.find((p) => p.id === selectedPackageId); // Tìm gói thật tương ứng

  // Loading State tổng hợp
  if (isLoadingVehicles || isLoadingPackages) {
    return (
      <div className="p-10 text-center font-medium">
        Loading billing details and data...
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start max-w-7xl mx-auto pb-12">
      {/* CỘT TRÁI (70%) */}
      <div className="flex-1 space-y-10 w-full">
        {/* SECTION TIER WINDOW */}
        <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-2xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#1e6ffd] mt-0.5 shrink-0" />
            <div>
              <h4 className="text-base font-bold text-[#1e3a8a]">
                Tier-Based Priority Booking Window
              </h4>
              <p className="text-sm text-[#1e40af] mt-0.5">
                As a <span className="font-bold text-[#1e6ffd]">Gold</span>{" "}
                member, you can book up to{" "}
                <span className="font-bold text-[#1e40af]">12 days</span> in
                advance.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 text-center">
              <span className="block text-xs text-[#94a3b8] font-medium">
                Member
              </span>
              <span className="text-sm font-bold text-[#0f172a]">7 days</span>
            </div>
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 text-center">
              <span className="block text-xs text-[#94a3b8] font-medium">
                Silver
              </span>
              <span className="text-sm font-bold text-[#0f172a]">10 days</span>
            </div>
            <div className="bg-[#fef3c7] border-2 border-[#f59e0b] rounded-xl p-4 text-center shadow-sm">
              <span className="block text-xs text-[#b45309] font-semibold">
                Gold
              </span>
              <span className="text-sm font-bold text-[#b45309]">12 days</span>
            </div>
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 text-center">
              <span className="block text-xs text-[#94a3b8] font-medium">
                Platinum
              </span>
              <span className="text-sm font-bold text-[#a855f7]">14 days</span>
            </div>
          </div>
        </div>

        {/* SECTION 1: SELECT VEHICLE */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[#0f172a]">Select Vehicle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => {
              const isSelected = selectedVehicleId === vehicle.id;
              return (
                <div
                  key={vehicle.id}
                  onClick={() => setSelectedVehicleId(vehicle.id)}
                  className={`cursor-pointer bg-white border rounded-2xl p-5 transition-all duration-200 flex flex-col gap-4 relative group ${
                    isSelected
                      ? "border-[#1e6ffd] ring-2 ring-blue-50 shadow-sm"
                      : "border-[#e2e8f0] hover:border-[#cbd5e1]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isSelected ? "bg-blue-50 text-[#1e6ffd]" : "bg-slate-50 text-slate-400 group-hover:text-slate-600"}`}
                    >
                      <Car className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0f172a]">
                        {vehicle.vehicleName}
                      </h4>
                      <p className="text-xs text-[#64748b] font-medium">
                        {vehicle.type}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 text-sm pt-3 border-t border-[#f1f5f9]">
                    <div>
                      <span className="block text-xs text-[#94a3b8] font-medium">
                        Color
                      </span>
                      <span className="font-semibold text-[#1e293b]">
                        {vehicle.color}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-[#94a3b8] font-medium">
                        Plate
                      </span>
                      <span
                        className={`font-bold ${isSelected ? "text-[#1e6ffd]" : "text-blue-600"}`}
                      >
                        {vehicle.licensePlate}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div
              onClick={handleAddNewVehicle}
              className="cursor-pointer border-2 border-dashed border-[#cbd5e1] hover:border-[#1e6ffd] bg-white hover:bg-blue-50/10 rounded-2xl p-5 transition-all duration-200 flex flex-col items-center justify-center min-h-[142px] group"
            >
              <div className="w-10 h-10 bg-slate-50 group-hover:bg-blue-50 rounded-full flex items-center justify-center text-slate-400 group-hover:text-[#1e6ffd] mb-2">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-500 group-hover:text-[#1e6ffd]">
                Add New Vehicle
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 2: SELECT WASH PACKAGE (🌟 ĐÃ ĐỔI SANG DỮ LIỆU THẬT) */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[#0f172a]">
            Select Wash Package
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {washPackages.map((pkg) => {
              const isSelected = selectedPackageId === pkg.id;
              const visual = getPackageUIVisual(pkg.name); // Lấy màu sắc và icon phù hợp tên gói

              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className={`cursor-pointer bg-white border rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between gap-6 relative ${
                    isSelected
                      ? "border-[#1e6ffd] ring-2 ring-blue-50 shadow-sm"
                      : "border-[#e2e8f0] hover:border-[#cbd5e1]"
                  }`}
                >
                  <div className="space-y-4">
                    <div
                      className={`w-10 h-10 ${visual.colorClass} rounded-xl flex items-center justify-center`}
                    >
                      {visual.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0f172a] text-lg">
                        {pkg.name}
                      </h4>
                      <p className="text-xs text-[#64748b] mt-1 font-medium line-clamp-2">
                        {pkg.description}
                      </p>
                    </div>
                    <div className="flex items-baseline gap-3 pt-2">
                      <span className="text-3xl font-extrabold text-[#0f172a]">
                        ${pkg.price}
                      </span>
                      <span className="text-xs text-[#64748b] font-semibold">
                        ⏱ {pkg.durationMinutes} min
                      </span>
                    </div>

                    {/* Render mảng tính năng (features) từ API nếu có */}
                    {pkg.features && pkg.features.length > 0 && (
                      <ul className="space-y-2 pt-2 border-t border-[#f1f5f9]">
                        {pkg.features.map((feature, i) => (
                          <li
                            key={i}
                            className="text-xs font-medium text-[#475569] flex items-center gap-2"
                          >
                            <span className="text-emerald-500 font-bold">
                              ✓
                            </span>{" "}
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                    {pkg.vehicleType && (
                      <div className="text-[11px] font-semibold text-blue-600 bg-blue-50/60 inline-block px-2 py-0.5 rounded">
                        🚗 For: {pkg.vehicleType}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BỘ CHỌN NGÀY VÀ KHUNG GIỜ */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#0f172a]">Select Date</h3>
              <div className="flex gap-2">
                <button className="p-1.5 rounded-lg border border-[#e2e8f0] bg-white text-slate-600 hover:bg-slate-50 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-lg border border-[#e2e8f0] bg-white text-slate-600 hover:bg-slate-50 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
              {dynamicDateSlots.map((slot) => {
                const isDateSelected = selectedDate === slot.fullDate;
                return (
                  <div
                    key={slot.fullDate}
                    onClick={() => {
                      setSelectedDate(slot.fullDate);
                      setSelectedTime("");
                    }}
                    className={`cursor-pointer border rounded-2xl p-4 text-center transition-all duration-200 ${
                      isDateSelected
                        ? "border-[#1e6ffd] bg-white ring-2 ring-blue-100 font-bold"
                        : "border-[#e2e8f0] bg-white hover:border-[#cbd5e1]"
                    }`}
                  >
                    <span
                      className={`block text-xs font-semibold uppercase tracking-wider ${isDateSelected ? "text-[#1e6ffd]" : "text-[#64748b]"}`}
                    >
                      {slot.dayName}
                    </span>
                    <span
                      className={`block text-2xl font-black mt-2 ${isDateSelected ? "text-[#1e6ffd]" : "text-[#0f172a]"}`}
                    >
                      {slot.dayNum}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h4 className="text-lg font-bold text-[#0f172a]">
              Available Time Slots for {selectedDate}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {timeSlots.map((slot, index) => {
                const isTimeSelected = selectedTime === slot.time;
                const isFull = slot.status === "full";
                const isLimited = slot.status === "limited";

                let statusClasses =
                  "border-[#e2e8f0] bg-white hover:border-[#cbd5e1]";
                if (isFull) {
                  statusClasses =
                    "border-[#e2e8f0] bg-slate-50/70 opacity-60 cursor-not-allowed";
                } else if (isLimited) {
                  statusClasses =
                    "border-[#fbd38d] bg-[#fffaf0] hover:border-orange-400";
                } else if (slot.status === "available") {
                  statusClasses =
                    "border-[#bbf7d0] bg-[#f0fdf4] hover:border-emerald-400";
                }

                if (isTimeSelected && !isFull) {
                  statusClasses =
                    "border-[#1e6ffd] ring-2 ring-blue-100 bg-white";
                }

                return (
                  <div
                    key={index}
                    onClick={() => !isFull && setSelectedTime(slot.time)}
                    className={`border rounded-2xl p-4 transition-all duration-200 relative group flex flex-col gap-1 ${
                      !isFull ? "cursor-pointer" : ""
                    } ${statusClasses}`}
                  >
                    {(isFull || isLimited) && (
                      <span
                        className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white shadow-sm font-bold ${isFull ? "bg-slate-400" : "bg-orange-400"}`}
                      >
                        ⚡
                      </span>
                    )}

                    <div className="flex items-center gap-2">
                      <Clock
                        className={`w-4 h-4 ${isTimeSelected ? "text-[#1e6ffd]" : isFull ? "text-slate-400" : isLimited ? "text-orange-600" : "text-emerald-600"}`}
                      />
                      <span
                        className={`text-sm font-black ${isTimeSelected ? "text-[#1e6ffd]" : isFull ? "text-slate-500" : isLimited ? "text-orange-700" : "text-emerald-700"}`}
                      >
                        {slot.time}
                      </span>
                    </div>

                    <span
                      className={`text-xs font-semibold pl-6 ${isFull ? "text-slate-400" : isLimited ? "text-orange-600" : "text-emerald-600"}`}
                    >
                      👥 {slot.availableSlots}/{slot.totalSlots} slots
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: BOOKING SUMMARY (30%) */}
      <div className="w-full lg:w-80 shrink-0 sticky top-6">
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[350px]">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-[#0f172a] border-b border-[#f1f5f9] pb-3">
              Booking Summary
            </h3>

            {!selectedPackageId ? (
              <div className="text-center py-12 text-[#94a3b8] font-medium text-sm px-4">
                Select a vehicle and wash package to continue
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                {currentVehicle && (
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="block text-xs text-[#94a3b8] font-medium">
                        Vehicle
                      </span>
                      <span className="font-bold text-[#334155]">
                        {currentVehicle.vehicleName}
                      </span>
                    </div>
                    <span className="text-xs font-bold bg-blue-50 text-[#1e6ffd] px-2 py-1 rounded-md">
                      {currentVehicle.licensePlate}
                    </span>
                  </div>
                )}
                {currentPackage && (
                  <div className="flex justify-between items-center border-t border-[#f1f5f9] pt-3">
                    <div>
                      <span className="block text-xs text-[#94a3b8] font-medium">
                        Wash Package
                      </span>
                      <span className="font-bold text-[#334155]">
                        {currentPackage.name}
                      </span>
                    </div>
                    <span className="font-extrabold text-[#0f172a] text-lg">
                      ${currentPackage.price}
                    </span>
                  </div>
                )}
                <div className="flex flex-col gap-1 border-t border-[#f1f5f9] pt-3">
                  <span className="block text-xs text-[#94a3b8] font-medium">
                    Schedule Time
                  </span>
                  <span className="font-bold text-[#334155]">
                    {selectedDate}{" "}
                    {selectedTime
                      ? `@ ${selectedTime}`
                      : "(Please choose time)"}
                  </span>
                </div>

                <div className="border-t border-[#f1f5f9] pt-4 mt-2 flex justify-between items-baseline">
                  <span className="font-bold text-[#0f172a] text-base">
                    Total Estimated:
                  </span>
                  <span className="font-black text-[#1e6ffd] text-2xl">
                    ${currentPackage?.price}
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            disabled={!selectedPackageId || !selectedTime}
            className={`w-full mt-6 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 text-center ${
              selectedPackageId && selectedTime
                ? "bg-[#1e6ffd] hover:bg-[#1154ca] text-white shadow-md shadow-blue-100 cursor-pointer"
                : "bg-[#e2e8f0] text-[#94a3b8] cursor-not-allowed"
            }`}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};
