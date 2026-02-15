import StatusBadge from "./StatusBadge";

export default function TicketList({ tickets }) {

  return (
    <div className="card">

      <h2 className="text-xl font-semibold mb-4">
        All Tickets
      </h2>

      {tickets.length === 0 && (
        <p className="text-gray-400">
          No tickets yet.
        </p>
      )}

      {tickets
        .filter(t => t && t.id && t.subject)
        .map((t, index) => (

          <div
            key={t.id ?? `${t.subject}-${index}`}
            className="ticket"
          >

            <div className="flex justify-between items-center">

              <p className="font-semibold">
                #{t.id ?? "?"} — {t.subject ?? "Untitled"}
              </p>

              <StatusBadge status={t.status} />

            </div>

            <p className="text-sm mt-1">
              Category: <b>{t.category ?? "Unknown"}</b>
            </p>

            <p className="text-sm text-gray-400 mt-1">
              {t.description ?? "No description"}
            </p>

          </div>
        ))}

    </div>
  );
}
