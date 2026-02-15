"use client";

export default function StatusBadge({ status, priority }) {

  const styles = {
    Open: "bg-gray-100 text-gray-700 border border-gray-300",

    "In Progress":
      "bg-yellow-100 text-yellow-800 border border-yellow-300",

    Resolved:
      "bg-green-100 text-green-700 border border-green-300",

    Escalated:
      "bg-red-100 text-red-700 border border-red-300",

    // 🔴 Critical
    Critical:
      "bg-red-600 text-white border border-red-700 animate-pulse"
  };


  // Show CRITICAL if priority is Critical
  const finalStatus =
    priority === "Critical"
      ? "Critical"
      : status;


  return (
    <span
      className={`
        px-3 py-1
        text-xs font-semibold
        rounded-full
        shadow-sm
        whitespace-nowrap
        flex items-center gap-1
        ${styles[finalStatus] || "bg-gray-100 text-gray-600 border"}
      `}
    >
      {finalStatus === "Critical" && "🔴"}
      {finalStatus ?? "Unknown"}
    </span>
  );
}
