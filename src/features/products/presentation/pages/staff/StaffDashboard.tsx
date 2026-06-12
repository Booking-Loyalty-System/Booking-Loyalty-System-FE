import { useState } from "react";
import { Layout } from "../../components/layout/Layout";
import {
  CheckCircle,
  Clock,
  Car,
  User,
  Calendar,
  Award,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

const todayBookings = [
  {
    id: "BK12350",
    customer: "John Doe",
    tier: "Gold",
    licensePlate: "ABC-1234",
    vehicle: "ABC-1234",
    service: "Premium Wash",
    time: "10:00 AM",
    status: "In Progress",
    phone: "+1 234-567-8900",
  },
  {
    id: "BK12351",
    customer: "Jane Smith",
    tier: "Platinum",
    licensePlate: "XYZ-5678",
    vehicle: "XYZ-5678",
    service: "Basic Wash",
    time: "11:00 AM",
    status: "Waiting",
    phone: "+1 234-567-8901",
  },
  {
    id: "BK12352",
    customer: "Mike Johnson",
    tier: "Silver",
    licensePlate: "DEF-9012",
    vehicle: "DEF-9012",
    service: "Ceramic Wash",
    time: "12:00 PM",
    status: "Waiting",
    phone: "+1 234-567-8902",
  },
  {
    id: "BK12353",
    customer: "Sarah Williams",
    tier: "Gold",
    licensePlate: "GHI-3456",
    vehicle: "GHI-3456",
    service: "Premium Wash",
    time: "01:00 PM",
    status: "Scheduled",
    phone: "+1 234-567-8903",
  },
  {
    id: "BK12354",
    customer: "Tom Brown",
    tier: "Member",
    licensePlate: "JKL-7890",
    vehicle: "JKL-7890",
    service: "Basic Wash",
    time: "02:00 PM",
    status: "Scheduled",
    phone: "+1 234-567-8904",
  },
];

export function StaffDashboard() {
  const [completingBooking, setCompletingBooking] = useState<string | null>(
    null,
  );

  const handleCheckIn = (bookingId: string) => {
    alert(
      `Checked in booking ${bookingId}. Status updated to "In Progress (WashSession Active)"`,
    );
  };

  const handleCompleteWash = (bookingId: string) => {
    setCompletingBooking(bookingId);
    setTimeout(() => {
      alert("Loyalty Engine Triggered: Points added automatically!");
      setCompletingBooking(null);
    }, 1000);
  };

  return (
    <Layout title="Staff Dashboard" userName="Staff Member" role="staff">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-blue-600" />
            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
              Today
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">12</p>
          <p className="text-sm text-gray-600">Total Bookings</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">7</p>
          <p className="text-sm text-gray-600">Completed</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">3</p>
          <p className="text-sm text-gray-600">In Progress</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Car className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">2</p>
          <p className="text-sm text-gray-600">Waiting</p>
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">Current Time</p>
            <p className="text-2xl font-bold">10:45 AM</p>
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">Next Booking</p>
            <p className="text-2xl font-bold">11:00 AM</p>
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">Bay Status</p>
            <p className="text-2xl font-bold">2/4 Active</p>
          </div>
        </div>
      </div>

      {/* Today's Booking Queue */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              Today's Booking Queue
            </h3>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Refresh
              </button>
            </div>
          </div>
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
                  Customer Tier
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
                          onClick={() => handleCompleteWash(booking.id)}
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

      {/* Service Bays Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white rounded-xl p-6 border-2 border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Bay 1</h4>
            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
              Active
            </span>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Vehicle: ABC-1234</p>
            <p>Service: Premium Wash</p>
            <p>Time Left: 25 mins</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Bay 2</h4>
            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
              Active
            </span>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Vehicle: XYZ-5678</p>
            <p>Service: Ceramic Wash</p>
            <p>Time Left: 45 mins</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Bay 3</h4>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
              Available
            </span>
          </div>
          <div className="text-sm text-gray-600">
            <p>Ready for next vehicle</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Bay 4</h4>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
              Available
            </span>
          </div>
          <div className="text-sm text-gray-600">
            <p>Ready for next vehicle</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
