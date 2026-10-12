
import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Building2,
  MapPin,
  RefreshCw,
  Search,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

import { getCompanies } from "./services/companyService";
import CompanyLogo from "./components/CompanyLogo";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "companies", label: "Companies", icon: Building2 },
];

function compareText(a, b) {
  return String(a ?? "").localeCompare(String(b ?? ""), undefined, {
    sensitivity: "base",
    numeric: true,
  });
}

function Dashboard({ companies, onOpenCompanies }) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-indigo-600">
          OVERVIEW
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="mt-2 text-slate-500">
          Your company directory at a glance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Companies
              </p>
              <p className="mt-3 text-4xl font-bold text-slate-900">
                {companies.length}
              </p>
            </div>

            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <Building2 size={26} />
            </div>
          </div>

          <button
            onClick={onOpenCompanies}
            className="mt-6 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            View companies →
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Welcome to JobTracker
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Maintain your company directory and organize the companies
          you want to track during your job search.
        </p>
      </div>
    </div>
  );
}

function CompaniesPage({
  companies,
  loading,
  error,
  onRefresh,
}) {
  const [sortBy, setSortBy] = useState("company");
  const [search, setSearch] = useState("");

  const sortedCompanies = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = companies.filter((company) =>
      [
        company.companyName,
        company.district,
        company.city,
        company.address,
        company.notes,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      )
    );

    return [...filtered].sort((a, b) => {
      if (sortBy === "location") {
        return (
          compareText(a.district, b.district) ||
          compareText(a.city, b.city) ||
          compareText(a.companyName, b.companyName)
        );
      }

      return (
        compareText(a.companyName, b.companyName) ||
        compareText(a.district, b.district) ||
        compareText(a.city, b.city)
      );
    });
  }, [companies, search, sortBy]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-indigo-600">
            DIRECTORY
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Companies
          </h1>
          <p className="mt-2 text-slate-500">
            Browse and organize your company directory.
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search companies, district, city..."
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="relative sm:w-72">
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm text-slate-700 outline-none focus:border-indigo-500"
          >
            <option value="company">Company name: A–Z</option>
            <option value="location">
              District A–Z → City A–Z
            </option>
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <p className="font-semibold">Unable to load companies</p>
          <p className="mt-1">{error}</p>
          <p className="mt-2">
            Check that Spring Boot is running on port 8080 and
            that CORS allows http://localhost:5173.
          </p>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            Company directory
          </h2>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            {sortedCompanies.length} companies
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500">
            Loading companies...
          </div>
        ) : sortedCompanies.length === 0 ? (
          <div className="p-12 text-center">
            <Building2
              size={32}
              className="mx-auto text-slate-300"
            />
            <p className="mt-3 font-semibold text-slate-800">
              No companies found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {search
                ? "Try another search term."
                : "Add company records through your backend API."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Logo</th>
                  <th className="px-5 py-4 font-semibold">Company name</th>
                  <th className="px-5 py-4 font-semibold">District</th>
                  <th className="px-5 py-4 font-semibold">City</th>
                  <th className="px-5 py-4 font-semibold">Address</th>
                  <th className="px-5 py-4 font-semibold">Notes</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {sortedCompanies.map((company) => (
                  <tr
                    key={company.id}
                    className="transition-colors hover:bg-slate-50/80"
                  >
                    <td className="px-5 py-4">
                      <CompanyLogo
                        name={company.companyName}
                        website={company.website}
                      />
                    </td>

                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {company.companyName || "—"}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {company.district || "—"}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin
                          size={14}
                          className="shrink-0 text-slate-400"
                        />
                        {company.city || "—"}
                      </span>
                    </td>

                    <td className="max-w-xs whitespace-normal px-5 py-4 text-slate-600">
                      {company.address || "—"}
                    </td>

                    <td className="max-w-xs whitespace-normal px-5 py-4 text-slate-500">
                      {company.notes || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function loadCompanies() {
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
          : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCompanies();
  }, []);

  function navigate(page) {
    setActivePage(page);
    setSidebarOpen(false);
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
              <p className="text-lg font-bold tracking-tight">
                JobTracker
              </p>
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

        <div className="px-4 pt-7">
          <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Workspace
          </p>

          <nav className="space-y-1">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
              const active = activePage === id;

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
                    <span
                      className={`ml-auto rounded-full px-2 py-0.5 text-xs ${
                        active
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {companies.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

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
          {activePage === "dashboard" ? (
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
          ) : (
            <CompaniesPage
              companies={companies}
              loading={loading}
              error={error}
              onRefresh={loadCompanies}
            />
          )}
        </main>
      </div>
    </div>
  );
}
