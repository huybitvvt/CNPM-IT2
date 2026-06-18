import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../../Components/common/Navbar";
import Footer from "../../Components/common/Footer";
import { Reveal } from "../../Components/common/Reveal";
import { useNavigate } from "react-router-dom";
import { message, Modal } from "antd";
import { courseService } from "../../api/course.service";
import { learningService } from "../../api/learning.service";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Filter,
  Layers,
  Search,
  UserRound,
  Sparkles,
  X,
  Copy,
  QrCode,
} from "lucide-react";

const COURSE_PRICE = 2000;

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const categories = ["Frontend", "Backend", "Database", "Data", "Mobile", "DevOps", "Programming"];
const levels = ["Beginner", "Intermediate", "Advanced"];

const CATEGORY_TONE = {
  Frontend: "from-sky-500 to-blue-600",
  Backend: "from-emerald-500 to-teal-500",
  Database: "from-cyan-500 to-teal-400",
  Data: "from-amber-500 to-orange-500",
  DevOps: "from-violet-600 to-fuchsia-500",
  Mobile: "from-rose-500 to-pink-500",
  Programming: "from-slate-500 to-slate-700",
};

const LEVEL_TONE = {
  Beginner: "bg-emerald-50 text-emerald-700",
  Intermediate: "bg-amber-50 text-amber-700",
  Advanced: "bg-rose-50 text-rose-700",
};

function Courses() {
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterBy, setFilterBy] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [displayCount, setDisplayCount] = useState(6);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [activePayment, setActivePayment] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const userId = localStorage.getItem("id");
  const authToken = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await courseService.getAllCourses();
        if (coursesRes.success) setCourses(coursesRes.data || []);

        if (userId) {
          const enrollmentsRes = await learningService.getEnrollments(userId);
          if (enrollmentsRes.success) {
            setEnrolled(enrollmentsRes.data.map((item) => item.course_id));
          }
        }
      } catch (err) {
        console.error("Error loading courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const filteredAndSortedCourses = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const filtered = courses.filter((course) => {
      const name = course.course_name?.toLowerCase() || "";
      const instructor = course.instructor?.toLowerCase() || "";
      const description = course.description?.toLowerCase() || "";
      const category = course.category || "";
      const level = course.level || "";
      const matchesSearch =
        name.includes(normalizedSearch) ||
        instructor.includes(normalizedSearch) ||
        description.includes(normalizedSearch);
      const matchesCategory = categoryFilter === "all" || category === categoryFilter;
      const matchesLevel = levelFilter === "all" || level === levelFilter;

      if (filterBy === "enrolled") {
        return matchesSearch && matchesCategory && matchesLevel && enrolled.includes(course.course_id);
      }
      if (filterBy === "available") {
        return matchesSearch && matchesCategory && matchesLevel && !enrolled.includes(course.course_id);
      }
      return matchesSearch && matchesCategory && matchesLevel;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "instructor":
          return (a.instructor || "").localeCompare(b.instructor || "");
        case "price":
          return Number(a.price || 0) - Number(b.price || 0);
        case "name":
        default:
          return (a.course_name || "").localeCompare(b.course_name || "");
      }
    });
  }, [courses, searchTerm, sortBy, filterBy, categoryFilter, levelFilter, enrolled]);

  const displayedCourses = filteredAndSortedCourses.slice(0, displayCount);
  const hasActiveFilters =
    searchTerm || categoryFilter !== "all" || levelFilter !== "all" || filterBy !== "all";

  useEffect(() => {
    if (!paymentModalOpen || !activePayment?.paymentId || activePayment.status === "PAID") {
      return undefined;
    }

    const intervalId = setInterval(async () => {
      const res = await learningService.getPayment(activePayment.paymentId);
      if (res.success) {
        setActivePayment(res.data);
        if (res.data.status === "PAID") {
          setEnrolled((prev) => [...new Set([...prev, res.data.courseId])]);
          message.success("Thanh toán thành công. Khóa học đã được mở.");
          clearInterval(intervalId);
        }
      }
    }, 4000);

    return () => clearInterval(intervalId);
  }, [activePayment?.paymentId, activePayment?.status, paymentModalOpen]);

  const startPayment = async (courseId) => {
    if (!authToken) {
      message.error("Bạn cần đăng nhập để thanh toán khóa học");
      setTimeout(() => navigate("/login"), 1200);
      return;
    }

    setPaymentLoading(true);
    const res = await learningService.createCoursePayment(userId, courseId);
    setPaymentLoading(false);

    if (res.success) {
      setActivePayment(res.data);
      setPaymentModalOpen(true);
    } else {
      message.error(res.error || "Không tạo được đơn thanh toán");
    }
  };

  const copyPaymentText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success("Đã sao chép");
    } catch {
      message.error("Không sao chép được");
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setLevelFilter("all");
    setFilterBy("all");
  };

  const selectClass =
    "min-h-[46px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10";

  return (
    <div className="min-h-screen bg-[#f6faf8] font-sans text-slate-900">
      <Navbar page="courses" />

      <main>
        {/* ===================== HERO HEADER ===================== */}
        <section className="relative overflow-hidden bg-[#070b14]">
          <div className="mesh-animated absolute inset-0 animate-gradient-shift bg-mesh-hero opacity-90" />
          <div className="absolute inset-0 bg-grid-dark opacity-50" />
          <div className="aurora-blob left-[-6%] top-[-30%] h-72 w-72 bg-emerald-500/30" />
          <div className="aurora-blob right-[2%] bottom-[-40%] h-80 w-80 bg-sky-500/25" style={{ animationDelay: "-4s" }} />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#f6faf8] to-transparent" />

          <div className="relative mx-auto max-w-7xl px-4 py-16 text-left sm:px-6 lg:px-8 lg:py-20">
            <Reveal className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold text-emerald-300 backdrop-blur">
                <Sparkles size={14} />
                Catalog khóa học
              </div>
              <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl">
                Chọn lộ trình lập trình phù hợp với{" "}
                <span className="text-gradient bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-400">
                  mục tiêu của bạn
                </span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                Tìm kiếm khóa học theo công nghệ, giảng viên, danh mục hoặc cấp độ.
                Mỗi khóa học có video, tiến độ học, quiz đánh giá và chứng chỉ hoàn thành.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* ===================== FILTER BAR ===================== */}
          <Reveal className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-soft">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Filter size={15} />
              </span>
              Bộ lọc khóa học
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
              <label className="relative lg:col-span-2">
                <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm React, Spring Boot, SQL..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="min-h-[46px] w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                />
              </label>

              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={selectClass}>
                <option value="all">Tất cả danh mục</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className={selectClass}>
                <option value="all">Tất cả cấp độ</option>
                {levels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>

              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={selectClass}>
                <option value="name">Sắp xếp theo tên</option>
                <option value="instructor">Theo giảng viên</option>
                <option value="price">Theo học phí</option>
              </select>
            </div>

            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="min-h-[42px] rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-400"
              >
                <option value="all">Tất cả khóa học</option>
                <option value="available">Có thể đăng ký</option>
                <option value="enrolled">Đã đăng ký</option>
              </select>
              <div className="text-sm font-semibold text-slate-500">
                Đang hiển thị {displayedCourses.length}/{filteredAndSortedCourses.length} khóa học
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 transition hover:text-emerald-700"
                >
                  <X size={15} />
                  Xóa bộ lọc
                </button>
              )}
            </div>
          </Reveal>

          {/* ===================== GRID ===================== */}
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                  </div>
                  <div className="space-y-3 p-5">
                    <div className="h-5 w-3/4 rounded bg-slate-100" />
                    <div className="h-4 w-full rounded bg-slate-100" />
                    <div className="h-4 w-2/3 rounded bg-slate-100" />
                    <div className="h-11 w-full rounded-xl bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredAndSortedCourses.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-center">
              <BookOpen size={36} className="mb-4 text-slate-300" />
              <p className="mb-2 text-lg font-bold text-slate-700">Chưa tìm thấy khóa học phù hợp</p>
              <p className="m-0 text-sm text-slate-500">Hãy thử đổi từ khóa hoặc bộ lọc.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {displayedCourses.map((course, idx) => {
                  const category = course.category || "Programming";
                  const level = course.level || "Beginner";
                  const tone = CATEGORY_TONE[category] || CATEGORY_TONE.Programming;
                  const levelTone = LEVEL_TONE[level] || LEVEL_TONE.Beginner;
                  const isEnrolled = enrolled.includes(course.course_id);
                  return (
                    <Reveal key={course.course_id} delay={(idx % 3) * 80}>
                      <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft-lg">
                        <div className="relative h-48 overflow-hidden bg-slate-100">
                          <img
                            src={course.p_link}
                            alt={course.course_name}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                          <span className={`absolute left-3 top-3 rounded-full bg-gradient-to-r ${tone} px-3 py-1 text-[11px] font-bold text-white shadow-sm`}>
                            {category}
                          </span>
                          <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-black text-slate-900 shadow-sm backdrop-blur">
                            {formatCurrency(COURSE_PRICE)}
                          </span>
                        </div>

                        <div className="flex flex-1 flex-col p-5">
                          <h3 className="min-h-[56px] font-display text-lg font-extrabold leading-7 text-slate-900 transition group-hover:text-emerald-700">
                            {course.course_name}
                          </h3>
                          <p className="mt-2 line-clamp-3 min-h-[60px] text-sm leading-6 text-slate-500">
                            {course.description}
                          </p>

                          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-bold">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${levelTone}`}>
                              <Layers size={13} />
                              {level}
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
                              <Clock size={13} />
                              {course.durationHours || 0} giờ
                            </span>
                          </div>

                          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                            <UserRound size={15} className="text-sky-500" />
                            Giảng viên:
                            <span className="font-bold text-slate-900">{course.instructor}</span>
                          </div>

                          <div className="mt-auto pt-5">
                            {isEnrolled ? (
                              <button
                                type="button"
                                onClick={() => navigate("/learnings")}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500 bg-emerald-50 py-3 font-bold text-emerald-700 transition hover:bg-emerald-100"
                              >
                                Vào lớp học
                                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => startPayment(course.course_id)}
                                disabled={paymentLoading}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 font-bold text-white transition hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500"
                              >
                                Thanh toán 2.000đ
                                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>

              {displayedCourses.length < filteredAndSortedCourses.length && (
                <div className="mt-10 text-center">
                  <button
                    type="button"
                    onClick={() => setDisplayCount((prev) => prev + 6)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-3 font-bold text-slate-700 shadow-soft transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-700"
                  >
                    Xem thêm khóa học
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Modal
        title="Thanh toán khóa học"
        open={paymentModalOpen}
        onCancel={() => setPaymentModalOpen(false)}
        footer={null}
        width={560}
      >
        {activePayment && (
          <div className="grid gap-5 text-left">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
              Chuyển khoản đúng số tiền và nội dung bên dưới. Hệ thống sẽ tự mở khóa học sau khi SePay xác nhận giao dịch.
            </div>

            <div className="grid gap-4 md:grid-cols-[220px_1fr]">
              <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-3">
                {activePayment.qrUrl ? (
                  <img src={activePayment.qrUrl} alt="QR thanh toán khóa học" className="h-48 w-48 object-contain" />
                ) : (
                  <QrCode className="h-24 w-24 text-slate-300" />
                )}
              </div>

              <div className="grid gap-3 text-sm">
                <div>
                  <p className="m-0 text-xs font-bold uppercase text-slate-400">Khóa học</p>
                  <p className="m-0 mt-1 font-bold text-slate-900">{activePayment.courseName}</p>
                </div>
                <div>
                  <p className="m-0 text-xs font-bold uppercase text-slate-400">Số tiền</p>
                  <p className="m-0 mt-1 text-xl font-black text-emerald-700">{formatCurrency(activePayment.amount)}</p>
                </div>
                <div>
                  <p className="m-0 text-xs font-bold uppercase text-slate-400">Tài khoản</p>
                  <p className="m-0 mt-1 font-bold text-slate-900">
                    {activePayment.bankCode} - {activePayment.bankAccount}
                  </p>
                  <p className="m-0 text-xs font-semibold text-slate-500">{activePayment.accountName}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="m-0 text-xs font-bold uppercase text-slate-400">Nội dung chuyển khoản</p>
                <button
                  type="button"
                  onClick={() => copyPaymentText(activePayment.transferContent)}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-600 hover:text-emerald-700"
                >
                  <Copy size={13} />
                  Sao chép
                </button>
              </div>
              <p className="m-0 rounded-lg bg-white px-3 py-2 font-mono text-lg font-black tracking-wide text-slate-900">
                {activePayment.transferContent}
              </p>
            </div>

            <div className={`rounded-xl px-4 py-3 text-sm font-bold ${
              activePayment.status === "PAID"
                ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border border-amber-200 bg-amber-50 text-amber-700"
            }`}>
              {activePayment.status === "PAID"
                ? "Đã thanh toán. Bạn có thể vào lớp học."
                : "Đang chờ thanh toán. Modal sẽ tự cập nhật sau khi webhook SePay báo về."}
            </div>

            {activePayment.status === "PAID" && (
              <button
                type="button"
                onClick={() => navigate(`/course/${activePayment.courseId}`)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-700"
              >
                Vào lớp học
                <ArrowRight size={15} />
              </button>
            )}
          </div>
        )}
      </Modal>

      <Footer />
    </div>
  );
}

export default Courses;
