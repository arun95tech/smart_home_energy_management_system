# Reflection Notes - Smart Home Energy Management System

## Purpose

This reflection reviews the development of the Smart Home Energy Management System, including successful outcomes, technical challenges, limitations, and future improvements.

## What Went Well

### Full-Stack Integration

The project successfully combines a Django REST Framework backend with a React frontend. The API service in `frontend/src/services/api.js` centralises HTTP requests, which made it easier to keep frontend pages aligned with backend endpoints. Serving the production React build through Django also simplified demonstration because the completed system can run from the Django server.

### Role-Based Workflows

The three user roles are clearly separated:

- Homeowners manage appliances, record energy usage, view billing information, and receive recommendations.
- Admins manage users, pricing plans, appliance monitoring, and system-wide reports.
- Technicians view appliance information and resolve fault reports.

This role separation gives the project a realistic structure and demonstrates how different users can interact with the same system in different ways.

### Design Pattern Implementation

Four design patterns were implemented in practical areas of the system:

- Factory Pattern: `appliances/factory.py` creates default appliance data based on appliance type.
- Observer Pattern: `notifications/observers.py` creates notifications when high energy usage or appliance faults occur.
- Strategy Pattern: `pricing/strategies.py` supports different pricing calculations for flat, peak-hour, and green-energy plans.
- Singleton Pattern: `dashboard/energy_manager.py` centralises dashboard aggregation logic in one shared manager instance.

These patterns were not added only for theory. Each one supports a real part of the application and keeps related logic separated from views and components.

### Frontend Usability

The React interface provides separate dashboards and navigation for each role. Reusable components such as dashboard cards, charts, notification boxes, and recommendation cards helped keep the frontend organised. React Router protected routes also improved the user experience by redirecting users away from pages that do not match their role.

## Challenges Faced

### Circular Imports

One of the main backend issues was a circular import between appliance fault handling and notification creation. This happened because fault reports belong to the appliances app, while notification creation belongs to the notifications app. The issue was resolved by using local imports inside functions where the dependency is needed.

### Route Alignment

The frontend and backend route structure changed during development. Some early API calls did not match the final `/api/...` endpoints. This was resolved by centralising frontend API calls in `api.js` and checking them against Django URL configuration.

### Role and Permission Handling

The project uses a lightweight session approach based on frontend `localStorage` and request headers. This was suitable for a student project and allowed role-based behaviour to be demonstrated clearly. However, it also required additional role checks inside API views to reduce reliance on frontend controls alone.

### Single-Server React Deployment

Serving React through Django required careful routing. The backend had to serve `index.html` for frontend routes while still preserving `/api/` and `/admin/` paths for Django. This was resolved with a catch-all route that excludes API and admin URLs.

## Limitations

### Authentication

The current system is not production-grade authentication. It stores session-related values in `localStorage` and sends user information through request headers. A production system should use Django sessions, token authentication, or JWT authentication with proper server-side validation.

### Automated Testing

The project currently uses manual testing and smoke testing. This is enough to demonstrate the main workflows, but it does not provide the confidence of a complete automated test suite. Future work should include backend unit tests, API integration tests, and frontend tests.

### Scalability

The system uses SQLite and returns records without pagination. This is acceptable for a development and demonstration project, but a larger deployment would need pagination, indexing, search, and a production database such as PostgreSQL.

### Real-Time Behaviour

Notifications are fetched through API requests rather than pushed in real time. A production version could use Django Channels or another WebSocket solution to deliver high-usage alerts and technician notifications immediately.

## Key Learning Outcomes

1. Django REST Framework reduces backend boilerplate through serializers, routers, and ViewSets.
2. React Router makes role-based navigation clear when combined with protected route components.
3. Design patterns are most useful when they solve a specific implementation problem rather than being added artificially.
4. Full-stack development requires consistent route design, data formats, and responsibility separation.
5. Documentation is most valuable when it records not only what was built, but also the technical decisions, problems, and limitations.

## Future Improvements

- Add Django authentication or token-based authentication.
- Add a formal automated test suite.
- Improve chart data by grouping real usage records by day, week, and month.
- Add pagination and filtering for larger datasets.
- Add stronger deployment settings, including environment variables and production static file handling.
- Add real-time notification delivery for appliance faults and high usage.
