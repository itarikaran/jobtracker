import { useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness } from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import JobService from "../services/JobService";

const statuses = ["Applied", "Interview", "Offer", "Rejected"];

const colors = {
  Applied: "bg-indigo-500",
  Interview: "bg-amber-500",
  Offer: "bg-emerald-500",
  Rejected: "bg-red-500",
};

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(new Date(`${value}T00:00:00`))
    : "—";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      setJobs(await JobService.getJobs());
    } catch {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    JobService.getJobs()
      .then(setJobs)
      .catch(() => setError("Failed to load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        statuses.map((status) => [
          status,
          jobs.filter((job) => job.status === status).length,
        ])
      ),
    [jobs]
  );

  const recent = useMemo(
    () =>
      [...jobs]
        .sort((a, b) =>
          String(b.appliedDate).localeCompare(String(a.appliedDate))
        )
        .slice(0, 5),
    [jobs]
  );

  return (
    <div className="min-h-screen bg-slate-50 md:pl-64">
      <Sidebar />

      <Header />

      <main className="mx-auto w-full max-w-[1280px] px-5 py-6 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">
          Dashboard
        </h1>

        {loading ? (
          <p className="py-16 text-center text-slate-600">
            Loading dashboard...
          </p>
        ) : error ? (
          <div className="rounded-xl bg-red-50 p-5 text-red-700">
            {error}

            <button
              onClick={load}
              className="ml-3 font-semibold underline"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Total Apps

                  <BriefcaseBusiness
                    className="text-indigo-700"
                    size={19}
                  />
                </div>

                <p className="mt-4 text-3xl font-bold">
                  {jobs.length}
                </p>
              </div>

              {statuses.map((status) => (
                <div
                  key={status}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
                  <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {status}

                    <span
                      className={`mt-1 h-2 w-2 rounded-full ${colors[status]}`}
                    />
                  </div>

                  <p className="mt-4 text-3xl font-bold">
                    {counts[status]}
                  </p>
                </div>
              ))}
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(280px,.8fr)_minmax(0,1.7fr)]">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold">
                  Overview
                </h2>

                <div className="mt-6 space-y-5">
                  {statuses.map((status) => {
                    const percentage = jobs.length
                      ? (counts[status] / jobs.length) * 100
                      : 0;

                    return (
                      <div
                        key={status}
                        className="grid grid-cols-[72px_1fr_28px] items-center gap-3 text-sm"
                      >
                        <span className="text-slate-600">
                          {status}
                        </span>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full transition-all duration-200 ${colors[status]}`}
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>

                        <span className="text-right font-semibold">
                          {counts[status]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                  <h2 className="text-lg font-bold">
                    Recent Applications
                  </h2>

                  <Link
                    to="/applications"
                    className="text-sm font-semibold text-indigo-700 transition-colors duration-200 hover:text-indigo-900"
                  >
                    View All
                  </Link>
                </div>

                {recent.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-sm">
                      <thead className="border-b border-slate-100 text-left text-xs uppercase tracking-wider text-slate-500">
                        <tr>
                          {["Company", "Role", "Status", "Date"].map(
                            (item) => (
                              <th
                                className="px-5 py-3 font-semibold"
                                key={item}
                              >
                                {item}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {recent.map((job) => (
                          <tr
                            className="transition-colors duration-200 hover:bg-slate-50"
                            key={job.id}
                          >
                            <td className="px-5 py-3.5 font-semibold">
                              <span className="mr-2.5 inline-flex h-8 w-8 items-center justify-center rounded-md bg-indigo-100 text-xs font-bold text-indigo-800">
                                {job.companyName
                                  ?.slice(0, 2)
                                  .toUpperCase()}
                              </span>

                              {job.companyName}
                            </td>

                            <td className="px-5 py-3.5 text-slate-600">
                              {job.jobRole}
                            </td>

                            <td className="px-5 py-3.5">
                              <StatusBadge status={job.status} />
                            </td>

                            <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">
                              {formatDate(job.appliedDate)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="p-10 text-center text-slate-600">
                    No applications yet.
                  </p>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
