"use client";

import { useState } from "react";

import TicketForm from "./components/TicketForm";
import TicketTracker from "./components/TicketTracker";


export default function Home() {

  const [currentTicket, setCurrentTicket] = useState(null);


  /* ===============================
     When Ticket Is Created
  =============================== */

  function handleNewTicket(ticket) {
    setCurrentTicket(ticket);
  }


  /* ===============================
     Reset Flow
  =============================== */

  function resetFlow() {
    setCurrentTicket(null);
  }


  /* ===============================
     UI
  =============================== */

  return (

    <main className="main">

      <div className="container">

        <h1 className="title">Smart Support System</h1>

        <p className="subtitle">
          Experience next-generation AI-powered support automation that transforms 
          customer service through intelligent classification, sentiment analysis, 
          automated troubleshooting, and smart escalation. Submit your issue, track 
          real-time processing, and receive faster, smarter, seamless resolutions.
        </p>


        {/* Submit Form */}
        {!currentTicket && (

          <TicketForm
            onSubmitSuccess={handleNewTicket}
          />

        )}


        {/* Tracker */}
        {currentTicket && (

          <TicketTracker
            ticket={currentTicket}
            onReset={resetFlow}
          />

        )}

      </div>

    </main>
  );
}
