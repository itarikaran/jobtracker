import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  ChevronDown,
  MapPin,
  Pencil,
  Trash2,
  Building2,
} from "lucide-react";

import CompanyLogo from "../components/CompanyLogo";

function compareText(a, b) {
  return String(a ?? "").localeCompare(String(b ?? ""), undefined, {
    sensitivity: "base",
    numeric: true,
  });
}

function getWebsiteUrl(website) {
  if (!website?.trim()) return null;

  try {
    const url = new URL(
      /^https?:\/\//i.test(website)
        ? website
        : `https://${website}`
    );

    if (!["http:", "https:"].includes(url.protocol)) {
      return null;
    }

    return url.href;
  } catch {
    return null;
  }
}

export default function Companies({
  companies,
  loading,
  error,
  onRefresh,
  onAdd,
  onEdit,
  onDelete,
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

    return filtered.sort((a, b) => {
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
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Directory
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Companies
          </h1>
          <p className="mt-2 text-slate-500">
            Manage your company directory.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            onClick={onAdd}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus size={18} />
            Add Company
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

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
            aria-label="Sort companies"
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm outline-none focus:border-indigo-500"
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
          <p className="p-12 text-center text-sm text-slate-500">
            Loading companies...
          </p>
        ) : sortedCompanies.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 size={32} className="mx-auto text-slate-300" />
            <p className="mt-3 font-semibold text-slate-800">
              No companies found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {search
                ? "Try another search term."
                : "Click Add Company to create your first record."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">Logo</th>
                  <th className="px-5 py-4">Company name</th>
                  <th className="px-5 py-4">District</th>
                  <th className="px-5 py-4">City</th>
                  <th className="px-5 py-4">Address</th>
                  <th className="px-5 py-4">Notes</th>
                  <th className="px-5 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {sortedCompanies.map((company) => {
                  const website = getWebsiteUrl(company.website);

                  return (
                    <tr
                      key={company.id}
                      className="hover:bg-slate-50/80"
                    >
                      <td className="px-5 py-4">
                        <CompanyLogo
                          name={company.companyName}
                          website={company.website}
                        />
                      </td>

                      <td className="px-5 py-4 font-semibold">
                        {website ? (
                          <a
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 hover:underline"
                          >
                            {company.companyName || "Unnamed company"}
                          </a>
                        ) : (
                          <span className="text-slate-900">
                            {company.companyName || "Unnamed company"}
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {company.district || "—"}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={14} className="shrink-0 text-slate-400" />
                          {company.city || "—"}
                        </span>
                      </td>

                      <td className="max-w-xs whitespace-normal px-5 py-4 text-slate-600">
                        {company.address || "—"}
                      </td>

                      <td className="max-w-xs whitespace-normal px-5 py-4 text-slate-500">
                        {company.notes || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            title="Edit company"
                            aria-label={`Edit ${company.companyName}`}
                            onClick={() => onEdit(company)}
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            title="Delete company"
                            aria-label={`Delete ${company.companyName}`}
                            onClick={() => onDelete(company)}
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
