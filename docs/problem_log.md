# Problem Log - Smart Home Energy Management System

## Purpose

This log records issues encountered during development, their causes, and the solutions applied. It demonstrates how implementation problems were identified, investigated, and resolved.

## Issue History

# 01
- Problem: A backend app could not be loaded correctly after initial app registration.
- Cause: The recommendations app name was referenced inconsistently during setup.
- Solution: The app name and route registration were checked and corrected so Django could load the app successfully.
- Status: Resolved

# 02
- Problem: Backend API testing could not begin because the database tables were missing.
- Cause: Django migrations had been created but not applied to the SQLite database.
- Solution: The migration command was run, creating the required database tables.
- Status: Resolved

# 03
- Problem: Frontend API calls initially did not match the backend URL structure.
- Cause: Some frontend calls used paths that were not aligned with the final flat `/api/...` route structure.
- Solution: The API service was centralised in `frontend/src/services/api.js` and updated to use the current backend endpoints.
- Status: Resolved

# 04
- Problem: Circular import errors occurred between appliance logic and notification logic.
- Cause: Appliance fault handling needed notification creation, while the notification observer also needed appliance and fault report models.
- Solution: Imports that caused the circular dependency were moved inside the relevant functions so they run only when needed.
- Status: Resolved

# 05
- Problem: Login details on the frontend did not match the users available in the backend database.
- Cause: Demo credentials and seeded credentials changed during development.
- Solution: The setup command and README credentials were updated to match the current admin, homeowner, and technician accounts.
- Status: Resolved

# 06
- Problem: Role-specific pages could be reached by users with the wrong role during early frontend testing.
- Cause: Initial routing did not fully redirect users based on their stored role.
- Solution: A `ProtectedRoute` component was added in `App.jsx` to redirect users away from pages that are not valid for their role.
- Status: Resolved

# 07
- Problem: API write operations needed stronger role checks than the frontend alone could provide.
- Cause: Frontend role-based controls improve the user experience, but API endpoints still need their own validation.
- Solution: Role checks were added in key ViewSets and API views, including appliance writes, pricing plan writes, fault completion, profile updates, and recommendation management.
- Status: Resolved

# 08
- Problem: React routes did not work correctly when the browser was refreshed after building the frontend.
- Cause: Django initially served backend routes, but React client-side routes also needed to return `index.html`.
- Solution: A catch-all route was added in `core.urls` for non-API and non-admin paths, allowing React Router to handle frontend routes.
- Status: Resolved

# 09
- Problem: API endpoints needed to remain available after adding the React catch-all route.
- Cause: A broad frontend catch-all can accidentally intercept API paths if it is not restricted.
- Solution: The catch-all route was configured to exclude `/api/` and `/admin/`, keeping backend and frontend routing separate.
- Status: Resolved

# 10
- Problem: The project needed realistic documentation rather than only brief development notes.
- Cause: Early documentation was written as working notes and did not fully reflect the final implementation.
- Solution: The progress report, testing log, problem log, and reflection notes were revised to match the current project and use a clearer academic style.
- Status: Resolved

## Summary

Most issues were caused by normal full-stack integration challenges: route alignment, database setup, role handling, circular imports, and deployment routing. Each issue was resolved through incremental testing and by separating responsibilities between backend APIs, frontend routing, and documentation.
