# Smart Home Energy Management System

A full-stack web application for managing smart home energy usage. The system helps homeowners monitor appliances, track consumption, receive notifications, and view energy-saving recommendations. It also provides admin and technician workflows for managing users, pricing plans, appliances, and fault reports.

## Technologies Used

- **Backend:** Django, Django REST Framework
- **Frontend:** React, Vite, React Router
- **Charts:** Chart.js, react-chartjs-2
- **Styling:** Plain CSS
- **Database:** SQLite

## User Roles

### Homeowner

- View personal energy dashboard and usage charts.
- Add, update, delete, and monitor appliances.
- Log energy usage for appliances.
- Receive high-usage warnings and recommendations.
- View personal notifications.

### Admin

- View system-wide dashboard statistics.
- Manage users and account status.
- Manage pricing plans.
- Monitor appliances across all homeowners.
- View category reports, fault summaries, and notifications.

### Technician

- View technician dashboard and fault statistics.
- Check reported appliance faults.
- Mark fault reports as resolved.
- Monitor appliance maintenance status.
- View related notifications.

## Design Patterns Applied

- **Factory Pattern:** Used for creating appliance data based on appliance type.
- **Observer Pattern:** Used for generating notifications when important events happen, such as high energy usage or appliance faults.
- **Strategy Pattern:** Used for pricing plan calculations, allowing different pricing strategies to be handled cleanly.
- **Singleton Pattern:** Used for shared dashboard energy management logic.

## Setup Commands

### Backend

```bash
cd backend
python manage.py migrate
python manage.py runserver
```

After the frontend is built, Django serves both the backend API and the React interface.
Open `http://127.0.0.1:8000/`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

For the single-server demo, build the frontend once:

```bash
cd frontend
npm install
npm run build
cd ../backend
python manage.py runserver
```

## Demo Login Details

- **Admin:** `admin` / `admin@123`
- **Homeowner:** `Arun` / `arun@123`
- **Technician:** `technician` / `tech@123`
