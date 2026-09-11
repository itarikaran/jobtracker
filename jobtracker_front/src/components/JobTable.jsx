import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(`${date}T00:00:00`))
    : "—";

function JobTable({ jobs, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
          <tr>
            {["Company", "Role", "Location", "Status", "Date Applied", "Actions"].map(
              (heading) => (
                <th key={heading} className="px-5 py-3.5 font-semibold">
                  {heading}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {jobs.map((job) => (
            <tr
              key={job.id}
              className="transition-colors duration-200 hover:bg-slate-50"
            >
              <td className="px-5 py-3.5 font-semibold text-slate-800">
                <span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-md bg-indigo-100 text-xs font-bold text-indigo-800">
                  {job.companyName?.charAt(0)?.toUpperCase()}
                </span>
                {job.companyName}
              </td>
              <td className="px-5 py-3.5 text-slate-600">{job.jobRole}</td>
              <td className="px-5 py-3.5 text-slate-600">{job.location}</td>
              <td className="px-5 py-3.5">
                <StatusBadge status={job.status} />
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">
                {formatDate(job.appliedDate)}
              </td>
              <td className="px-5 py-3.5">
                <div className="flex gap-1">
                  <button
                    title="View application"
                    onClick={() => navigate(`/applications/${job.id}`)}
                    className="rounded-md p-1.5 text-indigo-700 transition-colors duration-200 hover:bg-indigo-50"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    title="Edit application"
                    onClick={() => navigate(`/applications/${job.id}/edit`)}
                    className="rounded-md p-1.5 text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    title="Delete application"
                    onClick={() => onDelete(job)}
                    className="rounded-md p-1.5 text-red-600 transition-colors duration-200 hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default JobTable;
