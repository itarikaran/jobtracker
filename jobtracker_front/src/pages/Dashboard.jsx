import { Building2, MapPin } from "lucide-react";

export default function Dashboard({ companies, onOpenCompanies }) {
  const districtCounts = companies.reduce((counts, company) => {
    const district = company.district?.trim() || "Not specified";
    counts[district] = (counts[district] || 0) + 1;
    return counts;
  }, {});

  const districts = Object.entries(districtCounts).sort(
    ([a], [b]) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
  );

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
          Overview
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Dashboard
        </h1>
        <p className="mt-2 text-slate-500">
          Overview of your company directory.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
            className="mt-5 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            View all companies →
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Districts
              </p>
              <p className="mt-3 text-4xl font-bold text-slate-900">
                {districts.length}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <MapPin size={26} />
            </div>
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-lg font-bold text-slate-900">
            District-wise Companies
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Number of companies in each district.
          </p>
        </div>

        {districts.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">
            No company data available.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {districts.map(([district, count]) => (
              <div
                key={district}
                className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                    <MapPin size={18} />
                  </div>
                  <span className="font-medium text-slate-800">
                    {district}
                  </span>
                </div>

                <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
                  {count} {count === 1 ? "company" : "companies"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
