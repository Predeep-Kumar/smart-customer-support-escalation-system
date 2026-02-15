from sqlalchemy import Column, Integer, String, DateTime, Text, JSON
from datetime import datetime

from database import Base


class Ticket(Base):

    __tablename__ = "tickets"


    # BASIC INFO

    id = Column(Integer, primary_key=True, index=True)

    subject = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)


    # AI CLASSIFICATION

    category = Column(String(50), default="General")
    priority = Column(String(20), default="Medium")
    sentiment = Column(String(20), default="Neutral")


    # STATUS

    status = Column(String(20), default="Open")


    # AI OUTPUT

    solution = Column(JSON, nullable=True)

    escalation = Column(JSON, nullable=True)

    timeline = Column(JSON, nullable=True)


    # TIME

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )
