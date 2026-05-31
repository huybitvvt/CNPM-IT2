import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/common/Navbar";
import { authService } from "../../api/auth.service";
import { ArrowLeft, Mail, Send } from "lucide-react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    setError("");
    setIsLoading(true);

    const result = await authService.forgotPassword(email);
    if (result.success) {
      setStatus(result.message || "Nếu email tồn tại, liên kết đặt lại mật khẩu đã được gửi.");
    } else {
      setError(result.error || "Không gửi được email đặt lại mật khẩu.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f6faf8] text-[#10201c]">
      <Navbar />
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
        <section className="w-full max-w-xl rounded-lg border border-[#d9e5df] bg-white p-6 shadow-xl sm:p-8">
          <Link to="/login" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#087c5b] no-underline">
            <ArrowLeft size={17} />
            Quay lại đăng nhập
          </Link>

          <div className="mb-7">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#e9f8f1] text-[#087c5b]">
              <Mail size={24} />
            </div>
            <h1 className="m-0 text-3xl font-black">Quên mật khẩu</h1>
            <p className="m-0 mt-3 text-sm leading-6 text-[#61706b]">
              Nhập email đã đăng ký. Hệ thống sẽ gửi liên kết đặt lại mật khẩu qua SMTP.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="reset-email" className="mb-2 block text-sm font-bold">
                Email
              </label>
              <div className="flex items-center rounded-lg border border-[#d9e5df] bg-white px-3 transition focus-within:border-[#16a676] focus-within:ring-4 focus-within:ring-[#16a676]/10">
                <Mail className="mr-3 h-5 w-5 text-[#61706b]" />
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  placeholder="you@example.com"
                  className="min-h-[48px] w-full border-0 bg-transparent text-sm font-semibold outline-none placeholder:text-[#93a19c]"
                />
              </div>
            </div>

            {status && (
              <div className="rounded-lg border border-[#bdebd8] bg-[#e9f8f1] px-4 py-3 text-sm font-bold text-[#087c5b]">
                {status}
              </div>
            )}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#16a676] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#16a676]/20 transition hover:bg-[#087c5b] disabled:cursor-not-allowed disabled:bg-[#93a19c]"
            >
              <Send size={18} />
              {isLoading ? "Đang gửi email..." : "Gửi liên kết đặt lại"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default ForgotPassword;
