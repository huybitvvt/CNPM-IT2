import React, { useEffect, useMemo, useState } from "react";
import { adminService } from "../../api/admin.service";
import { CountUp } from "../../Components/common/Reveal";
import {
  BookOpen,
  BarChart3,
  Database,
  Layers,
  ShieldCheck,
  TriangleAlert,
  UserCheck,
  Users,
} from "lucide-react";

function StatCard({ icon: Icon, label, value, hint, tone }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg">
      <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${tone} opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-20`} />
      <div className="relative mb-5 flex items-center justify-between gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tone} text-white shadow-lg`}>
          <Icon size={22} />
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-600">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          LIVE
        </span>
      </div>
      <p className="relative m-0 font-display text-3xl font-extrabold text-slate-900">
        <CountUp value={Number(value) || 0} />
      </p>
      <h3 className="relative m-0 mt-1.5 text-sm font-bold uppercase tracking-wide text-slate-700">{label}</h3>
      <p className="relative m-0 mt-2 text-sm leading-6 text-slate-500">{hint}</p>
    </div>
  );
}

function Dashboard({ isAuthenticated }) {
  const [summary, setSummary] = useState({
    users: 0,
    courses: 0,
    enrollments: 0,
    courseItems: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let active = true;

    async function fetchData() {
      setLoading(true);
      setError("");

      const [usersRes, coursesRes, learningRes] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getAllCourses(),
        adminService.getAllLearning(),
      ]);

      if (!active) return;

      if (!usersRes.success || !coursesRes.success || !learningRes.success) {
        setError("Không thể tải đầy đủ dữ liệu dashboard. Vui lòng kiểm tra token admin hoặc backend API.");
      }

      setSummary({
        users: usersRes.success ? usersRes.data.length : 0,
        courses: coursesRes.success ? coursesRes.data.length : 0,
        enrollments: learningRes.success ? learningRes.data.length : 0,
        courseItems: coursesRes.success ? coursesRes.data : [],
      });
      setLoading(false);
    }

    fetchData();

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const categoryStats = useMemo(() => {
    const counts = summary.courseItems.reduce((acc, course) => {
      const category = course.category || "Chưa phân loại";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [summary.courseItems]);

  const maxCategoryValue = Math.max(...categoryStats.map((item) => item.value), 1);

  const stats = [
    {
      icon: Users,
      label: "Người dùng",
      value: summary.users,
      hint: "Tổng tài khoản hiện có trong hệ thống.",
      tone: "from-sky-500 to-blue-600",
    },
    {
      icon: BookOpen,
      label: "Khóa học",
      value: summary.courses,
      hint: "Số khóa học đang có trong catalog.",
      tone: "from-emerald-500 to-teal-500",
    },
    {
      icon: UserCheck,
      label: "Lượt đăng ký",
      value: summary.enrollments,
      hint: "Số bản ghi đăng ký học lấy từ bảng learning.",
      tone: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <div className="font-sans text-left">
      <div className="mb-8 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <p className="m-0 text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">Admin dashboard</p>
          <h1 className="m-0 mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Tổng quan hệ thống
          </h1>
          <p className="m-0 mt-3 max-w-3xl text-sm leading-7 text-slate-500">
            Các chỉ số bên dưới lấy trực tiếp từ API/Supabase. Hệ thống không hiển thị phần trăm hoàn thành khi chưa có dữ liệu tiến độ thật.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-500 shadow-soft">
          {loading ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              Đang đồng bộ dữ liệu...
            </>
          ) : (
            "Dữ liệu đang hiển thị theo trạng thái hiện tại"
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
          <TriangleAlert size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {stats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="m-0 text-sm font-bold uppercase tracking-[0.15em] text-emerald-600">Catalog</p>
              <h2 className="m-0 mt-1 font-display text-xl font-extrabold text-slate-900">Phân bổ khóa học theo danh mục</h2>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Layers size={20} />
            </div>
          </div>

          {categoryStats.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm font-semibold text-slate-500">
              Chưa có khóa học nào để thống kê danh mục.
            </div>
          ) : (
            <div className="grid gap-4">
              {categoryStats.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-bold text-slate-900">{item.label}</span>
                    <span className="font-bold text-slate-500">{item.value} khóa học</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-[width] duration-700 ease-out"
                      style={{ width: `${(item.value / maxCategoryValue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="m-0 text-sm font-bold uppercase tracking-[0.15em] text-emerald-600">Kỹ thuật</p>
              <h2 className="m-0 mt-1 font-display text-xl font-extrabold text-slate-900">Trạng thái triển khai</h2>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <BarChart3 size={20} />
            </div>
          </div>

          <div className="grid gap-3">
            {[
              { icon: Database, label: "Database", value: "Supabase PostgreSQL", tone: "from-cyan-500 to-teal-400" },
              { icon: ShieldCheck, label: "Bảo mật", value: "JWT + phân quyền admin/user", tone: "from-amber-500 to-orange-500" },
              { icon: BookOpen, label: "Dữ liệu học tập", value: "Course, learning, quiz, progress", tone: "from-emerald-500 to-teal-500" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${item.tone} text-white shadow`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="m-0 text-xs font-bold uppercase tracking-wide text-slate-500">{item.label}</p>
                    <p className="m-0 mt-0.5 text-sm font-bold text-slate-900">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
