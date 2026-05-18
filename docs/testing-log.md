# Testing Log - Smart Home Energy Management System

## Purpose

This log records the main checks completed for the Smart Home Energy Management System. The project currently uses manual testing and smoke testing rather than a full automated test suite.

## Test History

# 01
- Test: Django system check
- Result: `python manage.py check` completed successfully with no issues found.
- Status: Passed

# 02
- Test: Frontend production build
- Result: React Vite frontend build completed successfully.
- Status: Passed

# 03
- Test: Login and role redirection
- Result: Homeowner, admin, and technician users were redirected to their correct dashboard pages after login.
- Status: Passed

# 04
- Test: Invalid login
- Result: Invalid login details showed an error message and did not redirect the user.
- Status: Passed

# 05
- Test: Homeowner appliance management
- Result: A homeowner could add, update, turn on, turn off, mark faulty, and delete their own appliances.
- Status: Passed

# 06
- Test: Appliance ownership validation
- Result: Users could not update or delete appliances that did not belong to them.
- Status: Passed

# 07
- Test: Technician appliance access
- Result: A technician could view appliance information without homeowner edit controls.
- Status: Passed

# 08
- Test: Energy usage logging
- Result: A homeowner could record energy usage for an owned appliance.
- Status: Passed

# 09
- Test: High usage observer
- Result: Energy usage above 10 kWh created a high-usage notification for the homeowner.
- Status: Passed

# 10
- Test: Fault observer
- Result: Marking an appliance as faulty created a fault report and notified technicians.
- Status: Passed

# 11
- Test: Technician fault completion
- Result: A technician could mark a fault as done, and the related appliance status changed back to `ok`.
- Status: Passed

# 12
- Test: Notification read status
- Result: A user could mark notifications as read, and the read state was saved.
- Status: Passed

# 13
- Test: Pricing calculator
- Result: Flat, peak-hour, off-peak, and green-energy pricing calculations returned expected costs.
- Status: Passed

# 14
- Test: Homeowner dashboard
- Result: The homeowner dashboard loaded summary cards, energy data, notifications, and recommendations.
- Status: Passed

# 15
- Test: Admin dashboard
- Result: The admin dashboard loaded system totals, user information, appliance data, and pricing information.
- Status: Passed

# 16
- Test: Technician dashboard
- Result: The technician dashboard loaded fault and maintenance summary information.
- Status: Passed

# 17
- Test: Admin user management
- Result: An admin could view user profiles and update membership or plan fields.
- Status: Passed

# 18
- Test: Admin appliance monitoring
- Result: An admin could view appliances across homeowners in read-only mode.
- Status: Passed

# 19
- Test: Appliance category report
- Result: The admin category report displayed appliance category counts and summary information.
- Status: Passed

# 20
- Test: Billing page
- Result: A homeowner could view appliance usage sessions and daily bill information.
- Status: Passed

# 21
- Test: Profile page
- Result: A logged-in user could view profile details and update their password.
- Status: Passed

# 22
- Test: Protected frontend routes
- Result: Users were redirected away from pages that were not allowed for their role.
- Status: Passed

# 23
- Test: API endpoint smoke check
- Result: The main endpoints under `/api/` responded correctly during manual testing.
- Status: Passed

# 24
- Test: Django serving React build
- Result: Django served the built React frontend successfully after `npm run build`.
- Status: Passed

# 25
- Test: React route refresh through Django
- Result: Refreshing frontend routes loaded the React app rather than a 404 page.
- Status: Passed

# 26
- Test: API routes separated from React catch-all
- Result: `/api/...` routes returned API responses rather than the React frontend.
- Status: Passed

## Tested Endpoints

- `/api/login/`
- `/api/register-homeowner/`
- `/api/change-password/`
- `/api/user-profiles/`
- `/api/appliances/`
- `/api/appliance-schedules/`
- `/api/fault-reports/`
- `/api/fault-reports/<id>/mark-done/`
- `/api/energy-usage/`
- `/api/energy-usage-sessions/`
- `/api/daily-bills/`
- `/api/pricing-plans/`
- `/api/calculate-cost/`
- `/api/notifications/`
- `/api/notifications/<id>/mark-read/`
- `/api/recommendations/`
- `/api/dashboard-summary/<homeowner_id>/`
- `/api/admin-dashboard-summary/`

## Testing Limitations

- The current project does not include a formal automated test suite.
- Manual API tests depend on request headers used by the frontend service: `X-User-Id`, `X-Role`, and `X-Username`.
- Further work should add Django unit tests, API integration tests, and frontend component tests.
