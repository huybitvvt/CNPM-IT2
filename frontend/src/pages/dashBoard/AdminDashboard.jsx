import { useState } from "react";
import Courses from "./DCourses";
import Dashboard from "./Dashboard";
import SideBar from "./SideBar";
import Users from "./DUsers";
import { authService } from "../../api/auth.service";
import { Lock, Mail, ShieldCheck } from "lucide-react";


function AdminDashboard() {
  const [current, setCurrent] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAdminAuthenticated());
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const mobileTabs = [
    { key: "dashboard", label: "Tổng quan" },
    { key: "user", label: "Người dùng" },
    { key: "courses", label: "Khóa học" },
  ];

  const renderContent = () => {
    switch (current) {
      case "dashboard":
        return <Dashboard isAuthenticated = {isAuthenticated} />;
      case "user":
        return <Users />;
      case "courses":
        return <Courses />;
      default:
        return <Dashboard isAuthenticated = {isAuthenticated}/>;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const result = await authService.login(username, password);

    if (result.success && result.user.role === "ROLE_ADMIN") {
      setIsAuthenticated(true);
      setError("");
    } else if (result.success && result.user.role !== "ROLE_ADMIN") {
      setError("Tài khoản này không có quyền quản trị.");
    } else {
      setError(result.error || "Email hoặc mật khẩu không chính xác.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f6faf8] font-sans">
      <SideBar current={current} onSelect={setCurrent} />
      <section className="min-w-0 flex-1 transition-all duration-300">
        <main className="p-5 sm:p-8">
          <div className="mb-5 grid grid-cols-3 gap-2 md:hidden">
            {mobileTabs.map((item) => (
              <button
                key={item.key}
                onClick={() => setCurrent(item.key)}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                  current === item.key
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow"
                    : "border border-slate-200 bg-white text-slate-500"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          {renderContent()}
        </main>
      </section>

      {!isAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070b14]/80 px-4 backdrop-blur-md">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-soft-lg sm:p-8">
            <div className="aurora-blob left-[-20%] top-[-30%] h-40 w-40 bg-emerald-500/20" />
            <div className="relative mb-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="m-0 font-display text-2xl font-extrabold text-slate-900">
                Đăng nhập quản trị
              </h2>
              <p className="m-0 mt-2 text-sm font-medium text-slate-500">
                Chỉ tài khoản admin mới được truy cập khu vực này.
              </p>
            </div>
            <form onSubmit={handleLogin} className="relative space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-800">
                  Email
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 transition focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-500/10">
                  <Mail className="mr-3 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="min-h-[48px] w-full border-0 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                    placeholder="admin@gmail.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-800">
                  Mật khẩu
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 transition focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-500/10">
                  <Lock className="mr-3 h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="min-h-[48px] w-full border-0 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                    placeholder="Nhập mật khẩu admin"
                    required
                  />
                </div>
              </div>
              {error && (
                <p className="m-0 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p>
              )}
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3.5 text-sm font-bold text-white shadow-glow-emerald transition focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
              >
                Đăng nhập
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
