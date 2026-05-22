# Progress Report - Smart Home Energy Management System

## Purpose

This report summarises the development progress of the Smart Home Energy Management System. The project is a full-stack web application built with Django REST Framework and React. It supports three user roles: homeowner, administrator, and technician.

## Development Summary

### 1. Project Setup
- Created the project folder structure for backend, frontend, and documentation.
- Created the initial README and supporting documentation files.
- Configured the Django backend project and installed the required dependencies.
- Added `.gitignore` rules for environment files, database files, dependency folders, cache files, and generated build output.
- Confirmed the backend configuration with `python manage.py check`.

### 2. Backend Application Structure
- Created and registered the main Django apps:
  - `accounts`
  - `appliances`
  - `energy`
  - `pricing`
  - `notifications`
  - `recommendations`
  - `dashboard`
- Connected all app routes through the main `core.urls` file under the `/api/` prefix.
- Created serializers and ViewSets for the main database models.
- Applied database migrations successfully.

### 3. Accounts and Role Management
- Implemented `UserProfile` to extend Django users with role and membership information.
- Added roles for homeowner, admin, and technician.
- Implemented login, homeowner registration, and password change endpoints.
- Added role-aware API behaviour using request headers from the frontend service.
- Added admin profile management for membership status and plan information.

### 4. Appliance and Fault Management
- Implemented appliance models, schedules, and fault reports.
- Added homeowner appliance CRUD operations.
- Added technician fault completion using `/api/fault-reports/<id>/mark-done/`.
- Added status handling for on, off, faulty, and ok appliance states.
- Implemented the Factory Pattern in `appliances/factory.py` to generate sensible appliance defaults.

### 5. Energy Usage and Billing
- Implemented energy usage records.
- Added appliance usage session tracking when appliances are turned on and off.
- Added daily bill records for homeowner billing summaries.
- Added filtering so homeowners view their own usage data.
- Added high-usage detection for usage above 10 kWh.

### 6. Pricing and Cost Calculation
- Implemented pricing plans and the `/api/calculate-cost/` endpoint.
- Implemented the Strategy Pattern in `pricing/strategies.py`:
  - Flat rate pricing
  - Peak-hour pricing
  - Green-energy pricing
- Added peak-hour and off-peak multipliers.
- Added plan discount and green-energy discount calculations.

### 7. Notifications and Recommendations
- Implemented notification records and read status updates.
- Implemented recommendation records for homeowner energy-saving advice.
- Implemented the Observer Pattern in `notifications/observers.py`:
  - High usage creates a homeowner notification.
  - Faulty appliances create fault reports and technician notifications.

### 8. Dashboard Features
- Implemented homeowner dashboard summary data.
- Implemented admin dashboard summary data.
- Implemented the Singleton Pattern in `dashboard/energy_manager.py` to centralise dashboard aggregation logic.

### 9. Frontend Implementation
- Created the React frontend using Vite.
- Added React Router routes for all main pages.
- Centralised API requests in `frontend/src/services/api.js`.
- Implemented role-aware navigation through `Sidebar.jsx`.
- Built pages for:
  - Login and registration
  - Homeowner dashboard
  - Admin dashboard
  - Technician dashboard
  - Appliances
  - Energy usage
  - Billing
  - Pricing plans
  - Notifications
  - Recommendations
  - Fault alerts
  - Admin users
  - Admin appliances
  - Appliance category report
  - Admin fault overview
  - Profile

### 10. Styling and Build Integration
- Implemented the main application styling in `frontend/src/index.css`.
- Built reusable frontend components for dashboard cards, charts, notifications, and recommendation cards.
- Configured Django to serve the built React frontend from `frontend/dist`.
- Added a catch-all route so React pages work after browser refresh.
- Confirmed the frontend production build with `npm run build`.

### 11. Documentation and Diagrams
- Added academic project documentation for progress, testing, problems, reflection, and diagram justification.
- Added required analysis and design diagrams:
  - Use Case Diagram
  - Class Diagram
  - Entity Relationship Diagram
- Added supporting diagrams for system architecture, role workflows, design patterns, and API data flow.
- Stored the diagram JPG files in `docs/diagrams/`.

## Current Project Status

The main development tasks are complete. The application supports role-based workflows, REST API communication, frontend routing, dashboard summaries, design pattern demonstrations, required design diagrams, and a single-server deployment approach through Django.

## Remaining Improvement Opportunities

- Replace the current lightweight header-based session approach with Django session authentication or token-based authentication.
- Add a formal automated test suite using Django tests and frontend component tests.
- Add pagination and search for larger datasets.
- Improve chart data aggregation for long-term usage reporting.
- Add production environment settings for security, static file handling, and deployment.
