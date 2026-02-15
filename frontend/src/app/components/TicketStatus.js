"use client";

import { useEffect, useState } from "react";
import { getTicketById } from "@/app/lib/api";

export default function TicketStatus({ data, onNewTicket }) {

  const [ticket, setTicket] = useState(data.ticket);
  const [ai, setAi] = useState(data.ai_response);

  // Poll every 5s
  useEffect(() => {

    const interval = setInterval(async () => {

      const updated = await getTicketById(ticket.id);

      if (!updated?.id) return;

      setTicket(updated);

    }, 5000);

    return () => clearInterval(interval);

  }, [ticket.id]);


  // Progress %
  function getProgress() {

    switch (ticket.status) {

      case "Open":
        return 25;

      case "In Progress":
        return 60;

      case "Resolved":
        return 100;

      case "Escalated":
        return 100;

      default:
        return 0;
    }
  }


  return (
    <div className="card space-y-6">

      <h2 className="text-xl font-semibold">
        Ticket Tracker
      </h2>


      {/* BASIC INFO */}
      <div className="space-y-1 text-sm">

        <p><b>ID:</b> #{ticket.id}</p>
        <p><b>Subject:</b> {ticket.subject}</p>
        <p><b>Category:</b> {ticket.category}</p>
        <p><b>Priority:</b> {ticket.priority}</p>

      </div>


      {/* STATUS */}
      <div className="flex items-center gap-3">

        <span>Status:</span>

        <span className={`status ${ticket.status}`}>
          {ticket.status}
        </span>

      </div>


      {/* PROGRESS BAR */}
      <div>

        <div className="flex justify-between text-xs mb-1 text-gray-400">
          <span>Progress</span>
          <span>{getProgress()}%</span>
        </div>

        <div className="h-2 bg-white/10 rounded-full overflow-hidden">

          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700"
            style={{ width: `${getProgress()}%` }}
          />

        </div>

      </div>


      {/* TIMELINE */}
      <div className="space-y-2">

        <h3 className="font-semibold text-sm">
          Timeline
        </h3>

        <Timeline status={ticket.status} />

      </div>


      {/* AI SOLUTION */}
      <div>

        <h3 className="font-semibold mb-2">
          AI Solution
        </h3>

        <div className="bg-black/30 p-4 rounded text-sm whitespace-pre-wrap">

          {ai.solution || "Processing..."}

        </div>

      </div>


      {/* ESCALATION */}
      {ai.escalation && (

        <div className="border border-red-500/40 rounded p-4">

          <h3 className="text-red-400 font-semibold mb-2">
            Escalated
          </h3>

          <pre className="text-sm whitespace-pre-wrap">
            {ai.escalation.summary}
          </pre>

        </div>

      )}


      {/* RESET */}
      <button onClick={onNewTicket}>
        Create New Ticket
      </button>

    </div>
  );
}



/* TIMELINE COMPONENT */

function Timeline({ status }) {

  const steps = [
    "Open",
    "In Progress",
    "Resolved"
  ];

  if (status === "Escalated") {
    steps.push("Escalated");
  }


  return (

    <div className="flex gap-4">

      {steps.map((step, i) => {

        const active =
          steps.indexOf(status) >= i;

        return (

          <div
            key={step}
            className="flex flex-col items-center gap-1"
          >

            <div
              className={`
                w-3 h-3 rounded-full
                ${active
                  ? "bg-blue-500"
                  : "bg-white/20"}
              `}
            />

            <span className="text-xs text-gray-400">
              {step}
            </span>

          </div>

        );
      })}

    </div>
  );
}
