import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/common/Navbar";
import Footer from "../../Components/common/Footer";
import { Reveal, CountUp } from "../../Components/common/Reveal";
import { courseService } from "../../api/course.service";
import {
  ArrowRight,
  Play,
  Sparkles,
  Code2,
  ShieldCheck,
  LineChart,
  Layers,
  Award,
  CheckCircle2,
  Star,
  Clock,
  UserRound,
  BookOpen,
  MousePointerClick,
  Rocket,
  Trophy,
  Quote,
} from "lucide-react";

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

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

const TECH_STRIP = [
  "Python",
  "Java",
  "ReactJS",
  "Spring Boot",
  "SQL",
  "Docker",
  "JWT",
  "PostgreSQL",
  "REST API",
  "CI/CD",
];

/* ------------------------------------------------------------------ */
/*  Magnetic button — follows the cursor for a premium, tactile feel  */
/* ------------------------------------------------------------------ */
function MagneticButton({ children, className = "", onClick, strength = 0.4 }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    setPos({ x: x * strength, y: y * strength });
  };

  const reset = () => setPos({ x: 0, y: 0 });

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      className={`transition-transform duration-200 ease-out will-change-transform ${className}`}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  TiltCard — subtle 3D tilt that reacts to the pointer              */
/* ------------------------------------------------------------------ */
function TiltCard({ children, className = "", onClick, max = 8 }) {
  const ref = useRef(null);
  const [style, setStyle] = useState({});

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * max * 2;
    const rotateX = (0.5 - py) * max * 2;
    setStyle({
      transform: `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`,
    });
  };

  const reset = () =>
    setStyle({ transform: "perspective(900px) rotateX(0) rotateY(0) translateY(0)" });

  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={style}
      className={`tilt-card ${className}`}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Animated code-editor mock — conveys "Learn by Doing" instantly    */
/* ------------------------------------------------------------------ */
const CODE_LINES = [
  [
    { t: "def", c: "text-violet-400" },
    { t: " greet", c: "text-sky-300" },
    { t: "(name):", c: "text-slate-300" },
  ],
  [
    { t: "    print", c: "text-emerald-300" },
    { t: "(", c: "text-slate-300" },
    { t: 'f"Xin chào, {name}!"', c: "text-amber-300" },
    { t: ")", c: "text-slate-300" },
  ],
  [{ t: "", c: "" }],
  [
    { t: "greet", c: "text-sky-300" },
    { t: "(", c: "text-slate-300" },
    { t: '"CodeLearner"', c: "text-amber-300" },
    { t: ")", c: "text-slate-300" },
  ],
];

function CodeEditorMock() {
  const [typed, setTyped] = useState("");
  const full = "# Bắt đầu hành trình code của bạn";

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(id);
    }, 55);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative animate-float">
      {/* glow */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-emerald-500/30 via-sky-500/20 to-violet-500/30 blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220]/90 shadow-2xl ring-1 ring-white/5 backdrop-blur-xl">
        {/* title bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex items-center gap-2 rounded-md bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-400">
            <Code2 size={12} />
            main.py
          </div>
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Live
          </span>
        </div>

        {/* code body */}
        <div className="px-4 py-4 font-mono text-[13px] leading-7">
          <div className="text-slate-500">
            {typed}
            <span className="ml-0.5 inline-block h-4 w-2 -translate-y-[1px] animate-blink bg-emerald-400 align-middle" />
          </div>
          {CODE_LINES.map((line, idx) => (
            <div key={idx} className="flex gap-4">
              <span className="w-4 select-none text-right text-slate-600">{idx + 1}</span>
              <span className="whitespace-pre">
                {line.map((tok, j) => (
                  <span key={j} className={tok.c}>
                    {tok.t}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>

        {/* output console */}
        <div className="border-t border-white/10 bg-black/30 px-4 py-3 font-mono text-[12px]">
          <p className="m-0 text-slate-500">$ python main.py</p>
          <p className="m-0 mt-1 text-emerald-300">Xin chào, CodeLearner!</p>
        </div>
      </div>

      {/* floating badges */}
      <div className="absolute -left-6 top-10 hidden rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-bold text-white shadow-xl backdrop-blur-md animate-float-slow lg:flex lg:items-center lg:gap-2">
        <Trophy size={14} className="text-amber-400" />
        +1 chứng chỉ
      </div>
      <div className="absolute -right-6 bottom-12 hidden rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-bold text-white shadow-xl backdrop-blur-md animate-float lg:flex lg:items-center lg:gap-2">
        <LineChart size={14} className="text-emerald-400" />
        Tiến độ 100%
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */
function Home() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const res = await courseService.getAllCourses();
      if (active && res.success) {
        setCourses(Array.isArray(res.data) ? res.data : []);
      }
      if (active) setLoadingCourses(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const features = [
    {
      icon: Layers,
      title: "Học theo lộ trình",
      desc: "Khóa học chia module rõ ràng, từ cơ bản đến dự án thực tế, kèm video và tài liệu.",
      tone: "from-emerald-500 to-teal-500",
    },
    {
      icon: LineChart,
      title: "Theo dõi tiến độ",
      desc: "Lưu tiến độ tự động, làm quiz đánh giá và xem kết quả học tập trực quan.",
      tone: "from-sky-500 to-blue-600",
    },
    {
      icon: ShieldCheck,
      title: "Bảo mật & chứng chỉ",
      desc: "Spring Security + JWT bảo vệ tài khoản, cấp chứng chỉ khi hoàn thành khóa học.",
      tone: "from-amber-500 to-orange-500",
    },
  ];

  const steps = [
    {
      icon: MousePointerClick,
      title: "Chọn khóa học",
      desc: "Duyệt catalog theo công nghệ, cấp độ và mục tiêu của bạn.",
    },
    {
      icon: Play,
      title: "Học tương tác",
      desc: "Xem video bài giảng, thực hành và làm quiz ngay trong từng bài.",
    },
    {
      icon: LineChart,
      title: "Theo dõi tiến độ",
      desc: "Hệ thống lưu tiến độ tự động và gợi ý bước tiếp theo.",
    },
    {
      icon: Trophy,
      title: "Nhận chứng chỉ",
      desc: "Hoàn thành khóa học và nhận chứng chỉ để ghi điểm hồ sơ.",
    },
  ];

  const testimonials = [
    {
      quote:
        "Lộ trình rõ ràng, video dễ hiểu và quiz sát thực tế. Mình tiến bộ nhanh hơn hẳn so với tự học.",
      name: "Minh Anh",
      role: "Sinh viên CNTT",
    },
    {
      quote:
        "AI Tutor trả lời cực nhanh mỗi khi mình bí code. Giao diện mượt, học trên điện thoại cũng thích.",
      name: "Quang Huy",
      role: "Junior Developer",
    },
    {
      quote:
        "Theo dõi tiến độ và chứng chỉ giúp mình giữ động lực học mỗi ngày. Rất đáng để bắt đầu.",
      name: "Thanh Nam",
      role: "Career Switcher",
    },
  ];

  /* derive real stats from fetched courses */
  const stats = useMemo(() => {
    const totalCourses = courses.length;
    const totalHours = courses.reduce((sum, c) => sum + Number(c.durationHours || 0), 0);
    const categories = new Set(courses.map((c) => c.category).filter(Boolean)).size;
    return [
      { label: "Khóa học", value: totalCourses, suffix: "+", icon: BookOpen },
      { label: "Giờ học", value: totalHours, suffix: "+", icon: Clock },
      { label: "Lĩnh vực", value: categories, suffix: "", icon: Layers },
      { label: "Đánh giá", value: 4.9, decimals: 1, suffix: "", icon: Star },
    ];
  }, [courses]);

  return (
    <div className="min-h-screen bg-[#f6faf8] font-sans text-slate-900">
      <Navbar page="home" />

      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden bg-[#070b14]">
        {/* animated mesh + grid + aurora */}
        <div className="mesh-animated absolute inset-0 animate-gradient-shift bg-mesh-hero" />
        <div className="absolute inset-0 bg-grid-dark opacity-60" />
        <div className="aurora-blob left-[-10%] top-[-10%] h-80 w-80 bg-emerald-500/40" />
        <div className="aurora-blob right-[-8%] top-[10%] h-96 w-96 bg-violet-500/30" style={{ animationDelay: "-6s" }} />
        <div className="aurora-blob bottom-[-12%] left-[30%] h-80 w-80 bg-sky-500/30" style={{ animationDelay: "-3s" }} />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f6faf8] to-transparent" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
          {/* left */}
          <div className="text-left">
            <Reveal as="div" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold text-emerald-300 backdrop-blur">
              <Sparkles size={14} />
              Học lập trình tương tác — Learn by Doing
            </Reveal>

            <Reveal as="h1" delay={80} className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Chinh phục code,
              <br />
              <span className="text-gradient bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-400">
                xây dựng tương lai
              </span>
            </Reveal>

            <Reveal as="p" delay={160} className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              CodeLearn giúp bạn học qua bài giảng video, quiz đánh giá và dự án
              thực tế. Theo dõi tiến độ, nhận chứng chỉ và tiến bộ mỗi ngày.
            </Reveal>

            <Reveal as="div" delay={240} className="mt-9 flex flex-wrap items-center gap-4">
              <MagneticButton
                onClick={() => navigate("/courses")}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-7 py-3.5 text-sm font-bold text-white shadow-glow-emerald"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                Bắt đầu học ngay
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </MagneticButton>

              <button
                onClick={() => navigate("/courses")}
                className="group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10"
              >
                <Play size={16} className="text-emerald-400 transition-transform group-hover:scale-110" />
                Xem khóa học
              </button>
            </Reveal>

            {/* mini trust row */}
            <Reveal as="div" delay={320} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-slate-400">
              {["Miễn phí bắt đầu", "Chứng chỉ hoàn thành", "AI Tutor 24/7"].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  {t}
                </div>
              ))}
            </Reveal>
          </div>

          {/* right — editor mock */}
          <Reveal delay={200} y={32}>
            <CodeEditorMock />
          </Reveal>
        </div>

        {/* tech marquee strip */}
        <div className="relative border-t border-white/10 bg-white/[0.02] py-5 backdrop-blur-sm">
          <div className="marquee-mask overflow-hidden">
            <div className="flex w-max animate-marquee items-center gap-10 pr-10">
              {[...TECH_STRIP, ...TECH_STRIP].map((tech, i) => (
                <span
                  key={`${tech}-${i}`}
                  className="flex items-center gap-2 whitespace-nowrap font-mono text-sm font-semibold text-slate-400"
                >
                  <Code2 size={14} className="text-emerald-400/70" />
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================== FEATURED COURSES ===================== */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-2xl text-left">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
                Khóa học nổi bật
              </p>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Bắt đầu với khóa học của bạn
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-500">
                Mỗi khóa học có video bài giảng, theo dõi tiến độ, quiz đánh giá và chứng chỉ hoàn thành.
              </p>
            </div>
            <button
              onClick={() => navigate("/courses")}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-soft transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-700"
            >
              Xem tất cả khóa học
              <ArrowRight size={16} />
            </button>
          </Reveal>

          {loadingCourses ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                  </div>
                  <div className="space-y-3 p-5">
                    <div className="h-5 w-3/4 rounded bg-slate-100" />
                    <div className="h-4 w-full rounded bg-slate-100" />
                    <div className="h-4 w-2/3 rounded bg-slate-100" />
                    <div className="h-10 w-full rounded-xl bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
              <BookOpen size={36} className="mb-4 text-slate-300" />
              <p className="m-0 text-lg font-bold text-slate-700">Chưa có khóa học nào</p>
              <p className="m-0 mt-1 text-sm text-slate-500">Khóa học sẽ hiển thị tại đây khi được thêm.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.slice(0, 6).map((course, idx) => {
                const category = course.category || "Programming";
                const level = course.level || "Beginner";
                const tone = CATEGORY_TONE[category] || CATEGORY_TONE.Programming;
                const levelTone = LEVEL_TONE[level] || LEVEL_TONE.Beginner;
                return (
                  <Reveal key={course.course_id} delay={(idx % 3) * 90}>
                    <TiltCard
                      onClick={() => navigate("/courses")}
                      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-soft transition-shadow duration-300 hover:shadow-soft-lg"
                    >
                      <div className="relative h-44 overflow-hidden bg-slate-100">
                        <img
                          src={course.p_link}
                          alt={course.course_name}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                        <span
                          className={`absolute left-3 top-3 rounded-full bg-gradient-to-r ${tone} px-3 py-1 text-[11px] font-bold text-white shadow-sm`}
                        >
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
                        <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-6 text-slate-500">
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
                          <span className="truncate">{course.instructor || "CodeLearn"}</span>
                        </div>

                        <span className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-teal-500">
                          Xem chi tiết
                          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </TiltCard>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ========================= FEATURES ========================== */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-2xl text-left">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
                Vì sao chọn CodeLearn
              </p>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Trải nghiệm học lập trình hiện đại
              </h2>
            </div>
            <p className="max-w-md text-left leading-7 text-slate-500 md:text-right">
              Nền tảng đầy đủ từ quản lý khóa học, theo dõi tiến độ đến đánh giá và chứng chỉ.
            </p>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.title} delay={idx * 110}>
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg">
                    <div className={`absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${f.tone} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20`} />
                    <div
                      className={`relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${f.tone} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon size={26} strokeWidth={2.2} />
                    </div>
                    <h3 className="relative mb-2 font-display text-xl font-extrabold text-slate-900">{f.title}</h3>
                    <p className="relative m-0 leading-7 text-slate-500">{f.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================= HOW IT WORKS ====================== */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
              Cách hoạt động
            </p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Bốn bước để tiến bộ mỗi ngày
            </h2>
          </Reveal>

          <div className="relative grid gap-6 md:grid-cols-4">
            {/* connector line */}
            <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent md:block" />
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.title} delay={idx * 110} className="relative text-center">
                  <div className="relative mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-emerald-600 shadow-soft">
                    <Icon size={24} />
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-[11px] font-black text-white shadow">
                      {idx + 1}
                    </span>
                  </div>
                  <h3 className="mb-2 font-display text-lg font-extrabold text-slate-900">{s.title}</h3>
                  <p className="m-0 text-sm leading-6 text-slate-500">{s.desc}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================== STATS =========================== */}
      <section className="px-4 pb-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-soft sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-4 text-left">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="m-0 font-display text-3xl font-extrabold text-slate-900">
                      <CountUp value={s.value} suffix={s.suffix} decimals={s.decimals || 0} />
                    </p>
                    <p className="m-0 text-sm font-semibold text-slate-500">{s.label}</p>
                  </div>
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* ======================= TESTIMONIALS ======================= */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
              Học viên nói gì
            </p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Được tin dùng bởi người học
            </h2>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, idx) => (
              <Reveal key={t.name} delay={idx * 110}>
                <figure className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-7 text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg">
                  <Quote size={28} className="text-emerald-200" />
                  <blockquote className="mt-3 flex-1 text-[15px] leading-7 text-slate-600">
                    {t.quote}
                  </blockquote>
                  <div className="mt-5 flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <figcaption className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-sm font-black text-white">
                      {t.name.charAt(0)}
                    </span>
                    <div>
                      <p className="m-0 text-sm font-bold text-slate-900">{t.name}</p>
                      <p className="m-0 text-xs text-slate-500">{t.role}</p>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================== CTA ============================= */}
      <section className="px-4 pb-24 pt-4 sm:px-6 lg:px-8">
        <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#070b14] px-6 py-16 text-center shadow-soft-lg sm:px-12">
          <div className="mesh-animated absolute inset-0 animate-gradient-shift bg-mesh-hero opacity-80" />
          <div className="absolute inset-0 bg-grid-dark opacity-40" />
          <div className="aurora-blob left-[10%] top-[-20%] h-72 w-72 bg-emerald-500/40" />
          <div className="aurora-blob right-[5%] bottom-[-30%] h-72 w-72 bg-violet-500/30" style={{ animationDelay: "-5s" }} />
          <div className="relative">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold text-emerald-300 backdrop-blur">
              <Rocket size={14} />
              Sẵn sàng bắt đầu?
            </div>
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Biến thời gian rảnh thành kỹ năng lập trình thực thụ
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              Tham gia cùng cộng đồng học viên đang xây dựng tương lai với CodeLearn.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <MagneticButton
                onClick={() => navigate("/courses")}
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-3.5 text-sm font-bold text-white shadow-glow-emerald"
              >
                Khám phá khóa học
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </MagneticButton>
              <button
                onClick={() => navigate("/login")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10"
              >
                <Award size={16} className="text-amber-400" />
                Đăng nhập
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
