import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";
import Navbar from "../../Components/common/Navbar";
import { authService } from "../../api/auth.service";
import GoogleSignInButton from "./GoogleSignInButton";
import {
  Lock,
  LogIn,
  Mail,
  CheckCircle2,
  Code2,
  Trophy,
  LineChart,
} from "lucide-react";

function AuthField({ id, label, icon: Icon, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-bold text-slate-800">
        {label}
      </label>
      <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 transition focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-500/10">
        <Icon className="mr-3 h-5 w-5 text-slate-400" />
        <input
          id={id}
          className="min-h-[48px] w-full border-0 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
          {...props}
        />
      </div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUserContext();
  const successMessage = location.state?.message;

  const login = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await authService.login(email, password);

      if (result.success) {
        if (result.user) {
          setUser(result.user);
        }
        navigate("/courses");
      } else {
        setError(result.error || "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleCredential = async (credential) => {
    setIsLoading(true);
    setError("");

    const result = await authService.googleLogin(credential);
    if (result.success) {
      if (result.user) {
        setUser(result.user);
      }
      navigate("/courses");
    } else {
      setError(result.error || "Đăng nhập Google thất bại.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f6faf8] font-sans text-slate-900">
      <Navbar />
      <main className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft-lg lg:grid-cols-[0.95fr_1.05fr]">
          {/* ===== Left: brand panel ===== */}
          <section className="relative overflow-hidden bg-[#070b14] p-8 text-white sm:p-10 lg:p-12">
            <div className="mesh-animated absolute inset-0 animate-gradient-shift bg-mesh-hero opacity-90" />
            <div className="absolute inset-0 bg-grid-dark opacity-50" />
            <div className="aurora-blob left-[-10%] top-[-10%] h-64 w-64 bg-emerald-500/40" />
            <div className="aurora-blob right-[-10%] bottom-[-10%] h-72 w-72 bg-violet-500/30" style={{ animationDelay: "-5s" }} />

            <div className="relative">
              <Link to="/" className="inline-flex items-center gap-2.5 no-underline">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-sm font-black text-white shadow-md">
                  {"</>"}
                </div>
                <span className="font-display text-xl font-extrabold tracking-tight text-white">
                  Code<span className="text-emerald-400">Learn</span>
                </span>
              </Link>

              <h1 className="mt-10 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
                Tiếp tục lộ trình
                <br />
                <span className="text-gradient bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-400">
                  học lập trình của bạn
                </span>
              </h1>
              <p className="mt-4 max-w-md text-base leading-7 text-slate-300">
                Truy cập khóa học đã đăng ký, theo dõi tiến độ, làm quiz và nhận chứng chỉ khi hoàn thành.
              </p>

              <div className="mt-10 grid gap-3">
                {[
                  { icon: Code2, text: "Khóa học Frontend, Backend, Data, DevOps" },
                  { icon: LineChart, text: "Theo dõi tiến độ học từng bài" },
                  { icon: Trophy, text: "Chứng chỉ hoàn thành & dashboard admin" },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 backdrop-blur"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300">
                      <Icon size={16} />
                    </span>
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ===== Right: form ===== */}
          <section className="p-6 sm:p-10 lg:p-12">
            <div className="mb-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg">
                <LogIn className="h-6 w-6" />
              </div>
              <h2 className="m-0 font-display text-3xl font-extrabold text-slate-900">Chào mừng trở lại</h2>
              <p className="m-0 mt-2 text-sm font-medium text-slate-500">
                Dùng email và mật khẩu đã đăng ký để vào hệ thống.
              </p>
            </div>

            {successMessage && (
              <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                <CheckCircle2 size={16} />
                {successMessage}
              </div>
            )}

            <form autoComplete="off" onSubmit={login} className="space-y-5">
              <AuthField
                id="email"
                name="email"
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@gmail.com"
                icon={Mail}
              />

              <AuthField
                id="password"
                name="password"
                type="password"
                label="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Nhập mật khẩu"
                icon={Lock}
              />

              <div className="flex items-center justify-between gap-3 text-sm">
                <label className="flex items-center gap-2 font-semibold text-slate-500">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-emerald-500" />
                  Ghi nhớ đăng nhập
                </label>
                <Link to="/forgot-password" className="font-bold text-emerald-600 transition hover:text-emerald-700">
                  Quên mật khẩu?
                </Link>
              </div>

              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
                  <p className="m-0 text-sm font-bold text-rose-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3.5 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-emerald-500/20 ${
                  isLoading
                    ? "cursor-not-allowed bg-slate-400 text-white"
                    : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-glow-emerald"
                }`}
              >
                {!isLoading && (
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                )}
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs font-bold uppercase tracking-wide text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              hoặc
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <GoogleSignInButton
              onSuccess={handleGoogleCredential}
              onError={setError}
            />

            <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-semibold text-slate-500">
              Chưa có tài khoản?{" "}
              <Link to="/register" className="font-bold text-emerald-600 transition hover:text-emerald-700">
                Tạo tài khoản học tập
              </Link>
            </div>

            <p className="mt-5 text-center text-xs font-medium leading-6 text-slate-400">
              Khi đăng nhập, bạn đồng ý với{" "}
              <Link to="/terms" className="font-bold text-emerald-600">Điều khoản sử dụng</Link>
              {" "}và{" "}
              <Link to="/privacy" className="font-bold text-emerald-600">Chính sách bảo mật</Link>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Login;
