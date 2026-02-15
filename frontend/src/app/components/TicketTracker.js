"use client";

import { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";
import { getTicket, resolveTicket } from "../lib/api";


export default function TicketTracker({ ticket, onReset }) {

  const [data, setData] = useState(ticket);
  const [showConfirm, setShowConfirm] = useState(false);
  const [rating, setRating] = useState(0);


  /* Live Polling (Every 5s)*/

  useEffect(() => {

  if (!data?.id) return;

  const interval = setInterval(async () => {

    try {

      const updated = await getTicket(data.id);

      // ❗ If ticket deleted / not found → stop
      if (!updated) {
        console.warn("Ticket no longer exists. Stopping polling.");
        clearInterval(interval);
        return;
      }

      setData((prev) => ({
        ...prev,
        ...updated
      }));

    } catch (err) {
      console.error("Polling Error:", err);
    }

  }, 5000);

  return () => clearInterval(interval);

}, [data?.id]);


  if (!data) return null;


  /* Progress Map*/

  const progressMap = {
    Open: 10,
    "In Progress": 50,
    Escalated: 80,
    Resolved: 100
  };

  const progress = progressMap[data.status] || 0;


  /* Timeline*/

  const steps = ["Open", "In Progress", "Escalated", "Resolved"];

  let currentIndex = steps.indexOf(data.status);

    // Fallback safety
    if (currentIndex === -1) {
    currentIndex = 0;
    }

  /* Rating*/

  function handleRating(value) {
    setRating(value);
  }


  /* Status Text*/

  function getStatusText() {

    switch (data.status) {

      case "Open":
        return "🕓 Ticket Submitted";

      case "In Progress":
        return "⏳ Being Processed";

      case "Escalated":
        return "🚨 Escalated to Support";

      case "Resolved":
        return "✅ Completed";

      default:
        return "";
    }
  }


  async function handleResolve() {

  try {
    const res = await resolveTicket(data.id);

    if (res) {
      setData(prev => ({
        ...prev,
        status: "Resolved"
      }));
    }

  } catch (err) {
    console.error("Resolve error:", err);
  }

}

  /* UI*/

  return (

    <div className="tracker-card">


      {/*  Header  */}

      <div className="tracker-header">

        <div className="tracker-title">

           <div className="tracker-meta">
          <span>Ticket #{data.id}</span>

          <span className="meta-pill category-pill">
            {data.category}
          </span>

         {data.priority?.toLowerCase() !== "critical" && (
        <span
          className={`meta-pill priority-pill ${
            data.priority?.toLowerCase()
          }`}
        >
          {data.priority}
        </span>
      )}

      {data.priority?.toLowerCase() === "critical" && (
        <span className="critical-tag">
          🔴 CRITICAL
        </span>
      )}
        
        </div>
            

            <h2>{data.subject}</h2>

            <p className="tracker-desc">
            {data.description}
            </p>

        </div>

        {/* Status Badge */}
        <StatusBadge status={data.status} />
        </div>


      

 
    {/*  Timeline  */}

    <div className="timeline-wrapper">

    <div className="timeline">

        {/* Step 1 */}
        <div className={`dot ${currentIndex >= 0 ? "active" : ""}`} />
        <div className={`line ${currentIndex >= 1 ? "active" : ""}`} />

        {/* Step 2 */}
        <div className={`dot ${currentIndex >= 1 ? "active" : ""}`} />
        <div className={`line ${currentIndex >= 2 ? "active" : ""}`} />

        {/* Step 3 */}
        <div className={`dot ${currentIndex >= 2 ? "active" : ""}`} />
        <div className={`line ${currentIndex >= 3 ? "active" : ""}`} />

        {/* Step 4 */}
        <div className={`dot ${currentIndex >= 3 ? "active" : ""}`} />

    </div>


    {/* Labels */}
    <div className="timeline-labels">

        <span>Open</span>
        <span>In Progress</span>
        <span>Escalated</span>
        <span>Resolved</span>

    </div>

    </div>
      {/*  Progress  */}

      <div className="progress-bar">

        <div
          className="progress-fill"
          style={{
            width: `${progress}%`
          }}
        />

      </div>

      <p className="progress-text">
        {getStatusText()}
      </p>


      {/*  AI Solution  */}

      <div className="solution-box">

        <h3>AI Assistance</h3>
      {renderSolution(data.solution, data.status)}

      </div>

      {/*  User Action  */}

      {data.status !== "Resolved" && (

      <div className="action-box">

        <div className="action-content">

          <div className="action-text">

            {data.status === "Escalated" ? (
              <>
                <strong>🚨 Issue Escalated</strong>
                <p>
                  Your issue has been reported to our team.
                  A support agent will contact you soon.
                </p>
              </>
            ) : (
              <>
                <strong>Need more help?</strong>
                <p>
                  If your issue is fixed after following the steps,
                  you can mark this ticket as resolved.
                </p>
              </>
            )}

          </div>

          <button
            className="resolve-btn"
            onClick={() => setShowConfirm(true)}
          >
            ✅ Mark as Resolved
          </button>

        </div>

      </div>

    )}

         {/*  Critical Alert  */}

      {data.status === "Escalated" && (

        <div className="alert-box">

        <div>
            🚨 <b>High Priority Issue</b>
            <span>
            Our team is handling this urgently.
            </span>
        </div>

        <button
            className="alert-btn"
            onClick={() =>
            alert("Support will contact you shortly.")
            }
        >
            Contact Support
        </button>

        </div>

      )}
 

      {/*  Rating  */}

      {data.status === "Resolved" && (

        <div className="rating-box">

          <h4>Rate Our Support</h4>

          <div className="stars">

            {[1,2,3,4,5].map((n) => (

              <span
                key={n}
                className={
                  n <= rating
                    ? "star active"
                    : "star"
                }
                onClick={() => handleRating(n)}
              >
                ★
              </span>

            ))}

          </div>

          {rating > 0 && (
            <p className="rating-text">
              Thank you for your feedback ❤️
            </p>
          )}

        </div>

      )}


      {/*  Action  */}

      <button
        className="new-btn"
        onClick={onReset}
      >
        + Create New Ticket
      </button>
      {/*  MODAL  */}
{showConfirm && (
  <div className="modal-overlay">
    <div className="modal-box">
      <h3>Confirm Resolution</h3>
      <p>
        Are you sure your issue is fixed?
        This will mark the ticket as resolved.
      </p>

      <div className="modal-actions">
        <button
          className="modal-cancel"
          onClick={() => setShowConfirm(false)}
        >
          Cancel
        </button>

        <button
          className="modal-confirm"
          onClick={async () => {
            await handleResolve();
            setShowConfirm(false);
          }}
        >
          Yes, Resolve
        </button>
      </div>
    </div>
  </div>
)}
      

    </div>
  );
}



/* AI Output Formatter*/

function renderSolution(solution, status) {

  // Loading state
  if (!solution) {

    return (
      <p className="muted">
        AI is analyzing your issue...
      </p>
    );

  }


  // Structured object
  if (
    typeof solution === "object" &&
    solution.steps
  ) {

    return (

      <div className="solution-structured">

        <h4>Steps</h4>

        <ul>

          {solution.steps.map((s, i) => (
            <li key={i}>• {s}</li>
          ))}

        </ul>


        <h4>Message</h4>

        <p>{solution.message}</p>


        {/* Status */}
        <h4>Status</h4>

        {status === "Resolved" ? (
          <p className="solution-status success">
            ✅ Issue Resolved
          </p>
        ) : status === "Escalated" ? (
          <p className="solution-status escalated">
            🚨 Escalated for Manual Review
          </p>
        ) : solution?.resolved ? (
          <p className="solution-status warning">
            ⚠ AI Suggests This May Be Resolved
          </p>
        ) : (
          <p className="solution-status pending">
            ⏳ Needs Further Action
          </p>
        )}

      </div>

    );

  }


  // Plain string fallback
  if (typeof solution === "string") {

    return (
      <p>{solution}</p>
    );

  }


  return (
    <p className="muted">
      No solution available yet.
    </p>
  );
}
