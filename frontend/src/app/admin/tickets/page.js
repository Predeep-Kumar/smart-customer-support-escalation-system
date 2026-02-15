"use client";

import { useEffect, useState } from "react";
import { getTickets } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [page, setPage] = useState(1);

  const router = useRouter();
  const perPage = 6;

  const CATEGORIES = [
    "Billing",
    "Technical",
    "Account",
    "Refund",
    "Security",
    "Order",
    "General",
  ];

  useEffect(() => {
    loadTickets();
    const interval = setInterval(loadTickets, 8000);
    return () => clearInterval(interval);
  }, []);

  async function loadTickets() {
    const data = await getTickets();
    setTickets(data);
  }

  // Filtering
  const filtered = tickets.filter((t) => {
    const matchesSearch =
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" ? true : t.category === categoryFilter;

    const matchesPriority =
      priorityFilter === "All" ? true : t.priority === priorityFilter;

    return matchesSearch && matchesCategory && matchesPriority;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div className="admin-page">

      <h1 className="admin-title">Admin Dashboard</h1>

      {/* Controls */}
      <div className="controls">

        <input
          className="search-input"
          placeholder="Search tickets..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <div className="filter-group">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Ticket List */}
      <div className="tickets-table">
        {paginated.map((ticket) => (
          <div
            key={ticket.id}
            className="ticket-row"
            onClick={() =>
              router.push(`/admin/tickets/${ticket.id}`)
            }
          >
            <div className="ticket-main">
              <div className="ticket-top">
                <span className="ticket-id">#{ticket.id}</span>
                <h3>{ticket.subject}</h3>
              </div>

              <p className="ticket-description">
                {ticket.description.slice(0, 140)}...
              </p>
            </div>

            <div className="ticket-meta">
              <span className="pill category">
                {ticket.category}
              </span>

              <span className={`pill priority ${ticket.priority.toLowerCase()}`}>
                {ticket.priority}
              </span>

              <span className={`pill status ${ticket.status.toLowerCase().replace(" ","-")}`}>
                {ticket.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>

        <span>Page {page} of {totalPages || 1}</span>

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

    </div>
  );
}
