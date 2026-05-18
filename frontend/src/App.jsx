import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import HomeownerDashboard from './pages/HomeownerDashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import TechnicianDashboard from './pages/TechnicianDashboard.jsx'
import Appliances from './pages/Appliances.jsx'
import EnergyUsage from './pages/EnergyUsage.jsx'
import PricingPlans from './pages/PricingPlans.jsx'
import Notifications from './pages/Notifications.jsx'
import Recommendations from './pages/Recommendations.jsx'
import FaultAlerts from './pages/FaultAlerts.jsx'
import AdminUsers from './pages/AdminUsers.jsx'
import AdminAppliances from './pages/AdminAppliances.jsx'
import ApplianceCategoryReport from './pages/ApplianceCategoryReport.jsx'
import AdminFaultOverview from './pages/AdminFaultOverview.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirects to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Role-specific dashboards */}
        <Route path="/homeowner-dashboard" element={<HomeownerDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/technician-dashboard" element={<TechnicianDashboard />} />

        {/* Shared pages (role-aware behaviour inside the component) */}
        <Route path="/appliances" element={<Appliances />} />
        <Route path="/energy-usage" element={<EnergyUsage />} />
        <Route path="/pricing-plans" element={<PricingPlans />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/fault-alerts" element={<FaultAlerts />} />

        {/* Admin-only pages */}
        <Route path="/admin-users" element={<AdminUsers />} />
        <Route path="/admin-appliances" element={<AdminAppliances />} />
        <Route path="/appliance-category-report" element={<ApplianceCategoryReport />} />
        <Route path="/admin-fault-overview" element={<AdminFaultOverview />} />
      </Routes>
    </BrowserRouter>
  )
}
