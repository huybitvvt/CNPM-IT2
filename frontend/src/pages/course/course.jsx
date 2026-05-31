import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import { Modal, Progress } from "antd";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  Link as LinkIcon,
  Lock,
  MessageSquare,
  Video,
} from "lucide-react";
import { faBackward } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Feedback from "./Feedback";
import Forum from "./forum";
import { courseService } from "../../api/course.service";
import { progressService } from "../../api/progress.service";

const emptyLessonProgress = {
  playedTime: 0,
  duration: 0,
  completed: false,
  percent: 0,
};

const emptyCourseProgress = {
  totalLessons: 0,
  completedLessons: 0,
  percent: 0,
  lessons: [],
};

const fallbackLesson = (course) => ({
  lessonId: "course-video",
  title: course.course_name || "Video bài học",
  description: course.description || "Video giới thiệu khóa học.",
  videoUrl: course.y_link,
  sourceName: course.instructor || "Nguồn khóa học",
  durationMinutes: course.durationHours ? course.durationHours * 60 : null,
  lessonOrder: 1,
});

const Course = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDiscussionOpen, setIsDiscussionOpen] = useState(false);
  const [course, setCourse] = useState({});
  const [lessons, setLessons] = useState([]);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [duration, setDuration] = useState(null);
  const [played, setPlayed] = useState(0);
  const [changePlayed, setChangePlayed] = useState(0);
  const [activeLessonProgress, setActiveLessonProgress] = useState(emptyLessonProgress);
  const [courseProgress, setCourseProgress] = useState(emptyCourseProgress);
  const [progressLoading, setProgressLoading] = useState(true);

  const userId = localStorage.getItem("id");
  const navigate = useNavigate();
  const location = useLocation();
  const courseId = location.pathname.split("/")[2];
  const playerRef = useRef(null);
  const hasSeekedRef = useRef(false);

  useEffect(() => {
    async function fetchCourse() {
      setLoading(true);
      setError(false);

      const [courseRes, lessonsRes] = await Promise.all([
        courseService.getCourseById(courseId),
        courseService.getLessonsByCourse(courseId),
      ]);

      if (!courseRes.success) {
        setError(true);
        setLoading(false);
        return;
      }

      const courseData = courseRes.data;
      const lessonData = lessonsRes.success && lessonsRes.data.length > 0
        ? lessonsRes.data
        : [fallbackLesson(courseData)];

      setCourse(courseData);
      setLessons(lessonData);
      setActiveLessonIndex(0);
      setLoading(false);
    }

    fetchCourse();
  }, [courseId]);

  const activeLesson = lessons[activeLessonIndex] || fallbackLesson(course);
  const activeLessonId = activeLesson?.lessonId;
  const isPersistedLesson = activeLessonId && activeLessonId !== "course-video";

  const progressByLesson = useMemo(() => {
    return new Map((courseProgress.lessons || []).map((item) => [item.lessonId, item]));
  }, [courseProgress.lessons]);

  const fetchCourseSummary = useCallback(async () => {
    if (!userId || !courseId) return;

    const res = await progressService.getCourseProgressSummary(userId, courseId);
    if (res.success) {
      setCourseProgress(res.data);
    }
  }, [userId, courseId]);

  useEffect(() => {
    if (userId && courseId && lessons.length > 0) {
      fetchCourseSummary();
    }
  }, [userId, courseId, lessons.length, fetchCourseSummary]);

  useEffect(() => {
    async function fetchLessonProgress() {
      hasSeekedRef.current = false;

      if (!userId || !isPersistedLesson) {
        setProgressLoading(false);
        return;
      }

      setProgressLoading(true);
      const res = await progressService.getLessonProgress(userId, activeLessonId);
      if (res.success) {
        setPlayed(res.data.playedTime || 0);
        setDuration(res.data.duration || null);
        setActiveLessonProgress(res.data);
      } else {
        setPlayed(0);
        setDuration(null);
        setActiveLessonProgress(emptyLessonProgress);
      }
      setProgressLoading(false);
    }

    fetchLessonProgress();
  }, [userId, activeLessonId, isPersistedLesson]);

  const handleDuration = (videoDuration) => {
    const nextDuration = videoDuration || playerRef.current?.getDuration?.() || 0;
    setDuration(nextDuration);

    if (nextDuration > 0 && userId && isPersistedLesson) {
      progressService.updateLessonProgress(userId, activeLessonId, played, nextDuration)
        .then((res) => {
          if (res.success) {
            setActiveLessonProgress(res.data);
          }
        });
    }
  };

  useEffect(() => {
    async function updateLessonProgress() {
      if (!userId || !isPersistedLesson || !duration) return;

      const nextPlayed = Math.max(played, changePlayed);
      if (nextPlayed <= played) return;

      const res = await progressService.updateLessonProgress(userId, activeLessonId, nextPlayed, duration);
      if (res.success) {
        setPlayed(res.data.playedTime || nextPlayed);
        setActiveLessonProgress(res.data);
        if (res.data.completed) {
          fetchCourseSummary();
        }
      }
    }

    updateLessonProgress();
  }, [changePlayed, userId, duration, played, activeLessonId, isPersistedLesson, fetchCourseSummary]);

  const progressPercent = activeLessonProgress?.percent
    ? activeLessonProgress.percent
    : duration
      ? Math.min(Math.ceil((played / duration) * 100), 100)
      : 0;
  const courseProgressPercent = courseProgress?.percent || 0;
  const quizUnlocked = courseProgress.totalLessons > 0
    ? courseProgressPercent >= 100
    : progressPercent >= 98;
  const totalMinutes = lessons.reduce((sum, item) => sum + (item.durationMinutes || 0), 0);

  const selectLesson = (index) => {
    setActiveLessonIndex(index);
    setDuration(null);
    setPlayed(0);
    setChangePlayed(0);
    setActiveLessonProgress(emptyLessonProgress);
    hasSeekedRef.current = false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6faf8] px-4 py-16 text-center text-[#61706b]">
        Đang tải nội dung khóa học...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f6faf8] px-4 py-16 text-center text-red-600">
        Không thể tải khóa học. Vui lòng thử lại sau.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6faf8] px-4 py-6 text-[#10201c] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <button
            onClick={() => navigate("/learnings")}
            className="flex w-fit items-center gap-2 rounded-lg border border-[#d9e5df] bg-white px-4 py-3 text-sm font-black text-[#10201c] shadow-sm transition hover:border-[#16a676] hover:text-[#087c5b]"
          >
            <FontAwesomeIcon icon={faBackward} />
            Quay lại khóa học của tôi
          </button>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-lg bg-[#e9f8f1] px-3 py-2 text-xs font-black text-[#087c5b]">
              {course.category || "Programming"}
            </span>
            <span className="rounded-lg bg-[#e8f2fb] px-3 py-2 text-xs font-black text-[#2474b5]">
              {course.level || "Beginner"}
            </span>
            <span className="rounded-lg bg-[#fff4d8] px-3 py-2 text-xs font-black text-[#9a6500]">
              {lessons.length} bài học
            </span>
          </div>
        </div>

        <section className="mb-6 rounded-lg border border-[#d9e5df] bg-white p-5 text-left shadow-sm">
          <p className="m-0 text-sm font-black uppercase tracking-wide text-[#087c5b]">Phòng học trực tuyến</p>
          <h1 className="m-0 mt-2 text-2xl font-black leading-tight text-[#10201c] sm:text-4xl">
            {course.course_name}
          </h1>
          <p className="m-0 mt-3 max-w-4xl text-sm leading-7 text-[#61706b]">
            {course.description}
          </p>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1fr_390px]">
          <section className="overflow-hidden rounded-lg border border-[#d9e5df] bg-white shadow-sm">
            <div className="bg-[#10201c] p-3">
              <ReactPlayer
                key={activeLesson.lessonId || activeLesson.videoUrl}
                ref={playerRef}
                onReady={() => {
                  if (!hasSeekedRef.current && played > 5) {
                    playerRef.current?.seekTo?.(played, "seconds");
                    hasSeekedRef.current = true;
                  }
                }}
                onProgress={(progress) => {
                  if (changePlayed + 10 <= progress.playedSeconds) {
                    setChangePlayed(progress.playedSeconds);
                  }
                }}
                url={activeLesson.videoUrl}
                controls
                width="100%"
                height="min(58vw, 560px)"
                onDuration={handleDuration}
              />
            </div>

            <div className="p-5 text-left">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-black text-[#087c5b]">
                    <Video className="h-4 w-4" />
                    Bài {activeLesson.lessonOrder || activeLessonIndex + 1}
                  </div>
                  <h2 className="m-0 text-2xl font-black text-[#10201c]">{activeLesson.title}</h2>
                  <p className="m-0 mt-3 text-sm leading-7 text-[#61706b]">{activeLesson.description}</p>
                </div>
                <div className="shrink-0 rounded-lg border border-[#d9e5df] bg-[#fbfefc] px-4 py-3 text-sm font-bold text-[#61706b]">
                  Nguồn: <span className="text-[#10201c]">{activeLesson.sourceName || "YouTube"}</span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {activeLesson.materialUrl && (
                  <a
                    href={activeLesson.materialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-[#d9e5df] bg-white px-4 py-2 text-sm font-bold text-[#10201c] transition hover:border-[#16a676] hover:text-[#087c5b]"
                  >
                    <FileText className="h-4 w-4" />
                    Tài liệu
                  </a>
                )}
                {activeLesson.sourceCodeUrl && (
                  <a
                    href={activeLesson.sourceCodeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-[#d9e5df] bg-white px-4 py-2 text-sm font-bold text-[#10201c] transition hover:border-[#16a676] hover:text-[#087c5b]"
                  >
                    <LinkIcon className="h-4 w-4" />
                    Source code
                  </a>
                )}
              </div>
            </div>
          </section>

          <aside className="grid gap-5">
            <section className="rounded-lg border border-[#d9e5df] bg-white p-5 text-left shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="m-0 text-sm font-black uppercase tracking-wide text-[#087c5b]">Lộ trình bài học</p>
                  <h2 className="m-0 mt-1 text-xl font-black text-[#10201c]">Playlist tiếng Việt</h2>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#e9f8f1] text-[#087c5b]">
                  <BookOpen className="h-5 w-5" />
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-[#d9e5df] bg-[#fbfefc] p-3">
                  <p className="m-0 text-lg font-black text-[#10201c]">{lessons.length}</p>
                  <p className="m-0 mt-1 text-xs font-bold text-[#61706b]">Bài học</p>
                </div>
                <div className="rounded-lg border border-[#d9e5df] bg-[#fbfefc] p-3">
                  <p className="m-0 text-lg font-black text-[#10201c]">{totalMinutes || "--"} phút</p>
                  <p className="m-0 mt-1 text-xs font-bold text-[#61706b]">Thời lượng</p>
                </div>
              </div>

              <div className="max-h-[560px] space-y-3 overflow-y-auto pr-1">
                {lessons.map((lesson, index) => {
                  const active = index === activeLessonIndex;
                  const lessonProgress = progressByLesson.get(lesson.lessonId);
                  const completed = lessonProgress?.completed;

                  return (
                    <button
                      type="button"
                      key={lesson.lessonId || lesson.videoUrl}
                      onClick={() => selectLesson(index)}
                      className={`w-full rounded-lg border p-4 text-left transition ${
                        active
                          ? "border-[#16a676] bg-[#e9f8f1] shadow-sm"
                          : "border-[#d9e5df] bg-white hover:border-[#16a676] hover:bg-[#fbfefc]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                          completed ? "bg-[#16a676] text-white" : active ? "bg-[#16a676] text-white" : "bg-[#f6faf8] text-[#61706b]"
                        }`}>
                          {completed ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                        </span>
                        <div className="min-w-0">
                          <h3 className="m-0 text-sm font-black leading-6 text-[#10201c]">{lesson.title}</h3>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold text-[#61706b]">
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {lesson.durationMinutes || "--"} phút
                            </span>
                            <span>{lesson.sourceName || "YouTube"}</span>
                            {lessonProgress?.percent > 0 && <span>{lessonProgress.percent}%</span>}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-lg border border-[#d9e5df] bg-white p-5 text-left shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#087c5b]" />
                <h2 className="m-0 text-lg font-black text-[#10201c]">Tiến độ học tập</h2>
              </div>

              {progressLoading ? (
                <div className="text-sm font-semibold text-[#61706b]">Đang tải tiến độ...</div>
              ) : (
                <>
                  <div className="mb-5 rounded-lg border border-[#d9e5df] bg-[#fbfefc] p-3">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-black text-[#10201c]">Toàn khóa học</span>
                      <span className="font-bold text-[#61706b]">
                        {courseProgress.completedLessons || 0}/{courseProgress.totalLessons || lessons.length} bài
                      </span>
                    </div>
                    <Progress
                      percent={courseProgressPercent}
                      status={courseProgressPercent === 100 ? "success" : "active"}
                      strokeColor="#16a676"
                    />
                  </div>

                  <p className="m-0 mb-2 text-sm font-black text-[#10201c]">Bài đang học</p>
                  <Progress
                    percent={progressPercent}
                    status={progressPercent === 100 ? "success" : "active"}
                    strokeColor="#2474b5"
                  />
                  <p className="m-0 mt-2 text-sm leading-6 text-[#61706b]">
                    Bạn đã xem <span className="font-black text-[#10201c]">{progressPercent}%</span> video của bài này.
                  </p>
                </>
              )}

              <div className="mt-5 grid gap-3">
                {quizUnlocked ? (
                  <button
                    onClick={() => navigate(`/assessment/${course.course_id}`)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#16a676] px-4 py-3 text-sm font-black text-white transition hover:bg-[#087c5b]"
                  >
                    <Award className="h-4 w-4" />
                    Làm quiz cuối chương
                  </button>
                ) : (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#e6ece9] px-4 py-3 text-sm font-black text-[#61706b]"
                  >
                    <Lock className="h-4 w-4" />
                    Quiz đang khóa
                  </button>
                )}

                <button
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#d9e5df] bg-white px-4 py-3 text-sm font-black text-[#10201c] transition hover:border-[#16a676] hover:text-[#087c5b]"
                  onClick={() => setIsDiscussionOpen(true)}
                >
                  <MessageSquare className="h-4 w-4" />
                  Hỏi đáp bài học
                </button>
              </div>
            </section>
          </aside>
        </div>

        <div className="mt-8">
          <Feedback courseid={courseId} />
        </div>
      </div>

      <Modal
        title="Chưa mở quiz"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      >
        <p className="font-semibold text-[#10201c]">
          Hãy hoàn thành tất cả bài học trong playlist để mở quiz và ghi nhận kết quả học tập.
        </p>
      </Modal>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-[#087c5b]" />
            Hỏi đáp dưới bài học
          </div>
        }
        open={isDiscussionOpen}
        onCancel={() => setIsDiscussionOpen(false)}
        footer={null}
        width={800}
        className="discussion-modal"
      >
        <Forum courseId={courseId} />
      </Modal>
    </div>
  );
};

export default Course;
