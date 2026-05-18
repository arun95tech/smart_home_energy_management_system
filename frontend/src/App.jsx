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
import Register from './pages/Register.jsx'
import Billing from './pages/Billing.jsx'
import Profile from './pages/Profile.jsx'

const DASHBOARDS = {
  homeowner: '/homeowner-dashboard',
  admin: '/admin-dashboard',
  technician: '/technician-dashboard',
}

function ProtectedRoute({ children, roles }) {
  const role = localStorage.getItem('role')
  if (!role) return <Navigate to="/login" replace />
  if (roles && !roles.includes(role)) {
    return <Navigate to={DASHBOARDS[role] || '/login'} replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirects to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Role-specific dashboards */}
        <Route path="/homeowner-dashboard" element={<ProtectedRoute roles={['homeowner']}><HomeownerDashboard /></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/technician-dashboard" element={<ProtectedRoute roles={['technician']}><TechnicianDashboard /></ProtectedRoute>} />

        {/* Shared pages (role-aware behaviour inside the component) */}
        <Route path="/appliances" element={<ProtectedRoute roles={['homeowner', 'technician']}><Appliances /></ProtectedRoute>} />
        <Route path="/energy-usage" element={<ProtectedRoute roles={['homeowner']}><EnergyUsage /></ProtectedRoute>} />
        <Route path="/billing" element={<ProtectedRoute roles={['homeowner']}><Billing /></ProtectedRoute>} />
        <Route path="/pricing-plans" element={<ProtectedRoute roles={['admin']}><PricingPlans /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/recommendations" element={<ProtectedRoute roles={['homeowner']}><Recommendations /></ProtectedRoute>} />
        <Route path="/fault-alerts" element={<ProtectedRoute roles={['technician']}><FaultAlerts /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Admin-only pages */}
        <Route path="/admin-users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin-appliances" element={<ProtectedRoute roles={['admin']}><AdminAppliances /></ProtectedRoute>} />
        <Route path="/appliance-category-report" element={<ProtectedRoute roles={['admin']}><ApplianceCategoryReport /></ProtectedRoute>} />
        <Route path="/admin-fault-overview" element={<ProtectedRoute roles={['admin']}><AdminFaultOverview /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
