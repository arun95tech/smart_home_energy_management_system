/**
 * API service - all fetch calls go through here.
 * Base URL is empty so it works with both the Vite proxy (dev)
 * and the Django server (production build).
 */
const BASE = '/api'

async function request(path, options = {}) {
  const sessionHeaders = {
    'X-User-Id': localStorage.getItem('user_id') || '',
    'X-Role': localStorage.getItem('role') || '',
    'X-Username': localStorage.getItem('username') || '',
  }
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...sessionHeaders, ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || err.error || `HTTP ${res.status}`)
  }
  // Handle 204 No Content
  if (res.status === 204) return null
  return res.json()
}

// Auth
export const login = (credentials) =>
  request('/login/', { method: 'POST', body: JSON.stringify(credentials) })
export const registerHomeowner = (data) =>
  request('/register-homeowner/', { method: 'POST', body: JSON.stringify(data) })
export const changePassword = (data) =>
  request('/change-password/', { method: 'POST', body: JSON.stringify(data) })

// ── User Profiles ──────────────────────────────────────────────────────────
export const getProfiles = () => request('/user-profiles/')
export const patchProfile = (id, data) =>
  request(`/user-profiles/${id}/`, { method: 'PATCH', body: JSON.stringify(data) })

// ── Appliances ─────────────────────────────────────────────────────────────
export const getAppliances = (homeownerId) =>
  request(`/appliances/${homeownerId ? `?homeowner_id=${homeownerId}` : ''}`)
export const createAppliance = (data) =>
  request('/appliances/', { method: 'POST', body: JSON.stringify(data) })
export const patchAppliance = (id, data) =>
  request(`/appliances/${id}/`, { method: 'PATCH', body: JSON.stringify(data) })
export const deleteAppliance = (id) =>
  request(`/appliances/${id}/`, { method: 'DELETE' })

// ── Fault Reports ──────────────────────────────────────────────────────────
export const getFaultReports = () => request('/fault-reports/')
export const markFaultDone = (id) =>
  request(`/fault-reports/${id}/mark-done/`, { method: 'PATCH' })

// ── Energy Usage ───────────────────────────────────────────────────────────
export const getEnergyUsage = (homeownerId) =>
  request(`/energy-usage/${homeownerId ? `?homeowner_id=${homeownerId}` : ''}`)
export const createEnergyUsage = (data) =>
  request('/energy-usage/', { method: 'POST', body: JSON.stringify(data) })
export const getEnergyUsageSessions = (homeownerId) =>
  request(`/energy-usage-sessions/${homeownerId ? `?homeowner_id=${homeownerId}` : ''}`)
export const getDailyBills = (homeownerId) =>
  request(`/daily-bills/${homeownerId ? `?homeowner_id=${homeownerId}` : ''}`)

// ── Pricing Plans ──────────────────────────────────────────────────────────
export const getPricingPlans = () => request('/pricing-plans/')
export const createPricingPlan = (data) =>
  request('/pricing-plans/', { method: 'POST', body: JSON.stringify(data) })
export const deletePricingPlan = (id) =>
  request(`/pricing-plans/${id}/`, { method: 'DELETE' })
export const calculateCost = (data) =>
  request('/calculate-cost/', { method: 'POST', body: JSON.stringify(data) })

// ── Notifications ──────────────────────────────────────────────────────────
export const getNotifications = (recipientId) =>
  request(`/notifications/${recipientId ? `?recipient_id=${recipientId}` : ''}`)
export const markNotificationRead = (id) =>
  request(`/notifications/${id}/mark-read/`, { method: 'PATCH' })
export const deleteNotification = (id) =>
  request(`/notifications/${id}/`, { method: 'DELETE' })

// ── Recommendations ────────────────────────────────────────────────────────
export const getRecommendations = (homeownerId) =>
  request(`/recommendations/${homeownerId ? `?homeowner_id=${homeownerId}` : ''}`)
export const createRecommendation = (data) =>
  request('/recommendations/', { method: 'POST', body: JSON.stringify(data) })
export const deleteRecommendation = (id) =>
  request(`/recommendations/${id}/`, { method: 'DELETE' })

// ── Dashboard ──────────────────────────────────────────────────────────────
export const getDashboardSummary = (homeownerId) =>
  request(`/dashboard-summary/${homeownerId}/`)
export const getAdminDashboardSummary = () =>
  request('/admin-dashboard-summary/')
