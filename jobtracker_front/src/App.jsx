import { useCallback, useEffect, useState } from "react";
import {
  LayoutDashboard,
  Building2,
  Menu,
  X,
} from "lucide-react";

import Dashboard from "./pages/Dashboard";
import Companies from "./pages/Companies";
import CompanyForm from "./pages/CompanyForm";

import {
  getCompanies,
  addCompany,
  updateCompany,
  deleteCompany,
} from "./services/companyService";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "companies", label: "Companies", icon: Building2 },
];

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [formCompany, setFormCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loadCompanies = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getCompanies();

      if (!Array.isArray(data)) {
        throw new Error("The API did not return a company list.");
      }

      setCompanies(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load companies."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  function navigate(page) {
    setError("");
    setActivePage(page);
    setFormCompany(null);
    setSidebarOpen(false);
  }

  function openAddForm() {
    setError("");
    setFormCompany(null);
    setActivePage("form");
    setSidebarOpen(false);
  }

  async function openEditForm(company) {
    setError("");
    setFormCompany(company);
    setActivePage("form");
    setSidebarOpen(false);
  }

  async function handleSave(payload) {
    setSaving(true);
    setError("");

    try {
      if (formCompany?.id) {
        await updateCompany(formCompany.id, payload);
      } else {
        await addCompany(payload);
      }

      await loadCompanies();
      setFormCompany(null);
      setActivePage("companies");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save company."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(company) {
    const confirmed = window.confirm(
      `Delete "${company.companyName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setError("");

    try {
      await deleteCompany(company.id);
      await loadCompanies();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete company."
      );
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-600 p-2 text-white">
              <Building2 size={23} />
            </div>
            <div>
              <p className="text-lg font-bold">JobTracker</p>
              <p className="text-xs text-slate-500">
                Company management
              </p>
            </div>
          </div>

          <button
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1 px-4 pt-7">
          <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Workspace
          </p>

          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active =
              activePage === id ||
              (id === "companies" && activePage === "form");

            return (
              <button
                key={id}
                onClick={() => navigate(id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon size={19} />
                {label}

                {id === "companies" && (
                  <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                    {companies.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-slate-100 p-5">
          <p className="text-xs text-slate-400">
            JobTracker · Personal workspace
          </p>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-8">
          <button
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div className="hidden text-sm text-slate-500 sm:block">
            Workspace /{" "}
            <span className="font-medium text-slate-900">
              {activePage === "dashboard"
                ? "Dashboard"
                : activePage === "form"
                  ? formCompany?.id
                    ? "Edit Company"
                    : "Add Company"
                  : "Companies"}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-slate-500 sm:block">
              Personal Job Search
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
              A
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] p-4 sm:p-8">
          {activePage === "dashboard" && (
            <>
              {error && (
                <div
                  role="alert"
                  className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                  {error}{" "}
                  <button
                    onClick={loadCompanies}
                    className="font-semibold underline"
                  >
                    Try again
                  </button>
                </div>
              )}

              {loading ? (
                <p className="py-10 text-sm text-slate-500">
                  Loading dashboard...
                </p>
              ) : (
                <Dashboard
                  companies={companies}
                  onOpenCompanies={() => navigate("companies")}
                />
              )}
            </>
          )}

          {activePage === "companies" && (
            <Companies
              companies={companies}
              loading={loading}
              error={error}
              onRefresh={loadCompanies}
              onAdd={openAddForm}
              onEdit={openEditForm}
              onDelete={handleDelete}
            />
          )}

          {activePage === "form" && (
            <CompanyForm
              key={formCompany?.id ?? "new"}
              company={formCompany}
              saving={saving}
              error={error}
              onBack={() => navigate("companies")}
              onSubmit={handleSave}
            />
          )}
        </main>
      </div>
    </div>
  );
}
