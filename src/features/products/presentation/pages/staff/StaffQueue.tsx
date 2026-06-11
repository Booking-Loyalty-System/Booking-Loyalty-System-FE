import { useState } from "react";
import { Layout } from "../../../../../shared/components/layout/Layout";
import {
  Car,
  Clock,
  CheckCircle,
  PlayCircle,
  Sparkles,
  Award,
  X,
  DollarSign,
} from "lucide-react";

const todayBookings = [
  {
    id: "BK12350",
    customer: "John Doe",
    tier: "Gold",
    licensePlate: "ABC-1234",
    service: "Premium Wash",
    time: "10:00 AM",
    status: "In Progress",
    phone: "+1 234-567-8900",
    bay: "Bay 1",
  },
  {
    id: "BK12351",
    customer: "Jane Smith",
    tier: "Platinum",
    licensePlate: "XYZ-5678",
    service: "Basic Wash",
    time: "11:00 AM",
    status: "Waiting",
    phone: "+1 234-567-8901",
    bay: null,
  },
  {
    id: "BK12352",
    customer: "Mike Johnson",
    tier: "Silver",
    licensePlate: "DEF-9012",
    service: "Ceramic Wash",
    time: "12:00 PM",
    status: "Waiting",
    phone: "+1 234-567-8902",
    bay: null,
  },
  {
    id: "BK12353",
    customer: "Sarah Williams",
    tier: "Gold",
    licensePlate: "GHI-3456",
    service: "Premium Wash",
    time: "01:00 PM",
    status: "Scheduled",
    phone: "+1 234-567-8903",
    bay: null,
  },
  {
    id: "BK12354",
    customer: "Tom Brown",
    tier: "Member",
    licensePlate: "JKL-7890",
    service: "Basic Wash",
    time: "02:00 PM",
    status: "Scheduled",
    phone: "+1 234-567-8904",
    bay: null,
  },
];

export function StaffQueue() {
  const [completingBooking, setCompletingBooking] = useState<string | null>(
    null,
  );
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    bookingId: "",
    customer: "",
    tier: "",
    service: "",
    price: 0,
    discount: 0,
    total: 0,
    pointsEarned: 0,
  });

  const handleCheckIn = (bookingId: string) => {
    alert(
      `Checked in booking ${bookingId}. Status updated to "In Progress (WashSession Active)"`,
    );
  };

  const handleCompleteWash = (
    bookingId: string,
    customer: string,
    tier: string,
    service: string,
  ) => {
    setCompletingBooking(bookingId);

    // Calculate pricing based on service
    const servicePrices: { [key: string]: number } = {
      "Basic Wash": 25,
      "Premium Wash": 45,
      "Ceramic Wash": 85,
    };

    const tierMultipliers: { [key: string]: number } = {
      Member: 1,
      Silver: 1.5,
      Gold: 2,
      Platinum: 3,
    };

    const price = servicePrices[service] || 45;
    const discounts: { [key: string]: number } = {
      Member: 0.05,
      Silver: 0.1,
      Gold: 0.15,
      Platinum: 0.2,
    };

    const discount = price * (discounts[tier] || 0);
    const total = price - discount;
    const pointsEarned = (total / 1000) * (tierMultipliers[tier] || 1);

    setCheckoutData({
      bookingId,
      customer,
      tier,
      service,
      price,
      discount,
      total,
      pointsEarned: parseFloat(pointsEarned.toFixed(2)),
    });

    setTimeout(() => {
      setCompletingBooking(null);
      setShowCheckout(true);
    }, 1000);
  };

  const inProgressCount = todayBookings.filter(
    (b) => b.status === "In Progress",
  ).length;
  const waitingCount = todayBookings.filter(
    (b) => b.status === "Waiting",
  ).length;
  const scheduledCount = todayBookings.filter(
    (b) => b.status === "Scheduled",
  ).length;

  return (
    <Layout title="Today's Queue" userName="Staff Member" role="staff">
      {/* Queue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Car className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {todayBookings.length}
          </p>
          <p className="text-sm text-gray-600">Total Today</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <PlayCircle className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {inProgressCount}
          </p>
          <p className="text-sm text-gray-600">In Progress</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {waitingCount}
          </p>
          <p className="text-sm text-gray-600">Waiting</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {scheduledCount}
          </p>
          <p className="text-sm text-gray-600">Scheduled</p>
        </div>
      </div>

      {/* Booking Queue Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Booking Queue</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Booking ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Tier
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  License Plate
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Service
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Time
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Bay
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {todayBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <code className="text-sm font-semibold text-blue-600">
                      {booking.id}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {booking.customer}
                      </p>
                      <p className="text-xs text-gray-500">{booking.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                        booking.tier === "Platinum"
                          ? "bg-purple-100 text-purple-700"
                          : booking.tier === "Gold"
                            ? "bg-yellow-100 text-yellow-700"
                            : booking.tier === "Silver"
                              ? "bg-gray-200 text-gray-700"
                              : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      <Award className="w-3 h-3" />
                      {booking.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {booking.licensePlate}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">
                      {booking.service}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {booking.time}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {booking.bay ? (
                      <span className="text-sm font-medium text-orange-600">
                        {booking.bay}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        booking.status === "In Progress"
                          ? "bg-orange-100 text-orange-700"
                          : booking.status === "Waiting"
                            ? "bg-yellow-100 text-yellow-700"
                            : booking.status === "Scheduled"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {booking.status === "Scheduled" && (
                        <button
                          onClick={() => handleCheckIn(booking.id)}
                          className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Check In
                        </button>
                      )}
                      {booking.status === "Waiting" && (
                        <button className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors">
                          Start Wash
                        </button>
                      )}
                      {booking.status === "In Progress" && (
                        <button
                          onClick={() =>
                            handleCompleteWash(
                              booking.id,
                              booking.customer,
                              booking.tier,
                              booking.service,
                            )
                          }
                          disabled={completingBooking === booking.id}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          <Sparkles className="w-3 h-3" />
                          Complete
                        </button>
                      )}
                      <button className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs rounded-lg hover:bg-gray-50 transition-colors">
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Checkout Summary Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Checkout Summary
              </h3>
              <button
                onClick={() => setShowCheckout(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Booking ID</p>
                <code className="text-lg font-bold text-blue-600">
                  {checkoutData.bookingId}
                </code>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Customer</p>
                <p className="font-semibold text-gray-900">
                  {checkoutData.customer}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600">Tier:</p>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                    checkoutData.tier === "Platinum"
                      ? "bg-purple-100 text-purple-700"
                      : checkoutData.tier === "Gold"
                        ? "bg-yellow-100 text-yellow-700"
                        : checkoutData.tier === "Silver"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-blue-100 text-blue-700"
                  }`}
                >
                  <Award className="w-3 h-3" />
                  {checkoutData.tier}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Service</p>
                <p className="font-semibold text-gray-900">
                  {checkoutData.service}
                </p>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ${checkoutData.price.toFixed(2)}
                  </span>
                </div>
                {checkoutData.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-green-600 text-sm">
                      {checkoutData.tier} Discount
                    </span>
                    <span className="font-semibold text-green-600">
                      -${checkoutData.discount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-bold text-gray-900">Total Price</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${checkoutData.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  <p className="font-semibold text-green-900">
                    Loyalty Points Earned
                  </p>
                </div>
                <p className="text-3xl font-bold text-green-600">
                  {checkoutData.pointsEarned} pts
                </p>
                <p className="text-xs text-green-700 mt-1">
                  Formula: (${checkoutData.total.toFixed(2)} / 1000) ×{" "}
                  {checkoutData.tier} Multiplier
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span className="font-semibold">
                  Loyalty Engine Triggered: Points added automatically!
                </span>
              </p>
            </div>

            <button
              onClick={() => setShowCheckout(false)}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
