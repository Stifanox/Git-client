import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import AnalyticsListener from "./components/AnalyticsListener";
import SettingsPage from "./components/pages/SettingsPage.jsx";
import MergePage from "./components/pages/MergePage.jsx";


export default function App() {
    useEffect(() => {
        // Inicjalizacja usług analitycznych i hotjar
    }, []);

    return (
        <BrowserRouter>
            <AnalyticsListener />
            <Routes>
                {/* Wszystkie podstrony zamknięte w AppLayout */}
                <Route element={<AppLayout />}>
                    {/* Przekierowanie roota na settings (tylko do testów) */}
                    <Route path="/" element={<Navigate to="/settings" replace />} />

                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/merge" element={<MergePage />} />
                    <Route path="/repositories" element={<div className="p-10">WIP: Repositories</div>} />
                    <Route path="/branches" element={<div className="p-10">WIP: Branches</div>} />
                    {/* ... reszta tras ... */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}