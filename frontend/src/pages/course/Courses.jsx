import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../../Components/common/Navbar";
import Footer from "../../Components/common/Footer";
import { Reveal } from "../../Components/common/Reveal";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
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
} from "lucide-react";

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

  const enrollCourse = async (courseId) => {
    if (!authToken) {
      message.error("Bạn cần đăng nhập để đăng ký khóa học");
      setTimeout(() => navigate("/login"), 1200);
      return;
    }

    const res = await learningService.enrollCourse(userId, courseId);
    if (res.success && res.data === "Enrolled successfully") {
      message.success("Đăng ký khóa học thành công");
      setTimeout(() => navigate(`/course/${courseId}`), 1000);
    } else if (!res.success) {
      message.error(res.error || "Không thể đăng ký khóa học");
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
                            {formatCurrency(course.price)}
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
                                onClick={() => enrollCourse(course.course_id)}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 font-bold text-white transition hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500"
                              >
                                Đăng ký học
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

      <Footer />
    </div>
  );
}

export default Courses;
