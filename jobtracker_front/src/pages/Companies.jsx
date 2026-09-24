import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import CompanyService from "../services/CompanyService";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [sortBy, setSortBy] = useState("companyName");

  const navigate = useNavigate();

  const loadCompanies = async () => {
    try {
      const response = await CompanyService.getCompanies();
      setCompanies(response.data);
    } catch (error) {
      console.error("Error loading companies:", error);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const getCompanyLogo = (website) => {
    if (!website) {
      return null;
    }

    try {
      const domain = new URL(website).hostname;

      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return null;
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this company?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await CompanyService.deleteCompany(id);

      setCompanies(
        companies.filter((company) => company.id !== id)
      );
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  const compareText = (firstValue, secondValue) =>
    (firstValue ?? "").localeCompare(secondValue ?? "", undefined, {
      sensitivity: "base",
    });

  const sortedCompanies = [...companies].sort((a, b) => {
    if (sortBy === "companyName") {
      return compareText(a.companyName, b.companyName);
    }

    const districtComparison = compareText(a.district, b.district);
    if (districtComparison !== 0) {
      return districtComparison;
    }

    const cityComparison = compareText(a.city, b.city);
    if (cityComparison !== 0) {
      return cityComparison;
    }

    return compareText(a.address, b.address);
  });

  return (
    <div className="min-h-screen bg-slate-50 md:pl-64">
      <Sidebar />
      <Header />

      <main className="mx-auto w-full max-w-[1280px] px-5 py-6 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">

        <h1 className="text-2xl font-bold text-slate-900">
          Companies
        </h1>

        <div className="flex flex-wrap items-center gap-3">

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="companyName">
              Company Name (A-Z)
            </option>

            <option value="district">
              Location: District, City, Address (A-Z)
            </option>
          </select>

          {/* Add Company */}
          <button
            onClick={() => navigate("/companies/add")}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <Plus size={18} />
            Add Company
          </button>

        </div>

      </div>

      {/* Companies Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">

        <table className="w-full border-collapse">

          <thead>
            <tr className="bg-slate-50">

              <th className="border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Company Name
              </th>

              <th className="border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700">
                District
              </th>

              <th className="border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700">
                City
              </th>

              <th className="border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Address
              </th>

              <th className="border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Notes
              </th>

              <th className="border-b border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700">
                Action
              </th>

            </tr>
          </thead>

          <tbody>

            {sortedCompanies.map((company) => {

              const logoUrl = getCompanyLogo(company.website);

              return (
                <tr
                  key={company.id}
                  className="hover:bg-slate-50"
                >

                  {/* Company Name + Logo */}
                  <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-900">

                    <div className="flex items-center gap-3">

                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt=""
                          className="h-8 w-8 rounded object-contain"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-xs font-semibold text-slate-500">
                          {company.companyName?.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <span className="font-medium">
                        {company.companyName}
                      </span>

                    </div>

                  </td>

                  {/* District */}
                  <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600">
                    {company.district}
                  </td>

                  {/* City */}
                  <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600">
                    {company.city}
                  </td>

                  {/* Address */}
                  <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600">
                    {company.address}
                  </td>

                  {/* Notes */}
                  <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-600">
                    {company.notes}
                  </td>

                  {/* Actions */}
                  <td className="border-b border-slate-100 px-4 py-3">

                    <div className="flex items-center justify-center gap-2">

                      {/* Edit */}
                      <button
                        onClick={() =>
                          navigate(`/companies/${company.id}/edit`)
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(company.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

      </main>
    </div>
  );
};

export default Companies;
