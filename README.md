# DataStraw – Smart Roster Management System

## 1. About the Project

DataStraw Smart Roster Management System is a web application developed to make employee and work-schedule management easier.

The application brings employee information and roster-related operations together in one place. It allows users to view employee records, retrieve organizational information, generate monthly work schedules, and make changes to existing roster entries.

The main purpose of this project is to reduce the effort involved in handling employee schedules manually and provide a structured way to maintain roster information.

## 2. Technologies and Tools

The project uses the following technologies:

| Technology | Purpose |
|---|---|
| React.js | Builds the application's user interface |
| Vite | Runs the frontend development environment |
| JavaScript | Handles frontend functionality |
| Python | Used for backend development |
| FastAPI | Creates and manages API endpoints |
| Uvicorn | Runs the backend application |
| Supabase | Stores and manages application data |
| PostgreSQL | Database technology used by Supabase |
| Visual Studio Code | Used for writing and managing project code |

## 3. Application Modules

### 3.1 Employee Dashboard

The Employee Dashboard provides a central view of employee records.

It displays information such as:
- Employee identification code.
- Employee's full name.
- Email address.
- Job designation.
- Current employment status.

The dashboard currently displays 30 employee records retrieved from the backend.

### 3.2 Roster Generation

This module handles the creation of employee work schedules for a selected month and year.

The backend considers available employee scheduling information, approved leave records, weekly availability, Sunday-off settings, and applicable public holidays when preparing roster entries.

Generated records are saved in the Supabase database.

The system also checks whether a roster already exists for the requested month to avoid creating duplicate monthly rosters.

### 3.3 Manual Roster Modification

The application provides an API endpoint for changing the status of an existing roster entry.

The supported roster statuses are:
- `working`
- `weekly_off`
- `leave`
- `holiday`

Whenever a roster entry is manually modified, the `is_manual_edit` field is set to `true`. This helps distinguish manually changed records from automatically generated entries.

### 3.4 Developer API Portal

The Developer API Portal provides an interface for accessing and testing the backend services.

The available API operations include retrieving employee information, organizational data, and roster records, along with updating existing roster entries.

## 4. Backend API Reference

The following endpoints are implemented in the backend:

| HTTP Method | API Endpoint | Function |
|---|---|---|
| GET | `/health` | Checks whether the backend is responding |
| GET | `/employees` | Returns employee records |
| GET | `/brands` | Retrieves brand information |
| GET | `/processes` | Retrieves process information |
| GET | `/pods` | Retrieves pod information |
| GET | `/rosters` | Returns stored roster entries |
| POST | `/rosters/generate` | Creates roster entries for a selected month |
| PUT | `/rosters/{roster_id}` | Changes the status of a selected roster entry |

The backend uses JSON responses to exchange information with the frontend and other API clients.

## 5. Database Management

Supabase is used to store the information required by the application.

The database contains records related to:

- Employees
- Brands
- Processes
- Pods
- Rosters

The roster records contain details such as employee references, organizational references, roster date, shift, status, and manual modification indicator.

The backend communicates with Supabase to retrieve, insert, and update the required records.

## 6. Project Directory Structure

The main project files are organized into frontend and backend sections.

```text
datastraw-roster/
│
├── backend/
│   ├── main.py
│   └── .env
│
├── src/
│   ├── ApiPortal.jsx
│   └── other frontend files
│
├── public/
├── package.json
├── index.html
└── README.md
```

The `backend` directory contains the FastAPI application, while the `src` directory contains the React frontend components.

The `.env` file stores backend configuration details and should not be shared publicly.

## 7. How to Run the Application

### Requirements

Before running the application, ensure that the following are installed:

- Python
- Node.js
- npm
- Visual Studio Code

A configured Supabase project and the required environment variables are also needed.

### Step 1: Run the Backend

Open a terminal and navigate to the backend directory:

```powershell
cd backend
```

Activate the project's virtual environment:

```powershell
& ..\.venv\Scripts\Activate.ps1
```

Start the backend server:

```bash
uvicorn main:app --reload
```

The backend will be available at:

`http://127.0.0.1:8000`

To access the interactive API documentation, open:

`http://127.0.0.1:8000/docs`

### Step 2: Run the Frontend

Open another terminal in the main project directory.

Install the required packages:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The application can then be accessed at:

`http://localhost:5173/`

Both servers must remain active while using the locally running application.

## 8. Testing and Verification

The following operations have been tested during development:

1. Checking backend availability.
2. Retrieving employee information.
3. Retrieving brand, process, and pod information.
4. Retrieving roster records.
5. Generating monthly roster records.
6. Checking duplicate roster generation.
7. Updating an existing roster entry through the PUT endpoint.
8. Verifying the updated roster status in Supabase.
9. Confirming that manually modified records are marked using `is_manual_edit`.

These tests helped verify communication between the frontend, backend, and database.

## 9. Possible Future Enhancements

The application can be extended with additional capabilities, including:

- A dedicated calendar-based roster view.
- Improved employee and roster filtering.
- Automated detection of scheduling conflicts.
- Employee coverage analysis and warning notifications.
- Secure login and role-based access control.
- Public deployment of the frontend and backend.

These enhancements can make the application more suitable for practical organizational use.

## 10. Conclusion

The DataStraw Smart Roster Management System demonstrates how a frontend application, backend APIs, and a cloud database can work together to handle employee and roster information.

The project provides employee data visibility, monthly roster generation, database integration, and manual roster modification through API operations.

It also establishes a foundation for adding more advanced scheduling and employee management capabilities in the future.