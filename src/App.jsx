import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import AnalyticsListener from "./components/AnalyticsListener";
import AuthBootstrap from "./components/auth/AuthBootstrap.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import OnboardingGate from "./components/auth/OnboardingGate.jsx";
import LoginPage from "./components/pages/LoginPage.jsx";
import OnboardingPage from "./components/pages/OnboardingPage.jsx";
import SettingsPage from "./components/pages/SettingsPage.jsx";
import MergePage from "./components/pages/MergePage.jsx";


export default function App() {
    useEffect(() => {
        // Inicjalizacja usług analitycznych i hotjar
    }, []);

    return (
        <BrowserRouter>
            <AuthBootstrap />
            <AnalyticsListener />
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route element={<ProtectedRoute />}>
                    <Route element={<OnboardingGate />}>
                        <Route path="/onboarding" element={<OnboardingPage />} />

                        <Route element={<AppLayout />}>
                            <Route path="/" element={<Navigate to="/settings" replace />} />
                            <Route path="/settings" element={<SettingsPage />} />
                            <Route path="/merge" element={<MergePage />} />
                            <Route path="/repositories" element={<div className="p-10">WIP: Repositories</div>} />
                            <Route path="/branches" element={<div className="p-10">WIP: Branches</div>} />
                        </Route>
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/settings" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
