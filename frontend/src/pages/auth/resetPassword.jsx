import React, { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../Components/common/Navbar";
import { authService } from "../../api/auth.service";
import { ArrowLeft, KeyRound, Lock } from "lucide-react";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("Link đặt lại mật khẩu không hợp lệ hoặc thiếu token.");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setIsLoading(true);
    const result = await authService.resetPassword(token, password);
    setIsLoading(false);

    if (result.success) {
      navigate("/login", {
        state: { message: "Đặt lại mật khẩu thành công. Vui lòng đăng nhập bằng mật khẩu mới." },
      });
    } else {
      setError(result.error || "Không đặt lại được mật khẩu.");
    }
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
              <KeyRound size={24} />
            </div>
            <h1 className="m-0 text-3xl font-black">Đặt lại mật khẩu</h1>
            <p className="m-0 mt-3 text-sm leading-6 text-[#61706b]">
              Tạo mật khẩu mới cho tài khoản CodePath LMS của bạn.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="new-password" className="mb-2 block text-sm font-bold">
                Mật khẩu mới
              </label>
              <div className="flex items-center rounded-lg border border-[#d9e5df] bg-white px-3 transition focus-within:border-[#16a676] focus-within:ring-4 focus-within:ring-[#16a676]/10">
                <Lock className="mr-3 h-5 w-5 text-[#61706b]" />
                <input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  placeholder="Tối thiểu 6 ký tự"
                  className="min-h-[48px] w-full border-0 bg-transparent text-sm font-semibold outline-none placeholder:text-[#93a19c]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="mb-2 block text-sm font-bold">
                Xác nhận mật khẩu
              </label>
              <div className="flex items-center rounded-lg border border-[#d9e5df] bg-white px-3 transition focus-within:border-[#16a676] focus-within:ring-4 focus-within:ring-[#16a676]/10">
                <Lock className="mr-3 h-5 w-5 text-[#61706b]" />
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  placeholder="Nhập lại mật khẩu mới"
                  className="min-h-[48px] w-full border-0 bg-transparent text-sm font-semibold outline-none placeholder:text-[#93a19c]"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[#16a676] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#16a676]/20 transition hover:bg-[#087c5b] disabled:cursor-not-allowed disabled:bg-[#93a19c]"
            >
              {isLoading ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default ResetPassword;
