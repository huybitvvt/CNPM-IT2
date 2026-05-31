import { LayoutDashboard, Users, BookOpen, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

function SideBar({ current, onSelect }) {
  const menuItems = [
    { key: "dashboard", label: "Tổng quan", icon: LayoutDashboard },
    { key: "user", label: "Người dùng", icon: Users },
    { key: "courses", label: "Khóa học", icon: BookOpen },
  ];

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-slate-200 bg-white p-4 shadow-soft md:flex">
      <button
        type="button"
        className="flex items-center gap-3 border-b border-slate-100 px-2 pb-5 pt-2 text-left"
        onClick={() => onSelect("dashboard")}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-sm font-black text-white shadow-md">
          {"</>"}
        </div>
        <div>
          <span className="block font-display text-lg font-extrabold tracking-tight text-slate-900">
            Code<span className="text-emerald-600">Learn</span>
          </span>
          <span className="block text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-600">
            Admin console
          </span>
        </div>
      </button>

      <ul className="mt-6 flex flex-col gap-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = current === item.key;
          return (
            <li key={item.key}>
              <button
                onClick={() => onSelect(item.key)}
                className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-glow-emerald"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon size={18} className={isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"} />
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>

      <Link
        to="/"
        className="mt-3 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 no-underline transition hover:bg-slate-50 hover:text-slate-900"
      >
        <ExternalLink size={16} className="text-slate-400" />
        Về trang chủ
      </Link>

      <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-500">
        <p className="m-0 font-display font-extrabold text-slate-900">Đề tài CNPM</p>
        <p className="m-0 mt-1 font-medium">Quản lý khóa học lập trình trực tuyến.</p>
      </div>
    </aside>
  );
}

export default SideBar;
