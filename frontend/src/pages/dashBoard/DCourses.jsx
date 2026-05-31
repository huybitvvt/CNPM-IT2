import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus, faBookOpen, faClipboardList, faVideo } from "@fortawesome/free-solid-svg-icons";
import { message } from "antd";
import { adminService } from "../../api/admin.service";
import CourseModal from "./CourseModal";
import DeleteModal from "./DeleteModal";
import AddQuestion from "./AddQuestions";
import LessonManagerModal from "./LessonManagerModal";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [courseModal, setCourseModal] = useState({
    isOpen: false,
    mode: "add",
    courseId: null,
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    course: null,
  });

  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [lessonModal, setLessonModal] = useState({
    isOpen: false,
    course: null,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const result = await adminService.getAllCourses();
      if (result.success) {
        setCourses(result.data);
      } else {
        message.error(result.error);
      }
    } catch {
      message.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const openAddCourseModal = () => {
    setCourseModal({ isOpen: true, mode: "add", courseId: null });
  };

  const openEditCourseModal = (course) => {
    setCourseModal({ isOpen: true, mode: "edit", courseId: course.course_id });
  };

  const closeCourseModal = () => {
    setCourseModal({ isOpen: false, mode: "add", courseId: null });
  };

  const handleCourseSuccess = () => {
    fetchCourses();
  };

  const openDeleteModal = (course) => {
    setDeleteModal({ isOpen: true, course });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, course: null });
  };

  const handleDeleteCourse = async (course) => {
    return await adminService.deleteCourse(course.course_id);
  };

  const handleDeleteSuccess = () => {
    fetchCourses();
  };

  const addQuestions = (course_id) => {
    setSelectedCourseId(course_id);
  };

  const openLessonModal = (course) => {
    setLessonModal({ isOpen: true, course });
  };

  const closeLessonModal = () => {
    setLessonModal({ isOpen: false, course: null });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {selectedCourseId ? (
        <AddQuestion courseId={selectedCourseId} onBack={() => setSelectedCourseId(null)} />
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-br from-indigo-100 to-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Quản lý khóa học</h1>
                <p className="text-gray-600">Tạo, cập nhật khóa học lập trình và quản lý câu hỏi đánh giá</p>
              </div>
              <button
                onClick={openAddCourseModal}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl px-6 py-3 font-semibold flex items-center gap-3 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FontAwesomeIcon icon={faPlus} className="text-sm" />
                Thêm khóa học
              </button>
            </div>
          </div>

          <div className="p-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                <p className="mt-4 text-gray-600 font-medium">Đang tải danh sách khóa học...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <FontAwesomeIcon icon={faBookOpen} className="text-3xl text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Chưa có khóa học</h3>
                <p className="text-gray-500 mb-8 max-w-md">
                  Hãy tạo khóa học đầu tiên để bắt đầu quản lý nội dung, học viên và câu hỏi kiểm tra.
                </p>
                <button
                  onClick={openAddCourseModal}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl px-8 py-4 font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Tạo khóa học đầu tiên
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {courses.map((course) => (
                  <div key={course.course_id} className="group bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:border-blue-200 transition-all duration-300 overflow-hidden" >
                    <div className="p-6 flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold text-gray-900 truncate"> {course.course_name} </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"> Đang mở </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          {course.category && (<div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Danh mục:</span>
                            <span className="text-sm font-medium text-gray-900"> {course.category} </span>
                          </div>
                          )}
                          {course.instructor && (<div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Giảng viên:</span>
                            <span className="text-sm font-medium text-gray-900"> {course.instructor} </span>
                          </div>
                          )}
                          {course.level && (<div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Cấp độ:</span>
                            <span className="text-sm font-medium text-gray-900"> {course.level} </span>
                          </div>
                          )}
                          {course.price &&
                            (
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">Học phí:</span>
                                <span className="text-lg font-bold text-green-600">{Number(course.price || 0).toLocaleString("vi-VN")} VND</span>
                              </div>
                            )}
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Thời lượng:</span>
                            <span className="text-sm font-medium text-gray-900"> {course.durationHours || 0} giờ </span>
                          </div>
                        </div>
                      </div>
                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-6">
                        <button onClick={() => openLessonModal(course)} className="inline-flex items-center gap-2 px-4 py-2 bg-[#16a676] hover:bg-[#087c5b] text-white text-sm font-medium rounded-lg transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg" >
                          <FontAwesomeIcon icon={faVideo} className="text-sm" /> Bài học </button>
                        <button onClick={() => addQuestions(course.course_id)} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium rounded-lg transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg" >
                          <FontAwesomeIcon icon={faClipboardList} className="text-sm" /> Câu hỏi </button>
                        <button onClick={() => openEditCourseModal(course)} className="p-2.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200" >
                          <FontAwesomeIcon icon={faEdit} className="w-4 h-4" /> </button>
                        <button onClick={() => openDeleteModal(course)} className="p-2.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200" >
                          <FontAwesomeIcon icon={faTrash} className="w-4 h-4" /> </button>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 bg-gray-50 px-6 py-3 flex justify-between items-center">
                      <div className="flex gap-6 text-sm text-gray-600">{/* meta info here */}</div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium"> Xem chi tiết → </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <CourseModal
        isOpen={courseModal.isOpen}
        onClose={closeCourseModal}
        onSuccess={handleCourseSuccess}
        courseId={courseModal.courseId}
        mode={courseModal.mode}
      />
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onSuccess={handleDeleteSuccess}
        onDelete={handleDeleteCourse}
        item={deleteModal.course}
        itemType="khóa học"
        title="Xóa khóa học"
        description="Bạn có chắc chắn muốn xóa khóa học này?"
        itemDisplayName={deleteModal.course?.course_name}
      />
      <LessonManagerModal
        isOpen={lessonModal.isOpen}
        onClose={closeLessonModal}
        course={lessonModal.course}
      />
    </div>
  );
}

export default Courses;
