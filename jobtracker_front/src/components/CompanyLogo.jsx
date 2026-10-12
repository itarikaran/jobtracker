import { useState } from "react";

export default function CompanyLogo({ name, website }) {
  const [failed, setFailed] = useState(false);

  let logoUrl = "";

  try {
    if (website) {
      const url = new URL(
        website.startsWith("http") ? website : `https://${website}`
      );

      logoUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
        url.hostname
      )}&sz=64`;
    }
  } catch {
    logoUrl = "";
  }

  const showLogo = logoUrl && !failed;

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
      {showLogo ? (
        <img
          src={logoUrl}
          alt=""
          className="h-7 w-7 object-contain"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-sm font-bold text-indigo-600">
          {name?.trim()?.charAt(0)?.toUpperCase() || "?"}
        </span>
      )}
    </div>
  );
}
