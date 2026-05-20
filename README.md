# Smart Home Energy Management System

## Project Overview

The Smart Home Energy Management System is a full-stack web application developed for a software engineering coursework project. It allows homeowners to monitor appliances and energy usage, administrators to manage users and pricing information, and technicians to respond to appliance fault reports.

The system is built with Django REST Framework for the backend API and React with Vite for the frontend interface.

## Main User Roles

### Homeowner
- Register and log in as a homeowner.
- View a personal energy dashboard.
- Add, update, delete, and monitor appliances.
- Record energy usage for owned appliances.
- View usage sessions and daily billing information.
- Receive high-usage and appliance fault notifications.
- View and manage energy-saving recommendations.

### Administrator
- View system-wide dashboard information.
- Manage user profiles, membership status, and plan details.
- Manage pricing plans and use the cost calculator.
- Monitor appliances across homeowners in read-only mode.
- View appliance category reports.
- View fault reports and notifications.

### Technician
- View technician dashboard summaries.
- Monitor appliance information in read-only mode.
- View fault alerts.
- Mark fault reports as completed.
- Reset appliance status to `ok` after maintenance.

## Technology Stack

| Layer | Technology |
| --- | --- |
| Backend | Django, Django REST Framework |
| Frontend | React, Vite |
| Routing | React Router |
| Charts | Chart.js, react-chartjs-2 |
| Database | SQLite |
| Styling | CSS |

## Design Patterns

| Pattern | File | Purpose |
| --- | --- | --- |
| Factory | `backend/appliances/factory.py` | Creates default appliance data based on appliance type. |
| Observer | `backend/notifications/observers.py` | Creates notifications when high usage or faults occur. |
| Strategy | `backend/pricing/strategies.py` | Supports different electricity cost calculation methods. |
| Singleton | `backend/dashboard/energy_manager.py` | Centralises dashboard aggregation logic. |

## Setup Instructions

### Backend

```bash
cd backend
python -m venv venv
```

Activate the virtual environment.

Windows:

```bash
venv\Scripts\activate
```

macOS/Linux:

```bash
source venv/bin/activate
```

Install dependencies and prepare the database.

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py setup_real_credentials
python manage.py seed_homeowner_data
```

Run the backend:

```bash
python manage.py runserver
```

### Frontend Development Server

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend development server runs at:

```text
http://localhost:5173
```

## Single-Server Run

The completed React frontend can be built and served through Django.

```bash
cd frontend
npm install
npm run build
```

Then start Django:

```bash
cd ../backend
python manage.py runserver
```

Open:

```text
http://127.0.0.1:8000/
```

## Login Credentials

| Role | Username | Password |
| --- | --- | --- |
| Homeowner | `Arun` | `arun@123` |
| Admin | `admin` | `admin@123` |
| Technician | `technician` | `tech@123` |

Homeowners can also create an account from the registration page.

## Main API Endpoints

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/login/` | POST | User login |
| `/api/register-homeowner/` | POST | Homeowner registration |
| `/api/change-password/` | POST | Password change |
| `/api/user-profiles/` | GET, PATCH | User profile management |
| `/api/appliances/` | GET, POST | Appliance listing and creation |
| `/api/appliances/<id>/` | PATCH, DELETE | Appliance update and deletion |
| `/api/appliance-schedules/` | GET, POST | Appliance schedules |
| `/api/fault-reports/` | GET, POST | Fault reports |
| `/api/fault-reports/<id>/mark-done/` | PATCH | Mark fault as completed |
| `/api/energy-usage/` | GET, POST | Energy usage records |
| `/api/energy-usage-sessions/` | GET | Appliance usage sessions |
| `/api/daily-bills/` | GET | Daily bill records |
| `/api/pricing-plans/` | GET, POST, PATCH, DELETE | Pricing plans |
| `/api/calculate-cost/` | POST | Strategy-based cost calculation |
| `/api/notifications/` | GET, DELETE | Notifications |
| `/api/notifications/<id>/mark-read/` | PATCH | Mark notification as read |
| `/api/recommendations/` | GET, POST, DELETE | Recommendations |
| `/api/dashboard-summary/<homeowner_id>/` | GET | Homeowner dashboard summary |
| `/api/admin-dashboard-summary/` | GET | Admin dashboard summary |

## Project Structure

```text
Smart_Home_Energy_Management_System/
  backend/
    manage.py
    requirements.txt
    core/
    accounts/
    appliances/
    energy/
    pricing/
    notifications/
    recommendations/
    dashboard/
  frontend/
    src/
      components/
      pages/
      services/
      App.jsx
      index.css
    dist/
    package.json
    vite.config.js
  docs/
    progress_report.md
    problem_log.md
    test_log.md
    reflection-notes.md
    diagrams/
```

## Testing

The project has been checked using:

```bash
python manage.py check
npm run build
```

Manual testing was also completed for login, role-based navigation, appliance management, energy usage, pricing calculation, notifications, fault handling, dashboards, and the Django-served React build.

## Limitations

- The current authentication approach is suitable for demonstration but not production.
- The project uses SQLite and development settings.
- The testing approach is mainly manual and should be extended with automated tests.
- Real-time notifications are not implemented.

## Documentation

Further documentation is available in the `docs/` folder:

- `progress_report.md`
- `problem_log.md`
- `test_log.md`
- `reflection-notes.md`

Project diagrams are available in `docs/diagrams/`:

- `system-architecture.jpg`
- `role-workflows.jpg`
- `design-patterns.jpg`
- `api-data-flow.jpg`
