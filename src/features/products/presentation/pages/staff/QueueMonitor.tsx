import React, { useState } from 'react';
import {
  Search, Car, CheckCircle, Clock, LayoutGrid, Users, Calendar, AlertTriangle, GripVertical, X, Play, Info
} from 'lucide-react';
import { useStaffDashboard } from '../../../application/useStaffDashboard';
import { useWashBay } from '../../../application/useWashBay';
import { useStaff } from "@/features/products/application/useStaff.ts";
import { useBooking } from "@/features/products/application/useBooking.ts";
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface DashboardBooking {
  id: string;
  bookingCode: string;
  vehicleId: string;
  vehicleName: string;
  vehicleType: string;
  licensePlate: string;
  washPackageId: string;
  serviceName: string;
  branchId: string;
  bookingDate: string;
  startTime: string;
  status: 'Pending' | 'Confirmed' | 'CheckedIn' | 'Queued' | 'InProgress' | 'Completed' | 'CheckedOut' | 'Cancelled' | 'NoShow' | string;
  totalAmount: number;
  pointsEarned: number | null;
  createdAt: string;
  bayId?: string;
}

interface DashboardActions {
  updateStatus: (params: {
    id: string;
    payload: { targetStatus: number; reason?: string; staffId?: string }
  }) => Promise<unknown>;
}

export const QueueMonitor: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // State quản lý khoang được chọn để xem chi tiết hàng đợi
  const [selectedBay, setSelectedBay] = useState<any | null>(null);

  // 🌟 CHÍNH LÀ CÁI NÀY: State quản lý Modal gợi ý chuyển khoang trống
  const [suggestionModal, setSuggestionModal] = useState<{
    targetBookingId: string;
    targetBookingPlate: string;
    targetBookingType: string;
    originalBayId: string;
    originalBayName: string;
    suggestedBayId: string;
    suggestedBayName: string;
  } | null>(null);

  const { staffProfile, isLoading: isStaffLoading } = useStaff();
  const branchId = staffProfile?.branchId || staffProfile?.branch?.id;

  const { bookings = [], isLoading: isBookingsLoading, actions, selectedDate, setSelectedDate } = useStaffDashboard() as unknown as {
    bookings: DashboardBooking[];
    isLoading: boolean;
    actions: DashboardActions;
    selectedDate: string;
    setSelectedDate: (date: string) => void;
  };

  const { startBooking, queueBooking } = useBooking({ loadMyBookings: false });
  const { washBays = [], isLoading: isWashBaysLoading } = useWashBay(branchId);

  const waitingQueue = bookings.filter(b =>
      (b.status === 'Confirmed' || b.status === 'CheckedIn' || b.status === 'Queued') &&
      !b.bayId &&
      (b.bookingCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.licensePlate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.vehicleName?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const inProgressBookings = bookings.filter(b => b.status === 'InProgress');

  const baysStatus = washBays.map((bay, index) => {
    const activeBooking = bookings.find(b => b.status === 'InProgress' && b.bayId === bay.id) || inProgressBookings[index] || null;
    const bayQueue = bookings.filter(b => b.bayId === bay.id && (b.status === 'Queued' || b.status === 'CheckedIn'));
    console.log(`Khoang ${bay.name} có hàng đợi:`, bayQueue);
    console.log(`Danh sách toàn bộ bookings:`, bookings);
    const isMaintenance = bay.status === 'Maintenance' || bay.status === 'maintenance';
    const isOccupied = isMaintenance || !!activeBooking;

    const currentRemainingTime = activeBooking ? (index === 0 ? 12 : index === 1 ? 8 : 25) : 0;
    const totalBayWaitTime = currentRemainingTime + (bayQueue.length * 15);

    return {
      ...bay,
      isOccupied,
      isMaintenance,
      booking: activeBooking,
      bayQueue,
      remainingTime: currentRemainingTime,
      totalBayWaitTime
    };
  });

  const totalWaitingVehicles = bookings.filter(b => b.status === 'Confirmed' || b.status === 'CheckedIn' || b.status === 'Queued').length;
  const availableBaysCount = baysStatus.filter(b => !b.isOccupied && !b.isMaintenance).length;
  const avgWaitTime = totalWaitingVehicles * 15;

  const handleDragStart = (e: React.DragEvent, bookingId: string) => {
    e.dataTransfer.setData("text/plain", bookingId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnBay = async (
      e: React.DragEvent,
      bayId: string,
      bayName: string,
      isOccupied: boolean,
      isMaintenance: boolean,
      supportedTypes?: string[]
  ) => {
    e.preventDefault();

    if (isMaintenance) {
      toast.error(`❌ ${bayName} đang bảo trì! Vui lòng chọn khoang khác.`);
      return;
    }

    const bookingId = e.dataTransfer.getData("text/plain");
    if (!bookingId) return;

    const targetBooking = bookings.find(b => b.id === bookingId);
    if (!targetBooking) return;

    if (supportedTypes && targetBooking.vehicleType) {
      const isVehicleSupported = supportedTypes.some(
          type => type.toLowerCase() === targetBooking.vehicleType.toLowerCase()
      );

      if (!isVehicleSupported) {
        toast.error(`❌ Khước từ! ${bayName} chỉ hỗ trợ kích cỡ: ${supportedTypes.join(', ')}. Xe này thuộc nhóm [${targetBooking.vehicleType}].`);
        return;
      }
    }

    if (isOccupied) {
      // 🌟 TÌM KHOANG TRỐNG THAY THẾ (SMART SUGGESTION LÀ Ở ĐÂY ĐÓ!)
      const availableFitBay = baysStatus.find(bay => {
        if (bay.isOccupied || bay.isMaintenance) return false;

        // Nếu khoang nhận mọi size HOẶC xe chưa cập nhật size -> Vẫn cứ gợi ý khoang trống này
        if (!bay.supportedTypes || bay.supportedTypes.length === 0 || !targetBooking.vehicleType) return true;

        return bay.supportedTypes.some((type: string) => type.toLowerCase() === targetBooking.vehicleType.toLowerCase());
      });

      if (availableFitBay) {
        // Có khoang thay thế -> Hiện Popup lên không cho vào hàng đợi vội
        setSuggestionModal({
          targetBookingId: bookingId,
          targetBookingPlate: targetBooking.licensePlate,
          targetBookingType: targetBooking.vehicleType || 'Chưa rõ',
          originalBayId: bayId,
          originalBayName: bayName,
          suggestedBayId: availableFitBay.id,
          suggestedBayName: availableFitBay.name
        });
        return;
      }

      // Hết khoang rảnh thật sự -> Đành xếp hàng
      await triggerQueueWash(bookingId, bayId, bayName);
    } else {
      await triggerStartWash(bookingId, bayId, bayName);
    }
  };

  const handleAcceptSuggestion = async () => {
    if (!suggestionModal) return;
    const { targetBookingId, suggestedBayId, suggestedBayName } = suggestionModal;
    setSuggestionModal(null);
    await triggerStartWash(targetBookingId, suggestedBayId, suggestedBayName);
  };

  const handleDeclineSuggestion = async () => {
    if (!suggestionModal) return;
    const { targetBookingId, originalBayId, originalBayName } = suggestionModal;
    setSuggestionModal(null);
    await triggerQueueWash(targetBookingId, originalBayId, originalBayName);
  };

  const triggerStartWash = async (bookingId: string, bayId: string, bayName: string) => {
    setActionLoadingId(bookingId);
    try {
      await startBooking({ id: bookingId, bayId });
      toast.success(`🚀 Khoang trống! Xe đã bắt đầu rửa trực tiếp tại ${bayName}.`);
      queryClient.invalidateQueries();
      if (selectedBay) setSelectedBay(null);
    } catch (error) {
      console.error(error);
      toast.error('Không thể bắt đầu rửa xe, vui lòng kiểm tra lại.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const triggerQueueWash = async (bookingId: string, bayId: string, bayName: string) => {
    setActionLoadingId(bookingId);
    try {
      await queueBooking({ id: bookingId, bayId });
      toast.success(`⏳ Khoang bận! Đã đưa xe vào hàng đợi riêng của ${bayName}.`);
      queryClient.invalidateQueries();
    } catch (error) {
      console.error(error);
      toast.error('Không thể xếp lịch vào hàng đợi của khoang này.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleFinishWash = async (bookingId: string) => {
    setActionLoadingId(bookingId);
    try {
      await actions.updateStatus({
        id: bookingId,
        payload: { targetStatus: 6 }
      });
      toast.success('🧼 Rửa xe hoàn tất! Lịch đặt đã chuyển sang trạng thái Completed.');
      queryClient.invalidateQueries();
      if (selectedBay) setSelectedBay(null);
    } catch (error) {
      console.error(error);
      toast.error('Cập nhật trạng thái thất bại.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const activeBayDetail = selectedBay ? baysStatus.find(b => b.id === selectedBay.id) : null;

  if (isStaffLoading) {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 bg-slate-50 min-h-screen animate-pulse">
          <div className="h-10 w-48 bg-slate-200 rounded-xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => <div key={n} className="h-32 bg-slate-200 rounded-2xl"></div>)}
          </div>
          <div className="h-[600px] bg-slate-200 rounded-2xl"></div>
        </div>
    );
  }

  return (
      <div className="space-y-6 font-sans antialiased text-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              Queue Monitor
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Quản lý hàng đợi và trạng thái khoang rửa trực tiếp</p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-52">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="w-4 h-4 text-slate-400" />
              </div>
              <input
                  type="date"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all font-semibold text-slate-700 cursor-pointer"
                  value={selectedDate || ''}
                  onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-slate-400" />
              </div>
              <input
                  type="text"
                  placeholder="Tìm xe theo mã, biển số..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-300">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng Xe Đang Chờ</span>
              <h3 className="text-4xl font-extrabold text-slate-900">{isBookingsLoading ? '...' : totalWaitingVehicles}</h3>
            </div>
            <div className="w-14 h-14 bg-orange-50 rounded-2xl text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Car className="w-7 h-7" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-300">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Khoang Trống</span>
              <h3 className="text-4xl font-extrabold text-slate-900">
                {isWashBaysLoading ? '...' : <>{availableBaysCount} <span className="text-2xl text-slate-300">/ {washBays.length}</span></>}
              </h3>
            </div>
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle className="w-7 h-7" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-300">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">TG Chờ TB</span>
              <h3 className="text-4xl font-extrabold text-slate-900">
                {isBookingsLoading ? '...' : avgWaitTime} <span className="text-xl font-bold text-slate-400">phút</span>
              </h3>
            </div>
            <div className="w-14 h-14 bg-blue-50 rounded-2xl text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-7 h-7" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[calc(100vh-230px)] min-h-[500px] overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-xl">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="font-bold text-lg text-slate-800">Unassigned Queue</h2>
              </div>
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
                {waitingQueue.length} Xe
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {isBookingsLoading ? (
                  <div className="space-y-3 animate-pulse">
                    {[1, 2, 3].map(n => <div key={n} className="h-28 bg-slate-100 rounded-xl"></div>)}
                  </div>
              ) : waitingQueue.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                      <Car className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="font-medium text-sm text-center px-4">Không có xe mới cần điều phối hoặc kéo thả</p>
                  </div>
              ) : (
                  waitingQueue.map((b, idx) => (
                      <div
                          key={b.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, b.id)}
                          className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group flex gap-3"
                      >
                        <div className="flex items-center text-slate-300 group-hover:text-blue-400 transition-colors">
                          <GripVertical className="w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="flex items-center justify-center bg-slate-900 text-white font-bold text-[10px] w-5 h-5 rounded-md shrink-0">
                                    #{idx + 1}
                                </span>
                                <h4 className="font-extrabold text-slate-900 text-sm tracking-tight truncate">
                                  {b.licensePlate || 'N/A'}
                                </h4>
                              </div>
                              <p className="text-xs text-slate-500 font-medium truncate">
                                {b.vehicleName || 'Unknown Car'} {b.vehicleType ? <span className="text-slate-400">({b.vehicleType})</span> : ''}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100 truncate max-w-[120px]">
                                    {b.serviceName || 'Standard Wash'}
                                </span>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold bg-slate-50 px-2 py-1 rounded-md border border-slate-100 shrink-0">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>Đợi {(idx + 1) * 15}p</span>
                            </div>
                          </div>
                        </div>
                      </div>
                  ))
              )}
            </div>
          </div>

          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[calc(100vh-230px)] min-h-[500px] overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3 shrink-0">
              <div className="bg-emerald-100 p-2 rounded-xl">
                <LayoutGrid className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="font-bold text-lg text-slate-800">Wash Bay Status (Bấm vào để xem hàng đợi riêng)</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 custom-scrollbar">
              {isWashBaysLoading ? (
                  <div className="text-center py-20 text-slate-400 font-medium animate-pulse">
                    Đang tải dữ liệu khoang rửa...
                  </div>
              ) : baysStatus.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <LayoutGrid className="w-12 h-12 text-slate-200 mb-3" />
                    <p className="font-medium">Chưa có khoang rửa nào được cấu hình</p>
                  </div>
              ) : baysStatus.map((bay) => (
                  <div
                      key={bay.id}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDropOnBay(e, bay.id, bay.name, bay.isOccupied, bay.isMaintenance, bay.supportedTypes)}
                      onClick={() => !bay.isMaintenance && setSelectedBay(bay)}
                      className={`rounded-2xl p-5 transition-all flex flex-col gap-4 border-2 cursor-pointer ${
                          bay.isMaintenance
                              ? 'bg-rose-50/50 border-rose-200 cursor-not-allowed'
                              : bay.isOccupied
                                  ? 'bg-white border-orange-200 shadow-[0_4px_20px_-4px_rgba(251,146,60,0.15)] hover:border-orange-400'
                                  : 'bg-slate-50 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                            bay.isMaintenance ? 'bg-rose-100 text-rose-600' :
                                bay.isOccupied ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white' : 'bg-white border border-slate-200 text-slate-400'
                        }`}>
                          {bay.isMaintenance ? <AlertTriangle className="w-5 h-5" /> : <Car className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className={`font-bold text-base ${bay.isMaintenance ? 'text-rose-900' : 'text-slate-900'}`}>
                              {bay.name}
                            </h3>
                            {bay.bayQueue && bay.bayQueue.length > 0 && (
                                <span className="bg-blue-600 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full">
                                Đang đợi: {bay.bayQueue.length} xe
                              </span>
                            )}
                          </div>
                          {bay.supportedTypes && bay.supportedTypes.length > 0 && (
                              <div className="flex gap-1.5 mt-1.5 flex-wrap">
                                {bay.supportedTypes.map((type: string) => (
                                    <span key={type} className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
                                        bay.isMaintenance ? 'bg-rose-100/50 text-rose-600' :
                                            bay.isOccupied ? 'bg-orange-50 text-orange-600' : 'bg-white text-slate-500 border border-slate-200/60'
                                    }`}>
                                  {type}
                                </span>
                                ))}
                              </div>
                          )}
                        </div>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shrink-0 ${
                          bay.isMaintenance ? 'bg-rose-100 text-rose-700' :
                              bay.isOccupied ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700 border border-emerald-200/50'
                      }`}>
                        {bay.isMaintenance ? 'MAINTENANCE' : bay.isOccupied ? 'OCCUPIED' : 'AVAILABLE'}
                      </span>
                    </div>

                    {bay.isMaintenance ? (
                        <div className="flex flex-col items-center justify-center text-center py-4 bg-rose-50 rounded-xl">
                          <p className="text-sm font-semibold text-rose-600 mb-1">Khoang Đang Bảo Trì</p>
                          <p className="text-xs text-rose-400/80">Tạm thời không thể xếp xe vào khoang này.</p>
                        </div>
                    ) : bay.isOccupied && bay.booking ? (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-orange-50/60 p-4 rounded-xl border border-orange-100/60 mt-1" onClick={(e) => e.stopPropagation()}>
                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                              Xe Đang Rửa Trực Tiếp
                            </p>
                            <div>
                              <h4 className="font-extrabold text-slate-900 text-base">
                                {bay.booking.licensePlate}
                                <span className="ml-2 font-medium text-sm text-slate-500">({bay.booking.vehicleName})</span>
                              </h4>
                              <div className="inline-block mt-2 px-2.5 py-1 rounded-md text-[11px] font-bold bg-white text-slate-600 border border-slate-100 shadow-sm">
                                {bay.booking.serviceName}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center sm:flex-col justify-between sm:justify-center gap-3 sm:min-w-[130px] shrink-0">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-white px-3 py-1.5 rounded-lg border border-orange-100 shadow-sm w-full justify-center">
                              <Clock className="w-4 h-4 animate-pulse" />
                              <span>Còn {bay.remainingTime}p</span>
                            </div>
                            <button
                                onClick={() => handleFinishWash(bay.booking!.id)}
                                disabled={actionLoadingId === bay.booking.id}
                                className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-sm transition-all disabled:opacity-50 sm:w-full hover:shadow-md hover:-translate-y-0.5"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Hoàn Thành
                            </button>
                          </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center py-6 bg-slate-100/50 rounded-xl border border-slate-200/50 border-dashed">
                          <p className="text-sm font-semibold text-slate-500 mb-1">Khoang Sẵn Sàng</p>
                          <p className="text-xs text-slate-400">Kéo thả xe từ hàng chờ chung vào đây hoặc click để kiểm tra lịch.</p>
                        </div>
                    )}
                  </div>
              ))}
            </div>
          </div>
        </div>

        {/* ======================================================= */}
        {/* MODAL GỢI Ý CHUYỂN KHOANG (SMART SUGGESTION) */}
        {/* ======================================================= */}
        {suggestionModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 w-full max-w-lg overflow-hidden">
                <div className="bg-blue-50/80 p-5 border-b border-blue-100 flex gap-4 items-start">
                  <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-sm shrink-0">
                    <Info className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-blue-900 leading-tight">Có khoang trống kìa sếp!</h3>
                    <p className="text-sm text-blue-700 mt-1 font-medium">Bạn đang xếp xe vào <strong className="font-bold">{suggestionModal.originalBayName}</strong> (đang bận rộn).</p>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-sm text-slate-600 mb-4">
                    Hệ thống thấy xe biển số <span className="font-bold text-slate-900">{suggestionModal.targetBookingPlate}</span> (nhóm <span className="font-bold text-slate-900 uppercase">{suggestionModal.targetBookingType}</span>) có thể được bắt đầu rửa ngay lập tức tại:
                  </p>

                  <div className="bg-emerald-50 border-2 border-emerald-500/30 rounded-xl p-4 flex items-center justify-between mb-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center"><CheckCircle className="w-5 h-5" /></div>
                      <div>
                        <h4 className="font-bold text-emerald-900 text-lg">{suggestionModal.suggestedBayName}</h4>
                        <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wider">Trạng thái: Đang trống</p>
                      </div>
                    </div>
                    <span className="bg-emerald-500 text-white text-[10px] px-2 py-1 rounded font-black uppercase tracking-wider animate-pulse">Rửa Luôn</span>
                  </div>

                  <div className="flex gap-3">
                    <button
                        onClick={handleDeclineSuggestion}
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
                    >
                      Bỏ qua, cứ xếp vào {suggestionModal.originalBayName}
                    </button>
                    <button
                        onClick={handleAcceptSuggestion}
                        className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-md shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      Chuyển sang khoang trống
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* ======================================================= */}
        {/* MODAL CHI TIẾT HÀNG ĐỢI RIÊNG CỦA KHOANG (WASH BAY POP-UP) */}
        {/* ======================================================= */}
        {activeBayDetail && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in animate-in">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold">
                      <LayoutGrid className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-extrabold text-xl text-slate-900">{activeBayDetail.name}</h2>
                      <p className="text-xs text-slate-500 font-medium">Hàng đợi và điều phối rửa xe riêng tại khoang</p>
                    </div>
                  </div>
                  <button
                      onClick={() => setSelectedBay(null)}
                      className="p-2 hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 rounded-xl transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto space-y-6 custom-scrollbar">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50/50 border border-blue-100/60 p-4 rounded-xl">
                      <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider block mb-1">Xe Đang Chờ Tại Khoang</span>
                      <h4 className="text-2xl font-black text-slate-900">{activeBayDetail.bayQueue.length} xe</h4>
                    </div>
                    <div className="bg-indigo-50/50 border border-indigo-100/60 p-4 rounded-xl">
                      <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider block mb-1">Tổng Thời Gian Giải Quyết</span>
                      <h4 className="text-2xl font-black text-slate-900">{activeBayDetail.totalBayWaitTime} <span className="text-sm font-semibold text-slate-400">phút chờ</span></h4>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Xe Đang Trong Khoang</h3>
                    {activeBayDetail.booking ? (
                        <div className="bg-orange-50/60 border border-orange-100 p-4 rounded-xl flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                              <span className="text-sm font-black text-slate-900">{activeBayDetail.booking.licensePlate}</span>
                            </div>
                            <p className="text-xs text-slate-500 font-semibold">{activeBayDetail.booking.vehicleName} — <span className="text-orange-600">{activeBayDetail.booking.serviceName}</span></p>
                          </div>
                          <div className="text-right space-y-2">
                            <span className="inline-block bg-white border border-orange-100 px-3 py-1 rounded-md text-xs font-bold text-orange-600">Còn {activeBayDetail.remainingTime}p</span>
                            <button
                                onClick={() => handleFinishWash(activeBayDetail.booking.id)}
                                className="block text-[11px] font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition-all shadow-sm"
                            >
                              Hoàn thành ngay
                            </button>
                          </div>
                        </div>
                    ) : (
                        <div className="text-center py-4 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-100">
                          Khoang hiện đang trống! Sẵn sàng bấm Bắt đầu rửa cho xe kế tiếp.
                        </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Hàng Đợi Riêng Kế Tiếp ({activeBayDetail.bayQueue.length})</h3>
                    {activeBayDetail.bayQueue.length === 0 ? (
                        <p className="text-xs text-slate-400 italic text-center py-6 border border-dashed border-slate-200 rounded-xl">Không có xe nào xếp hàng chờ riêng tại khoang này.</p>
                    ) : (
                        <div className="space-y-3">
                          {activeBayDetail.bayQueue.map((b: any, index: number) => (
                              <div key={b.id} className="bg-white border border-slate-200 hover:border-blue-200 rounded-xl p-4 shadow-sm flex items-center justify-between gap-4 transition-all">
                                <div className="flex items-center gap-3 min-w-0">
                            <span className="flex items-center justify-center bg-blue-50 text-blue-600 font-extrabold text-xs w-6 h-6 rounded-md shrink-0">
                              {index + 1}
                            </span>
                                  <div className="min-w-0">
                                    <h4 className="font-extrabold text-slate-900 text-sm truncate">{b.licensePlate || 'N/A'}</h4>
                                    <p className="text-xs text-slate-500 font-medium truncate">{b.vehicleName} ({b.serviceName})</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                  <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">Đợi ~{index * 15 + activeBayDetail.remainingTime}p</span>
                                  <button
                                      onClick={() => triggerStartWash(b.id, activeBayDetail.id, activeBayDetail.name)}
                                      disabled={actionLoadingId === b.id}
                                      className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-3 py-2 rounded-lg transition-all disabled:opacity-50 shadow-sm"
                                  >
                                    <Play className="w-3 h-3 fill-white" />
                                    Bắt Đầu Rửa
                                  </button>
                                </div>
                              </div>
                          ))}
                        </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
        )}

        <style dangerouslySetInnerHTML={{__html: `
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
          .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #94a3b8; }
        `}} />
      </div>
  );
};