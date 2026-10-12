import { useEffect, useState } from "react";
import { ArrowLeft, Building2, Save } from "lucide-react";

const EMPTY_COMPANY = {
  companyName: "",
  district: "",
  city: "",
  address: "",
  notes: "",
  website: "",
};

const FIELDS = [
  { name: "companyName", label: "Company Name", required: true },
  { name: "district", label: "District", required: true },
  { name: "city", label: "City", required: true },
  { name: "website", label: "Website", type: "url" },
  { name: "address", label: "Address", span: 2 },
];

export default function CompanyForm({
  company,
  saving,
  error,
  onBack,
  onSubmit,
}) {
  const isEditing = Boolean(company?.id);
  const [form, setForm] = useState(EMPTY_COMPANY);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    setForm(
      company
        ? {
            companyName: company.companyName ?? "",
            district: company.district ?? "",
            city: company.city ?? "",
            address: company.address ?? "",
            notes: company.notes ?? "",
            website: company.website ?? "",
          }
        : { ...EMPTY_COMPANY }
    );

    setValidationError("");
  }, [company]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setValidationError("");

    if (
      !form.companyName.trim() ||
      !form.district.trim() ||
      !form.city.trim()
    ) {
      setValidationError(
        "Company name, district and city are required."
      );
      return;
    }

    if (form.website.trim()) {
      try {
        const url = new URL(
          /^https?:\/\//i.test(form.website.trim())
            ? form.website.trim()
            : `https://${form.website.trim()}`
        );

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Invalid website");
        }
      } catch {
        setValidationError("Enter a valid website URL.");
        return;
      }
    }

    const website = form.website.trim();

    await onSubmit({
      companyName: form.companyName.trim(),
      district: form.district.trim(),
      city: form.city.trim(),
      address: form.address.trim(),
      notes: form.notes.trim(),
      website: website
        ? /^https?:\/\//i.test(website)
          ? website
          : `https://${website}`
        : "",
    });
  }

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  const labelClass =
    "mb-1.5 block text-sm font-medium text-slate-700";

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <button
        type="button"
        onClick={onBack}
        disabled={saving}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 disabled:opacity-50"
      >
        <ArrowLeft size={17} />
        Back to Companies
      </button>

      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-indigo-100 p-3 text-indigo-700">
          <Building2 size={24} />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {isEditing ? "Edit Company" : "Add Company"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {isEditing
              ? "Update company information."
              : "Enter the company details below."}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-7"
      >
        <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {FIELDS.map((field) => (
            <div
              key={field.name}
              className={field.span === 2 ? "sm:col-span-2 lg:col-span-2" : ""}
            >
              <label htmlFor={field.name} className={labelClass}>
                {field.label}
                {field.required && (
                  <span className="ml-1 text-red-500">*</span>
                )}
              </label>

              <input
                id={field.name}
                name={field.name}
                type={field.type || "text"}
                required={field.required}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                className={inputClass}
              />
            </div>
          ))}

          <div className="sm:col-span-2 lg:col-span-3">
            <label htmlFor="notes" className={labelClass}>
              Notes
            </label>

            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={form.notes}
              onChange={handleChange}
              placeholder="Add job details, application notes or reminders..."
              className={`${inputClass} resize-y`}
            />
          </div>
        </div>

        {(validationError || error) && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {validationError || error}
          </div>
        )}

        <div className="mt-5 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onBack}
            disabled={saving}
            className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={17} />
            {saving
              ? "Saving..."
              : isEditing
                ? "Update Company"
                : "Save Company"}
          </button>
        </div>
      </form>
    </div>
  );
}
