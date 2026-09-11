import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import JobTable from "../components/JobTable";
import JobService from "../services/JobService";

function Applications() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [order, setOrder] = useState("newest");
  const [confirming, setConfirming] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadJobs = async () => {
    setLoading(true);
    setError("");

    try {
      setJobs(await JobService.getJobs());
    } catch {
      setError("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    JobService.getJobs()
      .then(setJobs)
      .catch(() => setError("Failed to load applications."))
      .finally(() => setLoading(false));
  }, []);

  const locations = useMemo(
    () =>
      [...new Set(jobs.map((job) => job.location).filter(Boolean))].sort(),
    [jobs]
  );

  const displayed = useMemo(
    () =>
      jobs
        .filter((job) =>
          `${job.companyName} ${job.jobRole}`
            .toLowerCase()
            .includes(search.toLowerCase())
        )
        .filter((job) => !status || job.status === status)
        .filter((job) => !location || job.location === location)
        .sort(
          (a, b) =>
            (order === "newest" ? 1 : -1) *
            String(b.appliedDate).localeCompare(String(a.appliedDate))
        ),
    [jobs, search, status, location, order]
  );

  const deleteJob = async () => {
    setDeleting(true);

    try {
      await JobService.deleteJob(confirming.id);

      setJobs((items) =>
        items.filter((job) => job.id !== confirming.id)
      );

      setConfirming(null);
    } catch {
      setError("Unable to delete application.");
      setConfirming(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 md:pl-64">
      <Sidebar />

      <Header search={search} onSearchChange={setSearch} />

      <main className="mx-auto w-full max-w-[1280px] px-5 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Applications
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              Track and manage all your job applications.
            </p>
          </div>

          <Link
            to="/applications/add"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-indigo-700 px-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-800 hover:shadow"
          >
            <Plus size={18} />
            Add Application
          </Link>
        </div>

        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row">
          <label className="flex h-10 flex-1 items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-500 transition-all duration-200 focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100">
            <Search size={18} />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search companies or roles..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition-colors duration-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">All Statuses</option>

            {["Applied", "Interview", "Offer", "Rejected"].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>

          <select
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition-colors duration-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">All Locations</option>

            {locations.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>

          <select
            value={order}
            onChange={(event) => setOrder(event.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition-colors duration-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        {loading ? (
          <p className="py-16 text-center text-slate-600">
            Loading applications...
          </p>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            {error}

            <button
              onClick={loadJobs}
              className="ml-3 font-semibold underline"
            >
              Retry
            </button>
          </div>
        ) : displayed.length ? (
          <JobTable jobs={displayed} onDelete={setConfirming} />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-14 text-center">
            <h2 className="text-xl font-semibold">
              No applications yet
            </h2>

            <p className="mt-2 text-slate-600">
              Start tracking your job applications by adding your first
              application.
            </p>

            <Link
              to="/applications/add"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-700 px-5 py-3 font-semibold text-white transition-colors duration-200 hover:bg-indigo-800"
            >
              <Plus size={19} />
              Add Application
            </Link>
          </div>
        )}
      </main>

      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-5">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold">
              Delete Application?
            </h2>

            <p className="mt-3 text-slate-600">
              Are you sure you want to delete this application? This action
              cannot be undone.
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                onClick={() => setConfirming(null)}
                disabled={deleting}
                className="rounded-lg border border-slate-300 px-4 py-2 font-medium transition-colors duration-200 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={deleteJob}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-colors duration-200 hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Applications;
