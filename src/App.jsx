import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import AnalyticsListener from "./components/AnalyticsListener";
import SettingsPage from "./components/pages/SettingsPage.jsx";
import MergePage from "./components/pages/MergePage.jsx";
import StagingPage from "./components/pages/StagingPage.jsx";
import BranchesPage from "./components/pages/BranchesPage.jsx";
import RepositoriesPage from "./components/pages/RepositoriesPage.jsx";
import HistoryPage from "./components/pages/HistoryPage.jsx";
import { initAnalytics } from "./services/analytics.js";
import AuthBootstrap from "./components/auth/AuthBootstrap.jsx";
import LoginPage from "./components/pages/LoginPage.jsx";
import OnboardingPage from "./components/pages/OnboardingPage.jsx";
import OnboardingGate from "./components/auth/OnboardingGate.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";


export default function App() {
    useEffect(() => {
        initAnalytics();
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
                            <Route path="/repositories" element={<RepositoriesPage />} />
                            <Route path="/history" element={<HistoryPage />} />
                            <Route path="/staging" element={<StagingPage />} />
                            <Route path="/branches" element={<BranchesPage />} />
                        </Route>
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/settings" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
