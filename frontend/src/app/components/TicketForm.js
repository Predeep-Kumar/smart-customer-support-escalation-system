"use client";

import { useState } from "react";
import { createTicket } from "@/app/lib/api";


export default function TicketForm({ onSubmitSuccess }) {

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);


  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    const res = await createTicket({
      subject,
      description
    });

    setLoading(false);

    setSubject("");
    setDescription("");

    onSubmitSuccess(res);
  }


  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow mb-6"
    >

      <h2 className="text-xl font-semibold mb-4">
        Create Ticket
      </h2>

      <input
        className="w-full p-2 border mb-3 rounded"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
      />

      <textarea
        className="w-full p-2 border mb-3 rounded"
        placeholder="Description"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <button
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Ticket"}
      </button>

    </form>
  );
}
