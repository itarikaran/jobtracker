import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import CompanyService from "../services/CompanyService";

const AddCompany = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [company, setCompany] = useState({
    companyName: "",
    district: "",
    city: "",
    address: "",
    notes: "",
    website: "",
  });

  const [loading, setLoading] = useState(false);

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      loadCompany();
    }
  }, [id]);

  const loadCompany = async () => {
    try {
      const response = await CompanyService.getCompany(id);
      setCompany(response.data);
    } catch (error) {
      console.error("Error loading company:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCompany({
      ...company,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (isEditMode) {
        await CompanyService.updateCompany(id, company);
      } else {
        await CompanyService.addCompany(company);
      }

      navigate("/companies");
    } catch (error) {
      console.error("Error saving company:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 md:pl-64">
      <Sidebar />
      <Header />

      <main className="mx-auto w-full max-w-[1280px] px-5 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {isEditMode ? "Edit Company" : "Add Company"}
          </h1>

          <p className="mt-1 text-sm text-slate-600">
            {isEditMode
              ? "Update the details for this company."
              : "Save a company to use while tracking applications."}
          </p>
        </div>

        <div className="max-w-5xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {/* Company Name */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Company Name
            </label>

            <input
              type="text"
              name="companyName"
              value={company.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* District */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              District
            </label>

            <input
              type="text"
              name="district"
              value={company.district}
              onChange={handleChange}
              placeholder="Enter district"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* City */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              City
            </label>

            <input
              type="text"
              name="city"
              value={company.city}
              onChange={handleChange}
              placeholder="Enter city"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Address */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Address
            </label>

            <textarea
              name="address"
              value={company.address}
              onChange={handleChange}
              placeholder="Enter company address"
              rows="3"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Website */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Website
            </label>

            <input
              type="url"
              name="website"
              value={company.website}
              onChange={handleChange}
              placeholder="https://www.example.com"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Notes
            </label>

            <textarea
              name="notes"
              value={company.notes}
              onChange={handleChange}
              placeholder="Enter notes"
              rows="3"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 border-t border-slate-100 pt-4 md:col-span-2 xl:col-span-3">

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Save Company"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/companies")}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

          </div>

        </form>

        </div>

      </main>
    </div>
  );
};

export default AddCompany;
