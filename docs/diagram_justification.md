# Diagram Justification - Smart Home Energy Management System

## Purpose

This document explains the purpose of the project diagrams included in `docs/diagrams/`. The diagrams provide visual evidence of the system analysis, design, implementation structure, and data modelling decisions used in the Smart Home Energy Management System.

## Required Diagrams

### 1. Use Case Diagram

File: `docs/diagrams/use-case-diagram.jpg`

The Use Case Diagram identifies the main actors and the functions they perform in the system. It is included because the project has three clearly separated user roles: homeowner, administrator, and technician.

Justification:
- It shows the external users who interact with the application.
- It demonstrates role separation and user permissions at a high level.
- It links each role to the functions they are expected to perform.
- It supports the requirements analysis stage of the project.

Main actors:
- Homeowner
- Administrator
- Technician

Main use cases:
- Register and log in
- View dashboard
- Manage appliances
- Record energy usage
- View billing
- Manage users
- Manage pricing plans
- View reports
- View and complete fault alerts

### 2. Class Diagram

File: `docs/diagrams/class-diagram.jpg`

The Class Diagram represents the main model classes implemented in the Django backend. It includes selected attributes, important methods, and relationships between the classes.

Justification:
- It shows the object-oriented structure of the backend.
- It links directly to the Django model classes used in the application.
- It demonstrates how system responsibilities are separated between accounts, appliances, energy, pricing, notifications, recommendations, and dashboard-related data.
- It supports the design stage by showing how core entities interact.

Important classes shown:
- `User`
- `UserProfile`
- `Appliance`
- `ApplianceSchedule`
- `FaultReport`
- `EnergyUsage`
- `EnergyUsageSession`
- `DailyBill`
- `PricingPlan`
- `Notification`
- `Recommendation`

The diagram also shows important operations such as:
- `activate_member()`
- `deactivate_member()`
- `turn_on()`
- `turn_off()`
- `mark_faulty()`
- `mark_done()`
- `calculate_cost()`
- `mark_as_read()`

### 3. Entity Relationship Diagram

File: `docs/diagrams/erd-diagram.jpg`

The ERD shows the database structure used by the Django models. It includes primary keys, foreign keys, and the main relationships between database entities.

Justification:
- It explains how data is stored in the SQLite database.
- It shows the relationship between Django's built-in `auth_user` table and the project-specific tables.
- It identifies one-to-one, one-to-many, and optional relationships.
- It supports database design and helps explain how records such as appliances, energy usage, bills, faults, notifications, and recommendations are connected.

Important relationships:
- One `User` has one `UserProfile`.
- One homeowner can own many appliances.
- One appliance can have many energy usage records.
- One appliance can have many usage sessions.
- One appliance can have many fault reports.
- One homeowner can receive many notifications.
- One homeowner can receive many recommendations.
- One homeowner can have many daily bills.
- A user profile can optionally reference a pricing plan.

## Supporting Diagrams

### Sequence Diagram - High Usage Notification

File: `docs/diagrams/sequence-high-usage.jpg`

This diagram shows the order of interactions when a homeowner records energy usage above the high-usage threshold. It follows the request from the homeowner interface to the React API service, Django ViewSet, model save operation, and notification observer.

Justification:
- It demonstrates the dynamic behaviour of the Observer Pattern.
- It explains how frontend actions become backend records.
- It shows how notification creation is separated from the energy usage form.

### Activity Diagram - Fault Handling

File: `docs/diagrams/activity-fault-handling.jpg`

This diagram shows the process flow when an appliance is marked as faulty and later resolved by a technician.

Justification:
- It explains the business process across homeowner and technician roles.
- It shows the order of actions from fault reporting to completion.
- It supports the functional workflow described in the Use Case Diagram.

### State Diagram - Appliance Status

File: `docs/diagrams/state-appliance-status.jpg`

This diagram shows the lifecycle of an appliance status. The main states are `off`, `on`, `faulty`, and `ok`.

Justification:
- It clarifies which status transitions are allowed.
- It explains why technician completion resets an appliance to `ok`.
- It supports the appliance management and fault handling logic.

### Component Diagram

File: `docs/diagrams/component-diagram.jpg`

This diagram shows the main software components of the full-stack application, including React pages, shared components, the frontend API service, Django routing, DRF views, Django models, and SQLite.

Justification:
- It explains the system structure at implementation level.
- It shows the dependency between frontend and backend layers.
- It supports maintainability by showing where responsibilities are located.

### Deployment Diagram

File: `docs/diagrams/deployment-diagram.jpg`

This diagram shows how the application runs in development mode and in the final single-server demonstration mode.

Justification:
- It explains the difference between the Vite development server and Django serving the production React build.
- It shows how the browser, Django backend, and SQLite database interact at runtime.
- It supports the deployment and demonstration section of the project.

### System Architecture Diagram

File: `docs/diagrams/system-architecture.jpg`

This diagram shows how the React frontend, Django REST API, and SQLite database work together. It is useful for explaining the full-stack structure of the application.

### Role Workflow Diagram

File: `docs/diagrams/role-workflows.jpg`

This diagram summarises the main workflow responsibilities for homeowners, administrators, and technicians. It supports the role-based design of the project.

### Design Pattern Overview

File: `docs/diagrams/design-patterns.jpg`

This diagram explains where the four design patterns are used:
- Factory Pattern
- Observer Pattern
- Strategy Pattern
- Singleton Pattern

### API and Data Flow Diagram

File: `docs/diagrams/api-data-flow.jpg`

This diagram explains how a user action moves through the React page, API service, Django endpoint, model layer, and back to the user interface.

## Academic Relevance

Together, these diagrams show the project from several levels of abstraction:

- Requirements level: Use Case Diagram
- Object-oriented design level: Class Diagram
- Database design level: ERD
- Architecture level: System Architecture Diagram
- Behaviour level: Sequence, Activity, State, Role Workflow, and API Data Flow diagrams
- Implementation level: Component Diagram
- Runtime level: Deployment Diagram
- Software design level: Design Pattern Overview

This combination provides stronger evidence that the project was designed systematically rather than built only through code implementation.
