import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../Components/common/Navbar";
import { authService } from "../../api/auth.service";
import {
  Briefcase,
  Calendar,
  Github,
  Linkedin,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
  UserPlus,
} from "lucide-react";

function FormField({ id, label, icon: Icon, className = "", ...props }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-bold text-slate-800">
        {label}
      </label>
      <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 transition focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-500/10">
        <Icon className="mr-3 h-5 w-5 text-slate-400" />
        <input
          id={id}
          className="min-h-[46px] w-full border-0 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
          {...props}
        />
      </div>
    </div>
  );
}

function SectionTitle({ index, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-xs font-black text-white shadow">
        {index}
      </span>
      <div>
        <h3 className="m-0 font-display text-lg font-extrabold text-slate-900">{title}</h3>
        <p className="m-0 mt-0.5 text-sm font-medium text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

function RegistrationForm() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobileNumber: "",
    password: "",
    dob: "",
    gender: "",
    location: "",
    profession: "",
    linkedin_url: "",
    github_url: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await authService.register(formData);

      if (result.success) {
        navigate("/login", {
          state: { message: "Tạo tài khoản thành công. Vui lòng đăng nhập để tiếp tục." },
        });
      } else {
        setError(result.error || "Tạo tài khoản thất bại. Vui lòng kiểm tra lại thông tin.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Có lỗi xảy ra khi tạo tài khoản. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6faf8] font-sans text-slate-900">
      <Navbar />

      {/* compact dark header band */}
      <section className="relative overflow-hidden bg-[#070b14]">
        <div className="mesh-animated absolute inset-0 animate-gradient-shift bg-mesh-hero opacity-90" />
        <div className="absolute inset-0 bg-grid-dark opacity-50" />
        <div className="aurora-blob left-[-4%] top-[-40%] h-64 w-64 bg-emerald-500/30" />
        <div className="aurora-blob right-[4%] bottom-[-50%] h-72 w-72 bg-sky-500/25" style={{ animationDelay: "-4s" }} />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#f6faf8] to-transparent" />
        <div className="relative mx-auto flex max-w-6xl flex-col justify-between gap-4 px-4 py-14 text-left sm:px-6 lg:flex-row lg:items-end lg:px-8">
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg">
              <UserPlus className="h-6 w-6" />
            </div>
            <h1 className="m-0 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Tạo tài khoản học lập trình
            </h1>
            <p className="m-0 mt-3 max-w-2xl text-base leading-7 text-slate-300">
              Hoàn thiện hồ sơ để đăng ký khóa học, lưu tiến độ và nhận chứng chỉ khi hoàn thành.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-300 backdrop-blur">
            Đã có tài khoản?{" "}
            <Link to="/login" className="font-bold text-emerald-400 transition hover:text-emerald-300">
              Đăng nhập
            </Link>
          </div>
        </div>
      </section>

      <main className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto -mt-8 max-w-6xl">
          <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft-lg sm:p-8">
            <div className="grid gap-8">
              <section className="grid gap-5">
                <SectionTitle index="1" title="Thông tin đăng nhập" subtitle="Các trường bắt buộc để hệ thống xác thực người dùng." />
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <FormField id="username" name="username" value={formData.username} onChange={handleChange} icon={User} label="Họ và tên" required placeholder="Nguyễn Văn A" />
                  <FormField id="email" name="email" type="email" value={formData.email} onChange={handleChange} icon={Mail} label="Email" required placeholder="you@example.com" />
                  <FormField id="mobileNumber" name="mobileNumber" type="tel" value={formData.mobileNumber} onChange={handleChange} icon={Phone} label="Số điện thoại" required placeholder="0912345678" />
                  <FormField id="password" name="password" type="password" value={formData.password} onChange={handleChange} icon={Lock} label="Mật khẩu" required placeholder="Tối thiểu 6 ký tự" />
                </div>
              </section>

              <section className="grid gap-5">
                <SectionTitle index="2" title="Hồ sơ cá nhân" subtitle="Thông tin giúp admin và instructor hỗ trợ người học tốt hơn." />
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <FormField id="dob" name="dob" type="date" value={formData.dob} onChange={handleChange} icon={Calendar} label="Ngày sinh" />
                  <div>
                    <label htmlFor="gender" className="mb-2 block text-sm font-bold text-slate-800">
                      Giới tính
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="Male">Nam</option>
                      <option value="Female">Nữ</option>
                      <option value="Other">Khác</option>
                      <option value="Prefer not to say">Không muốn chia sẻ</option>
                    </select>
                  </div>
                  <FormField id="location" name="location" value={formData.location} onChange={handleChange} icon={MapPin} label="Khu vực" placeholder="TP. Hồ Chí Minh" />
                  <FormField id="profession" name="profession" value={formData.profession} onChange={handleChange} icon={Briefcase} label="Nghề nghiệp" placeholder="Sinh viên, lập trình viên..." />
                </div>
              </section>

              <section className="grid gap-5">
                <SectionTitle index="3" title="Liên kết học tập" subtitle="Có thể bổ sung GitHub/LinkedIn để thể hiện hồ sơ lập trình." />
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <FormField id="linkedin_url" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} icon={Linkedin} label="LinkedIn" placeholder="https://linkedin.com/in/username" />
                  <FormField id="github_url" name="github_url" value={formData.github_url} onChange={handleChange} icon={Github} label="GitHub" placeholder="https://github.com/username" />
                </div>
              </section>

              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
                  <p className="m-0 text-sm font-bold text-rose-700">{error}</p>
                </div>
              )}

              <div className="flex flex-col items-start justify-between gap-4 border-t border-slate-100 pt-5 lg:flex-row lg:items-center">
                <p className="m-0 max-w-xl text-xs font-medium leading-6 text-slate-500">
                  Khi tạo tài khoản, bạn đồng ý với{" "}
                  <Link to="/terms" className="font-bold text-emerald-600">Điều khoản sử dụng</Link>
                  {" "}và{" "}
                  <Link to="/privacy" className="font-bold text-emerald-600">Chính sách bảo mật</Link>.
                </p>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3.5 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-emerald-500/20 lg:w-auto ${
                    isLoading
                      ? "cursor-not-allowed bg-slate-400 text-white"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-glow-emerald"
                  }`}
                >
                  {!isLoading && (
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  )}
                  {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default RegistrationForm;
