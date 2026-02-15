"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTicket } from "../../../lib/api";

export default function TicketDetailPage() {

  const { id } = useParams();
  const router = useRouter();

  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    loadTicket();
  }, []);

  async function loadTicket() {
    const data = await getTicket(id);
    setTicket(data);
  }

  if (!ticket) return <p>Loading...</p>;

  return (
    <div className="admin-page">

      

      <h1>Ticket #{ticket.id}</h1>

      <div className="detail-card">
        <div className="detail-meta">
          <span className="pill category">{ticket.category}</span>
          <span className={`pill priority ${ticket.priority.toLowerCase()}`}>
            {ticket.priority}
          </span>
          <span className={`pill status ${ticket.status.toLowerCase().replace(" ","-")}`}>
            {ticket.status}
          </span>
        </div>

        <h2> SUBJECT : {ticket.subject}</h2>

        <p className="detail-description">
          DESCRIPTION : {ticket.description}
        </p>

        <div className="solution-section">
          <h3><b>AI Solution</b></h3>

          {ticket.solution?.steps?.map((step, i) => (
            <p key={i}>• {step}</p>
          ))}

          <p className="solution-message">
            {ticket.solution?.message}
          </p>
        </div>

        {ticket.escalation && (
          <div className="escalation-section">
            <pre>{ticket.escalation.summary}</pre>
          </div>
        )}

      
      </div>
        {}
      <button
        onClick={() => router.back()}
        className="back-btn"
      >
        ← Back
      </button>
    </div>
    
  );
}
