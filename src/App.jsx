import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import AnalyticsListener from "./components/AnalyticsListener";
import SettingsPage from "./components/pages/SettingsPage.jsx";
import MergePage from "./components/pages/MergePage.jsx";
import RepositoriesPage from "./components/pages/RepositoriesPage.jsx";
import HistoryPage from "./components/pages/HistoryPage.jsx";
import { initAnalytics } from "./services/analytics.js";


export default function App() {
    useEffect(() => {
        initAnalytics();
    }, []);

    return (
        <BrowserRouter>
            <AnalyticsListener />
            <Routes>
                {/* Auth (ProtectedRoute/OnboardingGate) wyłączone — brak konfiguracji Firebase w .env. */}
                <Route element={<AppLayout />}>
                    <Route path="/" element={<Navigate to="/settings" replace />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/merge" element={<MergePage />} />
                    <Route path="/repositories" element={<RepositoriesPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/branches" element={<div className="p-10">WIP: Branches</div>} />
                </Route>

                <Route path="*" element={<Navigate to="/settings" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
