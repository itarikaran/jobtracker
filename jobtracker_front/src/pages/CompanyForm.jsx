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
  { name: "address", label: "Address" },
  { name: "website", label: "Website", type: "url" },
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

    const payload = {
      companyName: form.companyName.trim(),
      district: form.district.trim(),
      city: form.city.trim(),
      address: form.address.trim(),
      notes: form.notes.trim(),
      website: form.website.trim()
        ? (/^https?:\/\//i.test(form.website.trim())
            ? form.website.trim()
            : `https://${form.website.trim()}`)
        : "",
    };

    await onSubmit(payload);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600"
      >
        <ArrowLeft size={17} />
        Back to Companies
      </button>

      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-100 p-3 text-indigo-700">
            <Building2 size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {isEditing ? "Edit Company" : "Add Company"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {isEditing
                ? "Update the company's information."
                : "Enter the details of the new company."}
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {FIELDS.map((field) => (
            <div
              key={field.name}
              className={
                field.name === "address" ? "sm:col-span-2" : ""
              }
            >
              <label
                htmlFor={field.name}
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
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
                placeholder={
                  field.name === "website"
                    ? "https://example.com"
                    : `Enter ${field.label.toLowerCase()}`
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          ))}

          <div className="sm:col-span-2">
            <label
              htmlFor="notes"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Notes
            </label>

            <textarea
              id="notes"
              name="notes"
              rows={4}
              value={form.notes}
              onChange={handleChange}
              placeholder="Add application notes, job details, or reminders..."
              className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        {(validationError || error) && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {validationError || error}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onBack}
            disabled={saving}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
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
