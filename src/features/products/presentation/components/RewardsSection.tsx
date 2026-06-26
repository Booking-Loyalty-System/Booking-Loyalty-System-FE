import React, { useState, useMemo } from "react";
import {
  Gift,
  Ticket,
  Star,
  Sparkles,
  CheckCircle,
  Info,
  History,
} from "lucide-react";
import { useReward } from "@/features/products/application/useReward.ts";
import { useCustomerMe } from "@/features/products/application/useCustomer.ts";
import { toast } from "sonner";

interface RewardItem {
  id: string;
  title: string;
  description: string;
  validDays: number;
  requiredPts: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  comingSoon?: boolean;
}

export const RewardsSection: React.FC = () => {
  const { customerMe } = useCustomerMe();
  const {
    redemptions,
    redeemReward,
    isRedeeming,
    availableRewards,
    isLoadingRewards,
  } = useReward();

  const availablePoints = customerMe?.availablePoint ?? 0;
  const [redeemingId, setRedeemingId] = useState<string | null>(null);

  // Bảng cấu hình icon mẫu
  const iconMap = {
    GIFT: {
      icon: <Gift className="w-6 h-6" />,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    TICKET: {
      icon: <Ticket className="w-6 h-6" />,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    STAR: {
      icon: <Star className="w-6 h-6" />,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    SPARKLES: {
      icon: <Sparkles className="w-6 h-6" />,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
    },
  };

  // 🌟 Kiểm tra nghiêm ngặt dữ liệu và chuyển đổi đúng tên thuộc tính (name -> title, pointsCost -> requiredPts)
  const rewards: RewardItem[] = useMemo(() => {
    if (!Array.isArray(availableRewards)) return [];

    return availableRewards
      .map((reward) => {
        if (!reward) return null;

        // Tự động phân phối icon dựa vào giá trị discountAmount nếu API không trả về iconType cụ thể
        let iconConfig = iconMap.GIFT;
        if (reward.discountAmount >= 200) {
          iconConfig = iconMap.SPARKLES;
        } else if (reward.discountAmount >= 100) {
          iconConfig = iconMap.STAR;
        } else if (reward.discountAmount >= 20) {
          iconConfig = iconMap.TICKET;
        }

        return {
          id: reward.id,
          title: reward.name ?? "Voucher đặc biệt", // Map đúng trường "name" từ API mới
          description:
            reward.description ?? "Đổi điểm để nhận ưu đãi giảm giá.",
          validDays: reward.validDays ?? 30, // Fallback mặc định 30 ngày nếu API trống
          requiredPts: reward.pointsCost ?? 0, // Map đúng trường "pointsCost" từ API mới
          comingSoon: !reward.isActive, // Nếu isActive = false thì coi như chưa mở
          ...iconConfig,
        };
      })
      .filter((item) => item !== null) as RewardItem[];
  }, [availableRewards]);

  // Tính toán số lượng phần thưởng người dùng có thể đổi dựa trên số điểm thật
  const redeemableCount = useMemo(() => {
    return rewards.filter(
      (r) => !r.comingSoon && availablePoints >= r.requiredPts,
    ).length;
  }, [rewards, availablePoints]);

  const handleRedeemClick = async (
    rewardId: string,
    cost: number,
    title: string,
  ) => {
    if (availablePoints < cost) {
      toast.error("Bạn không đủ điểm tích lũy để đổi phần thưởng này!");
      return;
    }

    setRedeemingId(rewardId);
    try {
      await redeemReward(rewardId);
      toast.success(
        `Đổi thành công: ${title}! Voucher đã được thêm vào tài khoản của bạn.`,
      );
    } catch (err) {
      console.error("Lỗi đổi thưởng:", err);
      toast.error("Đổi quà thất bại, vui lòng thử lại sau.");
    } finally {
      setRedeemingId(null);
    }
  };

  return (
    <div className="w-full space-y-8 text-slate-800">
      {/* 1. Thanh thông báo tự động áp dụng */}
      <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-5 flex items-start gap-4">
        <div className="p-2 bg-white rounded-full text-emerald-600 shadow-sm shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-emerald-900 text-base">
            Tự động áp dụng khi đặt lịch
          </h4>
          <p className="text-sm text-emerald-800 leading-relaxed">
            Tất cả voucher sau khi đổi sẽ được{" "}
            <strong className="text-emerald-900 font-extrabold">
              tự động tối ưu tại trang thanh toán
            </strong>
            . Bạn không cần phải nhập mã thủ công!
          </p>
        </div>
      </div>

      {/* 2. Danh sách phần thưởng */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Phần thưởng khả dụng
          </h2>
          <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
            <CheckCircle className="w-4 h-4 text-slate-400" />
            <span>Bạn có thể đổi được {redeemableCount} phần thưởng</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingRewards ? (
            <div className="col-span-full py-12 flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          ) : rewards.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 font-medium">
              Hiện tại không có phần thưởng nào khả dụng.
            </div>
          ) : (
            rewards.map((item) => {
              const canAfford = availablePoints >= item.requiredPts;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative ${
                    item.comingSoon ? "opacity-75" : ""
                  }`}
                >
                  {item.comingSoon && (
                    <span className="absolute top-4 right-4 bg-slate-100 text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full">
                      Sắp ra mắt
                    </span>
                  )}

                  <div>
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.iconBg} ${item.iconColor}`}
                    >
                      {item.icon}
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-2 leading-relaxed font-medium">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mt-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      <span>Hạn dùng {item.validDays} ngày sau khi đổi</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Yêu cầu
                      </p>
                      <p className="text-xl font-black text-slate-800 mt-0.5">
                        {item.requiredPts}{" "}
                        <span className="text-sm font-bold text-slate-500">
                          điểm
                        </span>
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        handleRedeemClick(item.id, item.requiredPts, item.title)
                      }
                      disabled={
                        item.comingSoon ||
                        !canAfford ||
                        isRedeeming ||
                        redeemingId === item.id
                      }
                      className={`font-bold text-sm px-6 py-2.5 rounded-xl shadow-sm transition-all ${
                        !item.comingSoon && canAfford
                          ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                      }`}
                    >
                      {redeemingId === item.id ? "Đang xử lý..." : "Đổi Ngay"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 3. Phần lịch sử đổi thưởng gần đây */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2.5">
          <History className="w-5 h-5 text-slate-400" />
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">
            Lịch sử đổi thưởng
          </h3>
        </div>

        <div className="divide-y divide-slate-100">
          {!Array.isArray(redemptions) || redemptions.length === 0 ? (
            <p className="text-sm text-slate-400 font-medium text-center py-8">
              Bạn chưa đổi phần thưởng nào.
            </p>
          ) : (
            redemptions.map((v) => {
              if (!v) return null;
              return (
                <div
                  key={v.id}
                  className="p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600">
                      <Ticket className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-base tracking-tight">
                        {v.rewardName ?? "Voucher giảm giá"}
                      </h4>
                      {(() => {
                        const statusLower = String(v.status).toLowerCase();
                        const isAvailable =
                          statusLower === "active" || statusLower === "pending";
                        const isUsed =
                          statusLower === "used" || statusLower === "fulfilled";

                        return (
                          <p className="text-[11px] font-bold text-slate-400 mt-1">
                            Trạng thái:{" "}
                            <span
                              className={
                                isAvailable
                                  ? "text-emerald-600"
                                  : "text-slate-500"
                              }
                            >
                              {isAvailable
                                ? "Khả dụng"
                                : isUsed
                                  ? "Đã dùng"
                                  : "Hết hạn"}
                            </span>{" "}
                            · Mã:{" "}
                            <span className="font-mono">
                              REDEEM-{v.pointsSpent}PTS
                            </span>
                          </p>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    <p className="text-lg font-black text-slate-800 tracking-tight">
                      -{v.pointsSpent ?? 0}{" "}
                      <span className="text-xs font-bold text-slate-500">
                        điểm
                      </span>
                    </p>
                    {(() => {
                      const statusLower = String(v.status).toLowerCase();
                      const isAvailable =
                        statusLower === "active" || statusLower === "pending";
                      const isUsed =
                        statusLower === "used" || statusLower === "fulfilled";

                      return (
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            isAvailable
                              ? "bg-emerald-50 text-emerald-700"
                              : isUsed
                                ? "bg-slate-100 text-slate-600"
                                : "bg-rose-50 text-rose-600"
                          }`}
                        >
                          {isAvailable
                            ? "Khả dụng"
                            : isUsed
                              ? "Đã dùng"
                              : "Hết hạn"}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
