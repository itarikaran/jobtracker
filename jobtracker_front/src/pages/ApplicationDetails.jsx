import { useEffect, useState } from "react";
import { ArrowLeft, Banknote, BriefcaseBusiness, CalendarDays, Clock3, ExternalLink, FileText, Link2, MapPin, Pencil, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import StatusBadge from "../components/StatusBadge";
import JobService from "../services/JobService";

const formatDate = (date) => date ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(`${date}T00:00:00`)) : "—";

const formatLastUpdated = (value) => {
  if (!value) return "Last updated: —";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Last updated: —";
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days <= 0) return "Last updated: today";
  if (days === 1) return "Last updated: yesterday";
  if (days < 30) return `Last updated: ${days} days ago`;
  return `Last updated: ${formatDate(value.slice(0, 10))}`;
};

const toUrl = (value) => {
  const url = value?.trim();
  if (!url) return null;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

const getSavedLastUpdated = (jobId) => {
  try { return localStorage.getItem(`jobtracker:last-updated:${jobId}`); } catch { return null; }
};

function DetailItem({ icon: Icon, label, children }) {
  return <div className="py-5 first:pt-0 last:pb-0">
    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</dt>
    <dd className="mt-2 flex items-center gap-2.5 text-sm font-medium text-slate-800"><Icon size={19} className="shrink-0 text-indigo-600" />{children}</dd>
  </div>;
}

function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try { setJob(await JobService.getJob(id)); } catch { setError("Failed to load application."); } finally { setLoading(false); }
  };

  useEffect(() => {
    let active = true;
    JobService.getJob(id)
      .then((application) => { if (active) setJob(application); })
      .catch(() => { if (active) setError("Failed to load application."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const remove = async () => {
    setDeleting(true);
    try { await JobService.deleteJob(id); navigate("/applications"); } catch { setError("Unable to delete application."); setConfirming(false); } finally { setDeleting(false); }
  };

  const jobPostingUrl = toUrl(job?.jobPostingUrl);
  const recruiterUrl = toUrl(job?.recruiterUrl);
  const lastUpdated = job?.updatedAt ?? job?.updatedDate ?? job?.modifiedAt ?? getSavedLastUpdated(id);

  return <div className="min-h-screen bg-slate-50 md:pl-64">
    <Sidebar />
    <main className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-6 lg:px-8">
      <Link to="/applications" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-indigo-700">
        <ArrowLeft size={18} />Back to Applications
      </Link>

      {loading ? <p className="py-16 text-center text-slate-600">Loading application...</p> : error ? <div className="mt-5 rounded-xl bg-red-50 p-5 text-red-700">{error} <button onClick={load} className="ml-3 font-semibold underline">Retry</button></div> : <article className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <header className="bg-indigo-100 px-5 py-7 sm:px-8 sm:py-9">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white text-2xl font-bold text-indigo-700 shadow-sm">{job.companyName?.charAt(0)?.toUpperCase() || "J"}</div>
            <div className="min-w-0"><h1 className="truncate text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{job.jobRole || "Untitled role"}</h1><p className="mt-1 text-base font-medium text-slate-600">{job.companyName || "Unknown company"}</p></div>
          </div>
        </header>

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 sm:px-8">
          <div className="flex flex-wrap items-center gap-3"><StatusBadge status={job.status} /><span className="inline-flex items-center gap-1.5 text-sm text-slate-500"><Clock3 size={16} />{formatLastUpdated(lastUpdated)}</span></div>
          <div className="flex items-center gap-2"><Link to={`/applications/${id}/edit`} className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50"><Pencil size={16} />Edit</Link><button onClick={() => setConfirming(true)} className="inline-flex h-9 items-center gap-2 rounded-lg bg-red-100 px-3.5 text-sm font-semibold text-red-700 transition-colors duration-200 hover:bg-red-200"><Trash2 size={16} />Delete</button></div>
        </div>

        <div className="grid lg:grid-cols-[minmax(250px,.72fr)_minmax(0,1.28fr)]">
          <section className="border-b border-slate-200 p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <dl className="divide-y divide-slate-100">
              <DetailItem icon={MapPin} label="Location">{job.location || "Unspecified"}</DetailItem>
              <DetailItem icon={CalendarDays} label="Applied Date">{formatDate(job.appliedDate)}</DetailItem>
              <DetailItem icon={BriefcaseBusiness} label="Job Type">{job.jobType || "Unspecified"}</DetailItem>
              <DetailItem icon={Banknote} label="Salary Range">{job.salaryRange || "Unspecified"}</DetailItem>
            </dl>
          </section>

          <section className="space-y-8 p-6 sm:p-8">
            <div><h2 className="flex items-center gap-2 text-xl font-bold text-slate-900"><FileText size={22} className="text-indigo-600" />Notes</h2><div className="mt-3 border-t border-indigo-200 pt-4"><p className="whitespace-pre-line text-sm leading-6 text-slate-600">{job.notes?.trim() || "No notes added for this application."}</p></div></div>
            {(jobPostingUrl || recruiterUrl) && <div><h2 className="flex items-center gap-2 text-xl font-bold text-slate-900"><Link2 size={22} className="text-indigo-600" />Useful Links</h2><div className="mt-3 space-y-3 border-t border-indigo-200 pt-4">{jobPostingUrl && <a href={jobPostingUrl} target="_blank" rel="noreferrer" className="flex w-fit items-center gap-2 text-sm font-semibold text-indigo-700 transition-colors duration-200 hover:text-indigo-900 hover:underline"><ExternalLink size={17} />Original Job Posting</a>}{recruiterUrl && <a href={recruiterUrl} target="_blank" rel="noreferrer" className="flex w-fit items-center gap-2 text-sm font-semibold text-indigo-700 transition-colors duration-200 hover:text-indigo-900 hover:underline"><ExternalLink size={17} />Recruiter LinkedIn Profile</a>}</div></div>}
          </section>
        </div>
      </article>}

      {confirming && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-5"><div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"><h2 className="text-xl font-bold">Delete Application?</h2><p className="mt-3 text-slate-600">Are you sure you want to delete this application? This action cannot be undone.</p><div className="mt-7 flex justify-end gap-3"><button onClick={() => setConfirming(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-slate-50">Cancel</button><button onClick={remove} disabled={deleting} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-700 disabled:opacity-60">{deleting ? "Deleting..." : "Delete"}</button></div></div></div>}
    </main>
  </div>;
}

export default ApplicationDetails;
