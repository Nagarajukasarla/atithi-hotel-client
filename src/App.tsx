import { Route, Routes } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
import { AuthProvider } from "@/context/auth-context";
import { ToastProvider } from "@/context/toast-context";
import { LoginPage } from "@/pages/auth/login-page";
import { SignupPage } from "@/pages/auth/signup-page";
import { BookingPage } from "@/pages/bookings/booking-page";
import { ManageBookingsPage } from "@/pages/bookings/manage-bookings-page";
import { NotFoundPage } from "@/pages/not-found/not-found-page";
import { OverviewPage } from "@/pages/overview/overview-page";
import { PlansPage } from "@/pages/plans/plans-page";
import { RoomsPage } from "@/pages/rooms/rooms-page";
import { SettingsPage } from "@/pages/settings/settings-page";
import { PaymentsPage } from "@/pages/payments/payments-page";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { PublicOnlyRoute } from "@/routes/PublicOnlyRoute";

export default function App() {
    return (
        <AuthProvider>
            <ToastProvider>
                <Routes>
                    {/* Protected Dashboard Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<AppLayout />}>
                            <Route element={<OverviewPage />} path="/" />
                            <Route element={<OverviewPage />} path="/overview" />
                            <Route element={<BookingPage />} path="/bookings" />
                            <Route element={<ManageBookingsPage />} path="/manage-bookings" />
                            <Route element={<RoomsPage />} path="/rooms" />
                            <Route element={<PaymentsPage />} path="/payments" />
                            <Route element={<SettingsPage />} path="/settings" />
                            <Route element={<PlansPage />} path="/plans" />
                        </Route>
                    </Route>

                    {/* Public Authentication Routes (accessible only when logged out) */}
                    <Route element={<PublicOnlyRoute />}>
                        <Route element={<LoginPage />} path="/login" />
                        <Route element={<SignupPage />} path="/signup" />
                    </Route>

                    {/* Catch-all 404 Route */}
                    <Route element={<NotFoundPage />} path="*" />
                </Routes>
            </ToastProvider>
        </AuthProvider>
    );
}
