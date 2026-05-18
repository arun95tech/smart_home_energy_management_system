const BASE = "/api"

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || err.error || `HTTP ${res.status}`)
  }

  if (res.status === 204) return null
  return res.json()
}

// User Profiles
export const getProfiles = () => request("/accounts/user-profiles/")
export const patchProfile = (id, data) =>
  request(`/accounts/user-profiles/${id}/`, { method: "PATCH", body: JSON.stringify(data) })

// Appliances
export const getAppliances = (homeownerId) =>
  request(`/appliances/appliances/${homeownerId ? `?homeowner_id=${homeownerId}` : ""}`)
export const createAppliance = (data) =>
  request("/appliances/appliances/", { method: "POST", body: JSON.stringify(data) })
export const patchAppliance = (id, data) =>
  request(`/appliances/appliances/${id}/`, { method: "PATCH", body: JSON.stringify(data) })
export const deleteAppliance = (id) =>
  request(`/appliances/appliances/${id}/`, { method: "DELETE" })

// Fault Reports
export const getFaultReports = () => request("/appliances/fault-reports/")
export const markFaultDone = (id) =>
  request(`/appliances/fault-reports/${id}/mark-done/`, { method: "PATCH" })

// Energy Usage
export const getEnergyUsage = (homeownerId) =>
  request(`/energy/energy-usage/${homeownerId ? `?homeowner_id=${homeownerId}` : ""}`)
export const createEnergyUsage = (data) =>
  request("/energy/energy-usage/", { method: "POST", body: JSON.stringify(data) })

// Pricing Plans
export const getPricingPlans = () => request("/pricing/pricing-plans/")
export const createPricingPlan = (data) =>
  request("/pricing/pricing-plans/", { method: "POST", body: JSON.stringify(data) })
export const deletePricingPlan = (id) =>
  request(`/pricing/pricing-plans/${id}/`, { method: "DELETE" })
export const calculateCost = (data) =>
  request("/pricing/calculate-cost/", { method: "POST", body: JSON.stringify(data) })

// Notifications
export const getNotifications = (recipientId) =>
  request(`/notifications/notifications/${recipientId ? `?recipient_id=${recipientId}` : ""}`)
export const markNotificationRead = (id) =>
  request(`/notifications/notifications/${id}/mark-read/`, { method: "PATCH" })
export const deleteNotification = (id) =>
  request(`/notifications/notifications/${id}/`, { method: "DELETE" })

// Recommendations
export const getRecommendations = (homeownerId) =>
  request(`/recommendations/recommendations/${homeownerId ? `?homeowner_id=${homeownerId}` : ""}`)
export const createRecommendation = (data) =>
  request("/recommendations/recommendations/", { method: "POST", body: JSON.stringify(data) })
export const deleteRecommendation = (id) =>
  request(`/recommendations/recommendations/${id}/`, { method: "DELETE" })

// Dashboard
export const getDashboardSummary = (homeownerId) =>
  request(`/dashboard/dashboard-summary/${homeownerId}/`)
export const getAdminDashboardSummary = () =>
  request("/dashboard/admin-dashboard-summary/")
