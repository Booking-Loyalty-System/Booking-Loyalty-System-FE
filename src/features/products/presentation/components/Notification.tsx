import React from "react";
import {
  Bell,
  CheckCircle,
  Clock,
  Info,
  Crown,
  CheckCheck,
} from "lucide-react";
import { useNotification } from "../../application/useNotification";
import { useCustomerMe } from "../../application/useCustomer";
import { useLoyaltyHistory } from "../../application/useLoyalty";
import { useBooking } from "../../application/useBooking";
import { useTranslation } from "react-i18next";
import {
  translateDynamic,
  translateNotificationTitle,
  translateNotificationMessage,
} from "@/shared/utils/dynamicTranslator";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: "Booking" | "System" | "TierUpgrade" | "Loyalty" | "Points" | string;
  createdAt: string | Date;
}

export const NotificationCenter: React.FC = () => {
  const { t, i18n } = useTranslation("customer");
  const { notifications, isLoading, markAsRead } = useNotification();
  const { customerMe } = useCustomerMe();
  const { data: loyaltyHistory } = useLoyaltyHistory();
  const { myBookings } = useBooking();

  // Dùng dữ liệu thực (tier & điểm) từ user profile để tạo thông báo động (luôn hiện trên cùng)
  let displayNotifications: NotificationItem[] = [
    ...(notifications as NotificationItem[]),
  ];

  // Lấy lịch sử đổi điểm (Redeemed) và biến thành thông báo
  if (loyaltyHistory?.transactions) {
    const redeemNotifications = loyaltyHistory.transactions
      .filter((tx) => tx.type === "Redeemed")
      .map((tx) => ({
        id: `redeem-${tx.id}`,
        title: t("notifications.points.redeemTitle"),
        message: t("notifications.points.redeemMessage", {
          points: Math.abs(tx.points),
          desc: tx.description,
          remaining: customerMe?.availablePoint ?? customerMe?.totalPoint ?? 0,
        }),
        type: "Points",
        isRead: true,
        createdAt: tx.date,
      }));

    const earnedNotifications = loyaltyHistory.transactions
      .filter((tx) => tx.type === "Earned")
      .map((tx) => {
        let bookingCode = "";
        if (tx.description.includes("đơn hàng")) {
          bookingCode = tx.description.split("đơn hàng ")[1]?.trim() || "";
        } else if (tx.description.includes("thanh toán booking")) {
          bookingCode = tx.description.split("booking ")[1]?.trim() || "";
        } else if (tx.description.includes("Earned from booking")) {
          bookingCode =
            tx.description.split("Earned from booking ")[1]?.trim() || "";
        }

        const booking = myBookings?.find((b) => b.bookingCode === bookingCode);
        const paidAmount = booking
          ? new Intl.NumberFormat(i18n.language === "en" ? "en-US" : "vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(booking.totalPrice)
          : i18n.language === "en"
            ? "(unknown)"
            : "(không xác định)";

        return {
          id: `earned-${tx.id}`,
          title: t("notifications.points.earnedTitle"),
          message: t("notifications.points.earnedMessage", {
            code: bookingCode,
            date: new Date(tx.date).toLocaleDateString(
              i18n.language === "en" ? "en-US" : "vi-VN",
            ),
            amount: paidAmount,
            points: tx.points,
          }),
          type: "Points",
          isRead: true,
          createdAt: tx.date,
        };
      });

    displayNotifications = [
      ...displayNotifications,
      ...redeemNotifications,
      ...earnedNotifications,
    ];
  }

  // Sắp xếp giảm dần theo thời gian (mới nhất lên trên)
  displayNotifications.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  // Ghim thông báo Hạng & Điểm lên trên cùng
  if (customerMe) {
    displayNotifications.unshift({
      id: "real-tier-info",
      title: t("notifications.tier.infoTitle"),
      message: t("notifications.tier.infoMessage", {
        tier:
          translateDynamic(customerMe.tier, "tier", t) ||
          t("dynamic.tiers.member"),
        points: customerMe.availablePoint ?? customerMe.totalPoint ?? 0,
      }),
      type: "TierUpgrade",
      isRead: false,
      createdAt: new Date().toISOString(),
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleMarkAllAsRead = () => {
    notifications.forEach((n) => {
      if (!n.isRead) {
        markAsRead(n.id);
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto w-full animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:text-white">
            {t("notifications.title")}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {notifications.filter((n) => !n.isRead).length > 0
              ? t('notifications.unreadCount', { count: notifications.filter((n) => !n.isRead).length })
              : t('notifications.allCaughtUp')}
          </p>
        </div>
        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 transition-colors flex items-center gap-1.5 bg-sky-50 hover:bg-sky-100 dark:bg-white/5 dark:hover:bg-white/10 px-4 py-2 rounded-xl shadow-sm border border-sky-100 dark:border-white/5"
          >
            <CheckCheck className="w-4 h-4" />
            {t("notifications.markAllRead")}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {displayNotifications.length === 0 ? (
          <div className="bg-white dark:bg-[#13151A] rounded-[2.5rem] p-12 text-center border border-slate-200 dark:border-white/5 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-white/10">
              <Bell className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              {t("notifications.empty.title")}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
              {t("notifications.empty.description")}
            </p>
          </div>
        ) : (
          displayNotifications.map((notification: NotificationItem) => (
            <div
              key={notification.id}
              className={`relative p-5 rounded-[2rem] border transition-all duration-300 flex gap-4 items-start ${
                notification.isRead
                  ? "bg-white dark:bg-[#13151A] border-gray-100 dark:border-white/5 opacity-75"
                  : "bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-500/20 shadow-sm"
              }`}
            >
              {/* Icon dựa trên trạng thái */}
              <div
                className={`p-3 rounded-xl shrink-0 ${
                  notification.isRead
                    ? "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400"
                    : notification.type === "TierUpgrade" ||
                        notification.type === "Loyalty" ||
                        notification.type === "Points"
                      ? "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400"
                      : "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                }`}
              >
                {notification.type === "Booking" ? (
                  <Clock className="w-5 h-5" />
                ) : notification.type === "TierUpgrade" ||
                  notification.type === "Loyalty" ||
                  notification.type === "Points" ? (
                  <Crown className="w-5 h-5" />
                ) : (
                  <Info className="w-5 h-5" />
                )}
              </div>

              <div className="flex-1 pt-1">
                <div className="flex justify-between items-start gap-2">
                  <h4
                    className={`text-base font-bold tracking-tight ${notification.isRead ? "text-gray-700 dark:text-gray-300" : "text-gray-900 dark:text-white"}`}
                  >
                    {translateNotificationTitle(notification.title, t)}
                  </h4>
                  <span className="text-xs font-medium text-gray-400 dark:text-gray-500 whitespace-nowrap bg-white/50 dark:bg-black/20 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-white/5">
                    {new Date(notification.createdAt).toLocaleString(
                      i18n.language === "en" ? "en-US" : "vi-VN",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      },
                    )}
                  </span>
                </div>
                <p
                  className={`text-sm mt-1.5 leading-relaxed ${notification.isRead ? "text-gray-500 dark:text-gray-400" : "text-gray-700 dark:text-gray-300"}`}
                >
                  {translateNotificationMessage(notification.message, t)}
                </p>
              </div>

              {/* Nút đánh dấu đã đọc */}
              {!notification.isRead && (
                <button
                  onClick={() => {
                    if (
                      notification.id !== "real-tier-info" &&
                      !notification.id.startsWith("redeem-") &&
                      !notification.id.startsWith("earned-")
                    ) {
                      markAsRead(notification.id);
                    }
                  }}
                  className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors mt-1"
                  title={t("notifications.markAsRead")}
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
              )}

              {/* Chấm xanh biểu thị chưa đọc */}
              {!notification.isRead && (
                <span className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-blue-600 dark:bg-blue-500 rounded-full border-2 border-white dark:border-[#111]"></span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
