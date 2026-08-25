const styles = {
  Applied: "border-indigo-200 bg-indigo-50 text-indigo-700",
  Interview: "border-amber-200 bg-amber-50 text-amber-700",
  Offer: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Rejected: "border-red-200 bg-red-50 text-red-700",
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors duration-200 ${styles[status] || "border-slate-200 bg-slate-100 text-slate-700"}`}>
      {status || "Unknown"}
    </span>
  );
}

export default StatusBadge;
