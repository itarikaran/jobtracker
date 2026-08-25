import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import JobService from "../services/JobService";

const blankJob = {
  companyName: "", location: "", jobRole: "", status: "Applied", appliedDate: "",
  jobType: "", salaryRange: "", notes: "", jobPostingUrl: "", recruiterUrl: "",
};

const saveLastUpdated = (jobId) => {
  if (!jobId) return;
  localStorage.setItem(`jobtracker:last-updated:${jobId}`, new Date().toISOString());
};

const inputClass = "mt-1 block h-9 w-full rounded-lg border border-slate-200 px-3 font-normal text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

function AddApplication() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(blankJob);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editing) return;
    JobService.getJob(id).then((job) => setForm({ ...blankJob, ...job })).catch(() => setError("Failed to load application.")).finally(() => setLoading(false));
  }, [editing, id]);

  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const savedJob = editing ? await JobService.updateJob(id, form) : await JobService.addJob(form);
      const savedId = editing ? id : savedJob?.id;
      saveLastUpdated(savedId);
      navigate(editing || savedId ? `/applications/${savedId}` : "/applications");
    } catch {
      setError("Unable to save application. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-50 md:pl-64"><Sidebar /><Header /><p className="p-10">Loading application...</p></div>;

  return <div className="min-h-screen bg-slate-50 md:pl-64">
    <Sidebar /><Header />
    <main className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-7">
      <h1 className="text-2xl font-bold tracking-tight">{editing ? "Edit Application" : "Add New Application"}</h1>
      <p className="mt-1 text-sm text-slate-600">{editing ? "Update the details of your job opportunity." : "Log a new job opportunity to track its progress."}</p>
      <form onSubmit={submit} className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[["companyName", "Company Name", "e.g. Acme Corp", "text"], ["jobRole", "Job Role", "e.g. Senior Product Designer", "text"], ["location", "Location", "Remote, City, etc.", "text"], ["appliedDate", "Applied Date", "", "date"]].map(([name, label, placeholder, type]) => <label key={name} className="text-sm font-semibold text-slate-700">{label}<input required name={name} type={type} value={form[name]} onChange={change} placeholder={placeholder} className={inputClass} /></label>)}
          <label className="text-sm font-semibold text-slate-700">Status<select name="status" value={form.status} onChange={change} className={`${inputClass} bg-white`}>{["Applied", "Interview", "Offer", "Rejected"].map((value) => <option key={value}>{value}</option>)}</select></label>
          <label className="text-sm font-semibold text-slate-700">Job Type<select name="jobType" value={form.jobType} onChange={change} className={`${inputClass} bg-white`}><option value="">Unspecified</option>{["Full-Time", "Part-Time", "Internship", "Contract", "Remote", "Hybrid"].map((value) => <option key={value}>{value}</option>)}</select></label>
          <label className="text-sm font-semibold text-slate-700">Salary Range<select name="salaryRange" value={form.salaryRange} onChange={change} className={`${inputClass} bg-white`}><option value="">Unspecified</option>{["1–3 LPA", "3–5 LPA", "5–8 LPA", "8–12 LPA", "12–15 LPA", "15+ LPA"].map((value) => <option key={value}>{value}</option>)}</select></label>
          <label className="text-sm font-semibold text-slate-700">Job Posting URL<input name="jobPostingUrl" type="url" value={form.jobPostingUrl} onChange={change} placeholder="https://example.com/job" className={inputClass} /></label>
          <label className="text-sm font-semibold text-slate-700">Recruiter LinkedIn URL<input name="recruiterUrl" type="url" value={form.recruiterUrl} onChange={change} placeholder="https://linkedin.com/in/name" className={inputClass} /></label>
          <label className="text-sm font-semibold text-slate-700 md:col-span-2 xl:col-span-3">Notes<textarea name="notes" value={form.notes} onChange={change} placeholder="Add application notes..." rows="2" className="mt-1 block w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></label>
        </div>
        {error && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="mt-5 flex justify-end gap-3 border-t border-slate-100 pt-4"><Link to={editing ? `/applications/${id}` : "/applications"} className="inline-flex h-9 items-center rounded-lg border border-slate-200 px-4 text-sm font-semibold transition-colors duration-200 hover:bg-slate-50">Cancel</Link><button disabled={saving} className="inline-flex h-9 items-center gap-2 rounded-lg bg-indigo-700 px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-800 hover:shadow disabled:opacity-60"><Save size={17} />{saving ? "Saving..." : editing ? "Save Changes" : "Save Application"}</button></div>
      </form>
    </main>
  </div>;
}

export default AddApplication;
