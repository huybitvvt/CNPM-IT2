import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../Components/common/Navbar";
import { authService } from "../../api/auth.service";
import { ArrowLeft, CheckCircle2, MailCheck, XCircle } from "lucide-react";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Đang xác thực tài khoản của bạn...");

  useEffect(() => {
    let isMounted = true;

    async function verify() {
      if (!token) {
        setStatus("error");
        setMessage("Link xác thực không hợp lệ hoặc thiếu token.");
        return;
      }

      const result = await authService.verifyEmail(token);
      if (!isMounted) {
        return;
      }

      if (result.success) {
        setStatus("success");
        setMessage(result.message || "Xác thực tài khoản thành công.");
        setTimeout(() => {
          navigate("/login", {
            state: { message: "Xác thực tài khoản thành công. Vui lòng đăng nhập." },
          });
        }, 1800);
      } else {
        setStatus("error");
        setMessage(result.error || "Không xác thực được tài khoản.");
      }
    }

    verify();
    return () => {
      isMounted = false;
    };
  }, [navigate, token]);

  const isSuccess = status === "success";
  const isError = status === "error";

  return (
    <div className="min-h-screen bg-[#f6faf8] text-[#10201c]">
      <Navbar />
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
        <section className="w-full max-w-xl rounded-lg border border-[#d9e5df] bg-white p-6 text-center shadow-xl sm:p-8">
          <div className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl ${
            isSuccess ? "bg-emerald-50 text-emerald-600" : isError ? "bg-rose-50 text-rose-600" : "bg-sky-50 text-sky-600"
          }`}>
            {isSuccess ? <CheckCircle2 size={28} /> : isError ? <XCircle size={28} /> : <MailCheck size={28} />}
          </div>

          <h1 className="m-0 text-3xl font-black">
            {isSuccess ? "Đã xác thực" : isError ? "Không xác thực được" : "Xác thực email"}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-6 text-[#61706b]">
            {message}
          </p>

          <Link
            to="/login"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-lg bg-[#16a676] px-5 py-3 text-sm font-black text-white no-underline shadow-lg shadow-[#16a676]/20 transition hover:bg-[#087c5b]"
          >
            <ArrowLeft size={17} />
            Về trang đăng nhập
          </Link>
        </section>
      </main>
    </div>
  );
}

export default VerifyEmail;
