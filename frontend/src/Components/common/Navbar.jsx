import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Home as HomeIcon,
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  User as UserIcon,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { authService } from "../../api/auth.service";

function getInitials(name, email) {
  const source = (name || email || "U").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

function Navbar({ page }) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const currentUser = authService.getCurrentUser();
  const isAuthenticated = Boolean(currentUser.token);
  const isAdmin = currentUser.role === "ROLE_ADMIN";
  const displayName = currentUser.name || currentUser.email || "Học viên";

  const handleLogOut = async () => {
    await authService.logout();
  };

  useEffect(() => {
    const onClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const navItems = [
    { key: "home", label: "Trang chủ", path: "/", icon: HomeIcon },
    { key: "courses", label: "Khóa học", path: "/courses", icon: BookOpen },
  ];

  if (isAuthenticated) {
    navItems.push({
      key: "learnings",
      label: "Lớp học của tôi",
      path: "/learnings",
      icon: GraduationCap,
    });
  }
  if (isAdmin) {
    navItems.push({
      key: "admin",
      label: "Quản trị",
      path: "/admin",
      icon: LayoutDashboard,
    });
  }

  return (
    <nav className="sticky top-0 z-[999] border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2.5 no-underline"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-sm font-black text-white shadow-md">
            {"</>"}
          </div>
          <span className="font-display text-lg font-extrabold tracking-tight text-slate-900">
            Code<span className="text-emerald-600">Learn</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = page === item.key;
            return (
              <Link
                key={item.key}
                to={item.path}
                className={`group relative flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold no-underline transition ${
                  isActive
                    ? "text-emerald-700"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Icon size={16} className={isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"} />
                {item.label}
                <span
                  className={`absolute inset-x-2 -bottom-[1px] h-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-transform duration-300 ${
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-75"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Right: profile / auth + mobile toggle */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="relative hidden md:block" ref={profileRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:shadow-soft"
              >
                <span className="relative">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-xs font-black text-white">
                    {getInitials(currentUser.name, currentUser.email)}
                  </span>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                </span>
                <span className="max-w-[120px] truncate">{displayName}</span>
                <ChevronDown
                  size={15}
                  className={`text-slate-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-60 origin-top-right animate-fadeIn overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-soft-lg">
                  <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-sm font-black text-white">
                      {getInitials(currentUser.name, currentUser.email)}
                    </span>
                    <div className="min-w-0">
                      <p className="m-0 truncate text-sm font-bold text-slate-900">{displayName}</p>
                      <p className="m-0 truncate text-xs text-slate-500">
                        {isAdmin ? "Quản trị viên" : "Học viên"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-col">
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 no-underline transition hover:bg-slate-50 hover:text-slate-900"
                    >
                      <UserIcon size={17} className="text-slate-400" />
                      Hồ sơ của tôi
                    </Link>
                    <Link
                      to="/learnings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 no-underline transition hover:bg-slate-50 hover:text-slate-900"
                    >
                      <GraduationCap size={17} className="text-slate-400" />
                      Lớp học của tôi
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 no-underline transition hover:bg-slate-50 hover:text-slate-900"
                      >
                        <LayoutDashboard size={17} className="text-slate-400" />
                        Trang quản trị
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogOut}
                      className="mt-1 flex items-center gap-3 rounded-xl border-t border-slate-100 px-3 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                    >
                      <LogOut size={17} />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="hidden rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2 text-sm font-bold text-white shadow-md transition hover:shadow-glow-emerald md:block"
            >
              Đăng nhập
            </button>
          )}

          {/* Mobile toggle */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 md:hidden"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label="Mở menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="absolute inset-x-0 top-14 flex flex-col gap-1 border-b border-slate-200 bg-white p-4 shadow-soft-lg md:hidden">
          {isAuthenticated && (
            <div className="mb-2 flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3">
              <span className="relative">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-sm font-black text-white">
                  {getInitials(currentUser.name, currentUser.email)}
                </span>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
              </span>
              <div className="min-w-0">
                <p className="m-0 truncate text-sm font-bold text-slate-900">{displayName}</p>
                <p className="m-0 truncate text-xs text-slate-500">{isAdmin ? "Quản trị viên" : "Học viên"}</p>
              </div>
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = page === item.key;
            return (
              <Link
                key={item.key}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold no-underline transition ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon size={17} className={isActive ? "text-emerald-600" : "text-slate-400"} />
                {item.label}
              </Link>
            );
          })}

          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 no-underline transition hover:bg-slate-50 hover:text-slate-900"
              >
                <UserIcon size={17} className="text-slate-400" />
                Hồ sơ
              </Link>
              <button
                type="button"
                onClick={handleLogOut}
                className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
              >
                <LogOut size={17} />
                Đăng xuất
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate("/login");
              }}
              className="mt-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-bold text-white shadow-md"
            >
              Đăng nhập
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
