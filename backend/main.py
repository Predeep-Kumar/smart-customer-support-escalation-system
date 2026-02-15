from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from database import engine, SessionLocal
from models import Base, Ticket
from services.workflow import process_ticket


# App Init

app = FastAPI(title="Smart Support API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)


# Database Dependency

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Request / Response Models

class TicketCreate(BaseModel):
    subject: str
    description: str


class TicketResponse(BaseModel):

    id: int
    subject: str
    description: str

    category: str
    priority: str
    sentiment: str

    status: str

    solution: Optional[dict] = None
    escalation: Optional[Dict[str, Any]] = None
    timeline: Optional[List[Dict[str, Any]]] = None


    class Config:
        orm_mode = True


# Home

@app.get("/")
def home():
    return {"status": "Backend running successfully"}


# Create Ticket

@app.post("/ticket", response_model=TicketResponse)
def create_ticket(
    ticket: TicketCreate,
    db: Session = Depends(get_db)
):

    try:
        result = process_ticket(ticket.dict())

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"AI Processing Failed: {str(e)}"
        )


    # Save to DB
    new_ticket = Ticket(

        subject=ticket.subject,
        description=ticket.description,

        category=result.get("category", "General"),
        priority=result.get("priority", "Medium"),
        sentiment=result.get("sentiment", "Neutral"),

        status=result.get("status", "Open"),

        solution=result.get("solution"),

        escalation=result.get("escalation"),

        timeline=result.get("timeline")
    )


    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)


    return new_ticket


# Polling: Ticket Status

@app.get("/ticket/{ticket_id}/status")
def get_ticket_status(
    ticket_id: int,
    db: Session = Depends(get_db)
):

    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id
    ).first()

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )


    return {
        "id": ticket.id,
        "status": ticket.status,
        "priority": ticket.priority,
        "sentiment": ticket.sentiment
    }


# Get Single Ticket

@app.get("/ticket/{ticket_id}", response_model=TicketResponse)
def get_ticket(
    ticket_id: int,
    db: Session = Depends(get_db)
):

    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id
    ).first()

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    return ticket


# Get All Tickets

@app.get("/tickets", response_model=List[TicketResponse])
def list_tickets(db: Session = Depends(get_db)):

    tickets = db.query(Ticket).order_by(
        Ticket.id.desc()
    ).all()

    return tickets



@app.put("/ticket/{ticket_id}/resolve")
def resolve_ticket(ticket_id: int, db: Session = Depends(get_db)):

    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id
    ).first()

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    # Update status
    ticket.status = "Resolved"

    # Update solution.resolved
    if ticket.solution and isinstance(ticket.solution, dict):

        updated_solution = {
            **ticket.solution,
            "resolved": True
        }

        ticket.solution = updated_solution

    # 3 Update timeline properly
    if ticket.timeline and isinstance(ticket.timeline, list):

        new_timeline = []

        for step in ticket.timeline:

            if step["step"] == "Resolution":
                new_timeline.append({
                    **step,
                    "status": "completed"
                })

            elif step["step"] == "Escalation":
                new_timeline.append({
                    **step,
                    "status": "skipped"
                })

            else:
                new_timeline.append(step)

        ticket.timeline = new_timeline

    db.commit()
    db.refresh(ticket)
    
    
    return {
        "message": "Ticket marked as resolved",
        "status": ticket.status
    }
