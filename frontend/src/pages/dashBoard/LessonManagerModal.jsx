import { Modal, Form, Input, InputNumber, message } from "antd";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faPlus,
  faRotateRight,
  faTrash,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { adminService } from "../../api/admin.service";

const { TextArea } = Input;

function LessonManagerModal({ isOpen, onClose, course }) {
  const [form] = Form.useForm();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);

  const courseId = course?.course_id;

  const fetchLessons = async () => {
    if (!courseId) return;

    setLoading(true);
    const result = await adminService.getLessonsByCourse(courseId);
    if (result.success) {
      setLessons(result.data || []);
    } else {
      message.error("Không thể tải danh sách bài học");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      setEditingLesson(null);
      form.resetFields();
      fetchLessons();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, courseId]);

  const resetForm = () => {
    setEditingLesson(null);
    form.resetFields();
    form.setFieldsValue({
      lessonOrder: lessons.length + 1,
      durationMinutes: 15,
      sourceName: "YouTube",
    });
  };

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    form.setFieldsValue({
      title: lesson.title,
      description: lesson.description,
      videoUrl: lesson.videoUrl,
      sourceName: lesson.sourceName,
      materialUrl: lesson.materialUrl,
      sourceCodeUrl: lesson.sourceCodeUrl,
      durationMinutes: lesson.durationMinutes,
      lessonOrder: lesson.lessonOrder,
    });
  };

  const handleDelete = async (lesson) => {
    const confirmed = window.confirm(`Xóa bài học "${lesson.title}"?`);
    if (!confirmed) return;

    const result = await adminService.deleteLesson(lesson.lessonId);
    if (result.success) {
      message.success("Đã xóa bài học");
      if (editingLesson?.lessonId === lesson.lessonId) {
        resetForm();
      }
      fetchLessons();
    } else {
      message.error("Không thể xóa bài học");
    }
  };

  const handleSubmit = async (values) => {
    setSaving(true);

    const payload = {
      title: values.title,
      description: values.description,
      videoUrl: values.videoUrl,
      sourceName: values.sourceName,
      materialUrl: values.materialUrl,
      sourceCodeUrl: values.sourceCodeUrl,
      durationMinutes: values.durationMinutes,
      lessonOrder: values.lessonOrder,
    };

    const result = editingLesson
      ? await adminService.updateLesson(editingLesson.lessonId, payload)
      : await adminService.createLesson(courseId, payload);

    if (result.success) {
      message.success(editingLesson ? "Cập nhật bài học thành công" : "Thêm bài học thành công");
      resetForm();
      fetchLessons();
    } else {
      message.error(editingLesson ? "Không thể cập nhật bài học" : "Không thể thêm bài học");
    }

    setSaving(false);
  };

  return (
    <Modal
      title={`Quản lý bài học - ${course?.course_name || ""}`}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1080}
      destroyOnClose
    >
      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-lg border border-[#d9e5df] bg-[#fbfefc] p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="m-0 text-sm font-black uppercase tracking-wide text-[#087c5b]">
                Playlist
              </p>
              <h3 className="m-0 mt-1 text-lg font-black text-[#10201c]">
                {lessons.length} bài học
              </h3>
            </div>
            <button
              type="button"
              onClick={fetchLessons}
              className="rounded-lg border border-[#d9e5df] bg-white px-3 py-2 text-sm font-bold text-[#61706b] transition hover:border-[#16a676] hover:text-[#087c5b]"
            >
              <FontAwesomeIcon icon={faRotateRight} className="mr-2" />
              Tải lại
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm font-semibold text-[#61706b]">
              Đang tải bài học...
            </div>
          ) : lessons.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#d9e5df] bg-white p-6 text-center text-sm font-semibold text-[#61706b]">
              Khóa học này chưa có bài học. Hãy thêm bài đầu tiên ở form bên phải.
            </div>
          ) : (
            <div className="max-h-[590px] space-y-3 overflow-y-auto pr-1">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.lessonId}
                  className={`rounded-lg border bg-white p-4 transition ${
                    editingLesson?.lessonId === lesson.lessonId
                      ? "border-[#16a676] shadow-sm"
                      : "border-[#d9e5df]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e9f8f1] text-xs font-black text-[#087c5b]">
                      {lesson.lessonOrder || index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="m-0 text-sm font-black leading-6 text-[#10201c]">
                        {lesson.title}
                      </h4>
                      <p className="m-0 mt-1 line-clamp-2 text-xs leading-5 text-[#61706b]">
                        {lesson.description || "Chưa có mô tả"}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold text-[#61706b]">
                        <span>{lesson.sourceName || "YouTube"}</span>
                        <span>{lesson.durationMinutes || "--"} phút</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(lesson)}
                      className="rounded-lg bg-[#e8f2fb] px-3 py-2 text-xs font-black text-[#2474b5] transition hover:bg-[#d7eafb]"
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-1" />
                      Sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(lesson)}
                      className="rounded-lg bg-red-50 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-100"
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-1" />
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-lg border border-[#d9e5df] bg-white p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="m-0 text-sm font-black uppercase tracking-wide text-[#087c5b]">
                Nội dung bài học
              </p>
              <h3 className="m-0 mt-1 text-lg font-black text-[#10201c]">
                {editingLesson ? "Cập nhật bài học" : "Thêm bài học mới"}
              </h3>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-[#d9e5df] bg-[#fbfefc] px-3 py-2 text-sm font-bold text-[#10201c] transition hover:border-[#16a676] hover:text-[#087c5b]"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Bài mới
            </button>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              sourceName: "YouTube",
              durationMinutes: 15,
              lessonOrder: lessons.length + 1,
            }}
          >
            <Form.Item
              label="Tiêu đề bài học"
              name="title"
              rules={[
                { required: true, message: "Vui lòng nhập tiêu đề bài học" },
                { min: 3, message: "Tiêu đề cần ít nhất 3 ký tự" },
              ]}
            >
              <Input placeholder="Ví dụ: React Router V6" />
            </Form.Item>

            <Form.Item
              label="Mô tả ngắn"
              name="description"
              rules={[{ required: true, message: "Vui lòng nhập mô tả bài học" }]}
            >
              <TextArea rows={3} placeholder="Bài học này giúp người học nắm được..." />
            </Form.Item>

            <Form.Item
              label="Link video YouTube"
              name="videoUrl"
              rules={[
                { required: true, message: "Vui lòng nhập link video" },
                { type: "url", message: "Link video chưa hợp lệ" },
              ]}
            >
              <Input placeholder="https://www.youtube.com/watch?v=..." />
            </Form.Item>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Form.Item
                label="Nguồn"
                name="sourceName"
                rules={[{ required: true, message: "Vui lòng nhập nguồn video" }]}
              >
                <Input placeholder="F8 Official" />
              </Form.Item>

              <Form.Item
                label="Thời lượng"
                name="durationMinutes"
                rules={[
                  { required: true, message: "Vui lòng nhập thời lượng" },
                  { type: "number", min: 1, message: "Tối thiểu 1 phút" },
                ]}
              >
                <InputNumber className="w-full" min={1} max={600} addonAfter="phút" />
              </Form.Item>

              <Form.Item
                label="Thứ tự"
                name="lessonOrder"
                rules={[
                  { required: true, message: "Vui lòng nhập thứ tự" },
                  { type: "number", min: 1, message: "Thứ tự từ 1 trở lên" },
                ]}
              >
                <InputNumber className="w-full" min={1} max={200} />
              </Form.Item>
            </div>

            <Form.Item label="Link tài liệu PDF" name="materialUrl">
              <Input placeholder="https://example.com/lesson.pdf" />
            </Form.Item>

            <Form.Item label="Link source code" name="sourceCodeUrl">
              <Input placeholder="https://github.com/example/source-code" />
            </Form.Item>

            <div className="flex justify-end gap-3 border-t border-[#d9e5df] pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-[#d9e5df] px-5 py-2 text-sm font-bold text-[#61706b] transition hover:bg-[#f6faf8]"
              >
                Đóng
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#16a676] px-5 py-2 text-sm font-black text-white transition hover:bg-[#087c5b] disabled:opacity-60"
              >
                <FontAwesomeIcon icon={faVideo} className="mr-2" />
                {saving ? "Đang lưu..." : editingLesson ? "Cập nhật bài học" : "Thêm bài học"}
              </button>
            </div>
          </Form>
        </section>
      </div>
    </Modal>
  );
}

export default LessonManagerModal;
