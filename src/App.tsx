import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./features/products/presentation/pages/LoginPage";
import { RegisterPage } from "./features/products/presentation/pages/RegisterPage";
import { AutoWashSimulation } from "@/shared/auto-wash-simulation";
import { ProtectedRoute } from "@/core/guard/ProtectedRoute";
import { CustomerLayout } from "./features/products/presentation/layouts/CustomerLayout";
import { Dashboard } from "@/features/products/presentation/pages/customer/Dashboard";
import Membership from "@/features/products/presentation/pages/customer/LoyaltyTier";
import { RewardsSection } from "@/features/products/presentation/pages/customer/RewardsSection";
import { MyVehicles } from "@/features/products/presentation/pages/customer/MyVehicle";
import { Promotions } from "@/features/products/presentation/pages/customer/Promotion";
import { BookingHistory } from "@/features/products/presentation/pages/customer/BookingHistory";
import { ProfileSettings } from "@/features/products/presentation/components/common/ProfileSettings";
import { NotificationCenter } from "@/features/products/presentation/components/common/NotificationCenter";
import { Toaster } from "sonner";
import { BookingPage } from "@/features/products/presentation/pages/customer/BookingPage";
import { LiveTrackingPage } from "@/features/products/presentation/pages/customer/LiveTrackingPage";
import { NotFoundPage } from "@/features/products/presentation/pages/NotFoundPage";

// --- STAFF & ADMIN PAGES ---
import { StaffLayout } from "./features/products/presentation/layouts/StaffLayout";
import { StaffDashboard } from "@/features/products/presentation/pages/staff/StaffDashboard";
import { StaffQueuePage } from "@/features/products/presentation/pages/staff/StaffQueue";
import { QueueMonitor } from "@/features/products/presentation/pages/staff/QueueMonitor";

import { AdminDashboard } from "@/features/products/presentation/pages/admin/AdminDashboard";
import { AdminAnalytics } from "@/features/products/presentation/pages/admin/AdminAnalytics";
import { AdminLoyalty } from "@/features/products/presentation/pages/admin/AdminLoyalty";
import { AdminPackages } from "@/features/products/presentation/pages/admin/AdminPackages";
import { AdminPromotions } from "@/features/products/presentation/pages/admin/AdminPromotions";
import { AdminReports } from "@/features/products/presentation/pages/admin/AdminReports";
import { AdminStaff } from "@/features/products/presentation/pages/admin/AdminStaff";

function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Customer Routes */}
          <Route element={<ProtectedRoute allowedRoles={["Customer"]} />}>
            <Route element={<CustomerLayout />}>
              <Route
                path="/live-tracking/:bookingId"
                element={<LiveTrackingPage />}
              />
              <Route path="/book-wash" element={<BookingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/loyalty-tier" element={<Membership />} />
              <Route path="/rewards" element={<RewardsSection />} />
              <Route path="/my-vehicles" element={<MyVehicles />} />
              <Route path="/booking-history" element={<BookingHistory />} />
              <Route path="/promotions" element={<Promotions />} />
              <Route path="/settings" element={<ProfileSettings />} />
              <Route path="/notifications" element={<NotificationCenter />} />
            </Route>
          </Route>

          {/* Shared Protected Routes (Simulation) */}
          <Route element={<ProtectedRoute allowedRoles={["Customer"]} />}>
            <Route element={<CustomerLayout />}>
              <Route
                path="/auto-wash-simulation"
                element={<AutoWashSimulation />}
              />
            </Route>
          </Route>

          {/* 🌟 STAFF ROUTES 🌟 */}
          <Route element={<ProtectedRoute allowedRoles={["Staff", "Admin"]} />}>
            <Route element={<StaffLayout />}>
              <Route path="/staff/dashboard" element={<StaffDashboard />} />
              <Route path="/staff/queue" element={<StaffQueuePage />} />
              <Route path="/staff/monitor" element={<QueueMonitor />} />
            </Route>
          </Route>

          {/* 🌟 ADMIN ROUTES 🌟 */}
          <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/packages" element={<AdminPackages />} />
            <Route path="/admin/loyalty" element={<AdminLoyalty />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/promotions" element={<AdminPromotions />} />
            <Route path="/admin/staff" element={<AdminStaff />} />
          </Route>

          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
