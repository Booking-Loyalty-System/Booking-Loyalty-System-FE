import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './features/products/presentation/pages/LoginPage';
import { RegisterPage } from './features/products/presentation/pages/RegisterPage';
import {AutoWashSimulation} from "@/shared/auto-wash-simulation";
import {ProtectedRoute} from "@/core/guard/ProtectedRoute";
import {CustomerLayout} from "./features/products/presentation/layouts/CustomerLayout";
import {Dashboard} from "@/features/products/presentation/components/Dashboard";
import Membership from "./features/products/presentation/components/LoyaltyTier";
import {RewardsSection} from "@/features/products/presentation/components/RewardsSection";
import {MyVehicles} from "@/features/products/presentation/components/MyVehicle";
import {Promotions} from "@/features/products/presentation/components/Promotion";
import {BookingHistory} from "@/features/products/presentation/components/BookingHistory";
import {ProfileSettings} from "@/features/products/presentation/components/ProfileSettings";
import {NotificationCenter} from "@/features/products/presentation/components/NotificationCenter";
import {Toaster} from "sonner";
import {BookingPage} from "@/features/products/presentation/pages/BookingPage";
import {LiveTrackingPage} from "@/features/products/presentation/pages/LiveTrackingPage";
// import {StaffLayout} from "@/features/products/presentation/layouts/StaffLayout";
// import {StaffDashboard} from "@/features/products/presentation/pages/StaffDashboard";
// import {StaffQueue, QueueMonitor, StaffAssignment} from "@/features/products/presentation/pages/StaffPages";

function App() {
    return (
        <>
            <Toaster richColors position="top-right" />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route element={<CustomerLayout />} >
                        <Route path="/live-tracking/:bookingId" element={<LiveTrackingPage />} />
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

                    <Route element={<ProtectedRoute allowedRoles={['Customer']} />}>
                        <Route element={<CustomerLayout />} >
                            <Route path="/live-tracking/:bookingId" element={<LiveTrackingPage />} />
                            <Route path="/auto-wash-simulation" element={<AutoWashSimulation />} />
                        </Route>
                    </Route>

                    {/* <Route element={<ProtectedRoute allowedRoles={['Staff']} />}>
                        <Route element={<StaffLayout />} >
                            <Route path="/staff/dashboard" element={<StaffDashboard />} />
                            <Route path="/staff/queue" element={<StaffQueue />} />
                            <Route path="/staff/monitor" element={<QueueMonitor />} />
                            <Route path="/staff/assignment" element={<StaffAssignment />} />
                            <Route path="/staff/settings" element={<ProfileSettings />} />
                        </Route>
                    </Route> */}

                    {/*<Route element={<ProtectedRoute allowedRoles={['Admin']} />}>*/}
                    {/*    <Route path="/admin/dashboard" element={<AdminDashboard />} />*/}
                    {/*</Route>*/}

                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;