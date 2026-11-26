from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import date, timedelta
from pydantic import BaseModel

class RosterRequest(BaseModel):
    month: int
    year: int

class ManualRosterUpdate(BaseModel):
    status: str

app = FastAPI(
    title="Smart Roster API",
    description="""
# Smart Roster Management API

Welcome to the Smart Roster API Developer Portal.

Manage employees, brands, processes, pods and employee schedules
through a unified API.

## Features
- Employee Management
- Brand and Process Management
- Roster Generation
- Employee Availability
- Conflict Detection
- Leave Management
""",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)
# Allow React frontend to communicate with Python backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://localhost:5174",
    "https://datastraw-roster-theta.vercel.app"
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "Smart Roster Management Backend is Running!"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }
from database import supabase

@app.get("/employees")
def get_employees():
    response = supabase.table("employees").select("*").execute()
    return {"employees": response.data}


@app.get("/brands")
def get_brands():
    response = supabase.table("brands").select("*").execute()
    return {"brands": response.data}


@app.get("/processes")
def get_processes():
    response = supabase.table("processes").select("*").execute()
    return {"processes": response.data}

@app.get("/pods")
def get_pods():
    response = supabase.table("pods").select("*").execute()

    return {
        "pods": response.data
    }

@app.get("/assignments")
def get_assignments():
    response = supabase.table("assignments").select("*").execute()
    return {"assignments": response.data}

@app.get("/rosters")
def get_rosters():
    response = supabase.table("rosters").select("*").execute()
    return {"rosters": response.data}

@app.post(
    "/rosters/generate",
    responses={
        409: {
            "description": "Roster already exists for the selected month",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Roster already exists for this month"
                    }
                }
            },
        }
    },
)
def generate_roster(request: RosterRequest):

    # Validate month
    if request.month < 1 or request.month > 12:
        raise HTTPException(
            status_code=400,
            detail="Month must be between 1 and 12"
        )

    try:
        # Find first and last day of the requested month
        start_date = date(request.year, request.month, 1)

        if request.month == 12:
            next_month = date(request.year + 1, 1, 1)
        else:
            next_month = date(request.year, request.month + 1, 1)

        end_date = next_month - timedelta(days=1)

        # Prevent duplicate roster generation
        existing = (
            supabase.table("rosters")
            .select("id")
            .gte("roster_date", str(start_date))
            .lte("roster_date", str(end_date))
            .execute()
        )

        if existing.data:
            raise HTTPException(
                status_code=409,
                detail="Roster already exists for this month"
            )

        # Fetch required database records
        employees = supabase.table("employees").select("*").execute().data

        assignments = (
            supabase.table("assignments")
            .select("*")
            .eq("status", "active")
            .execute()
            .data
        )

        rules = supabase.table("working_rules").select("*").execute().data
        leaves = supabase.table("leaves").select("*").eq(
            "status", "approved"
        ).execute().data

        availability = (
            supabase.table("employee_availability")
            .select("*")
            .execute()
            .data
        )

        holidays = supabase.table("holidays").select("*").execute().data

        # Prepare lookup dictionaries
        employee_map = {e["id"]: e for e in employees}

        rules_map = {
            (r["brand_id"], r["process_id"]): r
            for r in rules
        }

        availability_map = {
            (a["employee_id"], a["day_of_week"]): a["is_available"]
            for a in availability
        }

        roster_records = []
        current_date = start_date

        # Generate roster for every day
        while current_date <= end_date:

            for assignment in assignments:

                employee_id = assignment["employee_id"]
                brand_id = assignment["brand_id"]
                process_id = assignment["process_id"]

                employee = employee_map.get(employee_id)

                if not employee or employee.get("status") != "active":
                    continue

                assignment_start = date.fromisoformat(
                    assignment["start_date"]
                )

                assignment_end = date.fromisoformat(
                    assignment["end_date"]
                ) if assignment.get("end_date") else end_date

                if not (assignment_start <= current_date <= assignment_end):
                    continue

                rule = rules_map.get((brand_id, process_id), {})

                # Default status
                roster_status = "working"

                # Check approved leave
                for leave in leaves:
                    if leave["employee_id"] == employee_id:
                        leave_start = date.fromisoformat(leave["start_date"])
                        leave_end = date.fromisoformat(leave["end_date"])

                        if leave_start <= current_date <= leave_end:
                            roster_status = "leave"
                            break

                # Check weekly availability
                if roster_status == "working":
                    day_number = current_date.weekday()

                    is_available = availability_map.get(
                        (employee_id, day_number), True
                    )

                    if not is_available:
                        roster_status = "weekly_off"

                # Check Sunday rule
                if roster_status == "working":
                    if current_date.weekday() == 6 and rule.get("sunday_off"):
                        roster_status = "weekly_off"

                # Check public holidays
                if roster_status == "working" and rule.get("public_holidays_off"):
                    for holiday in holidays:
                        holiday_date = date.fromisoformat(
                            holiday["holiday_date"]
                        )

                        if (
                            holiday_date == current_date
                            and holiday.get("brand_id") in (None, brand_id)
                        ):
                            roster_status = "holiday"
                            break

                roster_records.append({
                    "employee_id": employee_id,
                    "brand_id": brand_id,
                    "process_id": process_id,
                    "pod_id": assignment["pod_id"],
                    "roster_date": str(current_date),
                    "shift": "General",
                    "status": roster_status,
                    "is_manual_edit": False
                })

            current_date += timedelta(days=1)

        # Save generated roster
        if roster_records:
            supabase.table("rosters").insert(roster_records).execute()

        return {
            "status": "success",
            "message": "Monthly roster generated successfully",
            "month": request.month,
            "year": request.year,
            "total_records": len(roster_records)
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/rosters/{roster_id}")
def update_roster(roster_id: str, request: ManualRosterUpdate):

    allowed_statuses = ["working", "weekly_off", "leave", "holiday"]

    if request.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid roster status"
        )

    try:
        response = (
            supabase.table("rosters")
            .update({
                "status": request.status,
                "is_manual_edit": True
            })
            .eq("id", roster_id)
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="Roster record not found"
            )

        return {
            "status": "success",
            "message": "Roster updated successfully",
            "roster": response.data[0]
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))