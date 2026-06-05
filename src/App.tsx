import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './features/products/presentation/pages/LoginPage';
import { RegisterPage } from './features/products/presentation/pages/RegisterPage';
import {AutoWashSimulation} from "@/shared/auto-wash-simulation.tsx";
import {ProtectedRoute} from "@/core/guard/ProtectedRoute.tsx";
import {CustomerLayout} from "./features/products/presentation/layouts/CustomerLayout.tsx";
import {BookWash} from "@/features/products/presentation/components/BookWash.tsx";
import {Dashboard} from "@/features/products/presentation/components/Dashboard.tsx";
import Membership from "./features/products/presentation/components/LoyaltyTier.tsx";
import {RewardsSection} from "@/features/products/presentation/components/RewardsSection.tsx";
import {MyVehicles} from "@/features/products/presentation/components/MyVehicle.tsx";
import {Promotions} from "@/features/products/presentation/components/Promotion.tsx";
import {BookingHistory} from "@/features/products/presentation/components/BookingHistory.tsx";
import {ProfileSettings} from "@/features/products/presentation/components/ProfileSettings.tsx";
import {NotificationCenter} from "@/features/products/presentation/components/NotificationCenter.tsx";
import {Toaster} from "sonner";

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
                        <Route path="/live-tracking-test" element={<AutoWashSimulation />} />
                        <Route path="/book-wash" element={<BookWash />} />
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
                            <Route path="/live-tracking" element={<AutoWashSimulation />} />
                            <Route path="/auto-wash-simulation" element={<AutoWashSimulation />} />
                        </Route>
                    </Route>

                    {/*<Route element={<ProtectedRoute allowedRoles={['Staff', 'Admin']} />}>*/}
                    {/*    <Route path="/staff/dashboard" element={<StaffDashboard />} />*/}
                    {/*</Route>*/}

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