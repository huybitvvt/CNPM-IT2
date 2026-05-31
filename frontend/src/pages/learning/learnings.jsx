import React, { useEffect, useState } from "react";
import Navbar from "../../Components/common/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { Progress } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faChartLine,
  faClock,
  faLayerGroup,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { learningService } from "../../api/learning.service";
import { progressService } from "../../api/progress.service";

function Learnings() {
  const userId = localStorage.getItem("id");
  const [courses, setCourses] = useState([]);
  const [progressByCourse, setProgressByCourse] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCourses() {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await learningService.getEnrollments(userId);
        const enrolledCourses = response.success ? response.data || [] : [];
        setCourses(enrolledCourses);

        const progressEntries = await Promise.all(
          enrolledCourses.map(async (course) => {
            const result = await progressService.getCourseProgressSummary(userId, course.course_id);
            return [course.course_id, result.success ? result.data : null];
          })
        );

        setProgressByCourse(Object.fromEntries(progressEntries));
      } catch (err) {
        console.error("Error loading enrolled courses:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6faf8]">
        <Navbar page="learnings" />
        <div className="flex h-[70vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#16a676] border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-[#f6faf8]">
        <Navbar page="learnings" />
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="text-3xl font-black text-[#10201c]">Bạn cần đăng nhập để xem lớp học</h1>
          <button
            onClick={() => navigate("/login")}
            className="mt-6 rounded-lg bg-[#16a676] px-6 py-3 text-sm font-black text-white transition hover:bg-[#087c5b]"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-[#f6faf8]">
        <Navbar page="learnings" />
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-[#e9f8f1] text-[#087c5b]">
            <FontAwesomeIcon icon={faBookOpen} className="text-2xl" />
          </div>
          <h1 className="text-3xl font-black text-[#10201c]">Bạn chưa đăng ký khóa học nào</h1>
          <p className="mt-3 text-base leading-7 text-[#61706b]">
            Khám phá catalog khóa học lập trình và bắt đầu lộ trình học tập của bạn.
          </p>
          <button
            onClick={() => navigate("/courses")}
            className="mt-6 rounded-lg bg-[#16a676] px-6 py-3 text-sm font-black text-white transition hover:bg-[#087c5b]"
          >
            Xem khóa học
          </button>
        </div>
      </div>
    );
  }

  const completedCourses = Object.values(progressByCourse).filter((item) => item?.percent === 100).length;

  return (
    <div className="min-h-screen bg-[#f6faf8] text-[#10201c]">
      <Navbar page="learnings" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-6 rounded-lg border border-[#d9e5df] bg-white p-6 text-left shadow-sm">
          <p className="m-0 text-sm font-black uppercase tracking-wide text-[#087c5b]">
            Lớp học của tôi
          </p>
          <div className="mt-2 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <h1 className="m-0 text-3xl font-black text-[#10201c] sm:text-4xl">
                Tiếp tục lộ trình học lập trình
              </h1>
              <p className="m-0 mt-3 max-w-3xl text-sm leading-7 text-[#61706b]">
                Theo dõi tiến độ theo từng bài học, quay lại video đang học và mở quiz khi hoàn thành toàn bộ playlist.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="rounded-lg border border-[#d9e5df] bg-[#fbfefc] p-4">
                <p className="m-0 text-2xl font-black text-[#10201c]">{courses.length}</p>
                <p className="m-0 mt-1 text-xs font-bold text-[#61706b]">Khóa đã đăng ký</p>
              </div>
              <div className="rounded-lg border border-[#d9e5df] bg-[#fbfefc] p-4">
                <p className="m-0 text-2xl font-black text-[#10201c]">{completedCourses}</p>
                <p className="m-0 mt-1 text-xs font-bold text-[#61706b]">Khóa hoàn thành</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          {courses.map((course) => {
            const summary = progressByCourse[course.course_id];
            const percent = summary?.percent || 0;
            const completedLessons = summary?.completedLessons || 0;
            const totalLessons = summary?.totalLessons || 0;

            return (
              <article
                key={course.course_id}
                className="overflow-hidden rounded-lg border border-[#d9e5df] bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="grid gap-0 sm:grid-cols-[190px_1fr]">
                  <div className="relative h-48 bg-[#e7efeb] sm:h-full">
                    <img
                      src={course.p_link}
                      alt={course.course_name}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute left-3 top-3 rounded-lg bg-[#10201c]/90 px-3 py-1 text-xs font-black text-white">
                      {course.category || "Programming"}
                    </span>
                  </div>

                  <div className="p-5">
                    <h2 className="m-0 text-xl font-black leading-7 text-[#10201c]">
                      {course.course_name}
                    </h2>
                    <p className="m-0 mt-2 text-sm font-semibold text-[#61706b]">
                      Giảng viên: <span className="text-[#10201c]">{course.instructor}</span>
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold">
                      <span className="rounded-lg bg-[#e9f8f1] px-3 py-2 text-[#087c5b]">
                        <FontAwesomeIcon icon={faLayerGroup} className="mr-2" />
                        {course.level || "Beginner"}
                      </span>
                      <span className="rounded-lg bg-[#fff4d8] px-3 py-2 text-[#9a6500]">
                        <FontAwesomeIcon icon={faClock} className="mr-2" />
                        {course.durationHours || 0} giờ
                      </span>
                    </div>

                    <div className="mt-5 rounded-lg border border-[#d9e5df] bg-[#fbfefc] p-4">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-black text-[#10201c]">
                          <FontAwesomeIcon icon={faChartLine} className="mr-2 text-[#16a676]" />
                          Tiến độ
                        </span>
                        <span className="font-bold text-[#61706b]">
                          {completedLessons}/{totalLessons || "--"} bài
                        </span>
                      </div>
                      <Progress
                        percent={percent}
                        status={percent === 100 ? "success" : "active"}
                        strokeColor="#16a676"
                      />
                    </div>

                    <Link to={`/course/${course.course_id}`} className="mt-5 block">
                      <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#10201c] px-4 py-3 text-sm font-black text-white transition hover:bg-[#087c5b]">
                        <FontAwesomeIcon icon={faPlay} />
                        {percent > 0 ? "Tiếp tục học" : "Bắt đầu học"}
                      </button>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}

export default Learnings;
