import { Link } from "react-router-dom";
import { Github, Facebook, Linkedin, ArrowUpRight, Mail } from "lucide-react";

function Footer() {
  const columns = [
    {
      title: "Lộ trình học",
      items: [
        { label: "Frontend", to: "/courses" },
        { label: "Backend", to: "/courses" },
        { label: "Cơ sở dữ liệu", to: "/courses" },
        { label: "DevOps", to: "/courses" },
      ],
    },
    {
      title: "Chức năng",
      items: [
        { label: "Quản lý khóa học", to: "/courses" },
        { label: "Quiz đánh giá", to: "/courses" },
        { label: "Theo dõi tiến độ", to: "/learnings" },
        { label: "Chứng chỉ", to: "/profile" },
      ],
    },
    {
      title: "Công nghệ",
      items: [
        { label: "React", to: "/courses" },
        { label: "Spring Boot", to: "/courses" },
        { label: "Supabase", to: "/courses" },
        { label: "JWT Security", to: "/courses" },
      ],
    },
  ];

  const socials = [
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#070b14] px-6 pb-10 pt-16 text-slate-300">
      {/* top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />
      <div className="aurora-blob left-[5%] top-[-30%] h-64 w-64 bg-emerald-500/20" />
      <div className="aurora-blob right-[8%] bottom-[-30%] h-72 w-72 bg-violet-500/15" style={{ animationDelay: "-5s" }} />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-4">
        <div>
          <Link to="/" className="mb-5 flex items-center gap-2.5 no-underline">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-sm font-black text-white shadow-md">
              {"</>"}
            </div>
            <span className="font-display text-xl font-extrabold tracking-tight text-white">
              Code<span className="text-emerald-400">Learn</span>
            </span>
          </Link>
          <p className="max-w-sm text-sm leading-6 text-slate-400">
            Nền tảng quản lý khóa học lập trình trực tuyến: học tập, kiểm tra,
            theo dõi tiến độ và cấp chứng chỉ.
          </p>

          <a
            href="mailto:hello@codelearn.dev"
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white no-underline transition hover:border-emerald-400/40 hover:bg-white/10"
          >
            <Mail size={15} className="text-emerald-400" />
            hello@codelearn.dev
          </a>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="mb-4 font-display text-base font-bold text-white">{column.title}</h3>
            <ul className="space-y-2.5 text-sm">
              {column.items.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="group inline-flex items-center gap-1 text-slate-400 no-underline transition hover:text-emerald-400"
                  >
                    {item.label}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="relative mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 md:flex-row">
        <p className="m-0 text-sm text-slate-500">
          © {new Date().getFullYear()} CodeLearn LMS. Phát triển cho bài tập lớn Công nghệ phần mềm.
        </p>
        <div className="flex items-center gap-3">
          <Link
            to="/courses"
            className="text-sm font-bold text-emerald-400 no-underline transition hover:text-emerald-300"
          >
            Khám phá khóa học
          </Link>
          {socials.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:-translate-y-0.5 hover:border-emerald-400/40 hover:text-emerald-400"
            >
              <Icon size={17} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
