import { BriefcaseBusiness, LayoutDashboard, PlusCircle } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard, end: true },
  { label: "Applications", to: "/applications", icon: BriefcaseBusiness, end: true },
  { label: "Add Application", to: "/applications/add", icon: PlusCircle },
];

function Sidebar() {
  const navigate = useNavigate();
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-slate-200 bg-white md:fixed md:inset-y-0 md:left-0 md:z-40 md:h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="px-5 py-6 md:px-6"><button onClick={() => navigate("/")} className="text-left transition-opacity duration-200 hover:opacity-85"><div className="text-2xl font-bold tracking-tight text-indigo-700">JobTracker</div><div className="mt-0.5 text-sm font-medium text-slate-500">Career Manager</div></button></div>
      <nav className="flex gap-1 overflow-x-auto border-t border-slate-200 px-3 py-3 md:block md:space-y-1 md:overflow-visible md:border-t-0 md:px-3">
        {navItems.map(({ label, to, icon: Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex h-11 shrink-0 items-center gap-3 rounded-lg px-3.5 text-sm font-semibold transition-all duration-200 ease-out ${isActive ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-inset ring-indigo-100" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}><Icon size={19} strokeWidth={2.2} />{label}</NavLink>)}
      </nav>
    </aside>
  );
}

export default Sidebar;
