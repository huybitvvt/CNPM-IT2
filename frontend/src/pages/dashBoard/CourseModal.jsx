import { Modal, Form, Input, InputNumber, Select, message } from "antd";
import { useState, useEffect, useCallback } from "react";
import { adminService } from "../../api/admin.service";

const { TextArea } = Input;
const { Option } = Select;

function CourseModal({ isOpen, onClose, onSuccess, courseId = null, mode = "add" }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);

  const isEditMode = mode === "edit" || courseId !== null;
  const modalTitle = isEditMode ? "Cập nhật khóa học" : "Thêm khóa học mới";
  const submitButtonText = isEditMode ? "Cập nhật khóa học" : "Thêm khóa học";
  const loadingText = isEditMode ? "Đang cập nhật..." : "Đang thêm...";

  const fetchCourseData = useCallback(async () => {
    setFetchingData(true);
    try {
      const result = await adminService.getCourseById(courseId);
      if (result.success) {
        const formData = {
          course_name: result.data.course_name,
          instructor: result.data.instructor,
          category: result.data.category,
          level: result.data.level,
          durationHours: result.data.durationHours,
          price: result.data.price,
          description: result.data.description,
          y_link: result.data.y_link,
          p_link: result.data.p_link,
        };
        form.setFieldsValue(formData);
      } else {
        message.error(result.error);
        onClose();
      }
    } catch {
        message.error("Không thể tải dữ liệu khóa học");
      onClose();
    } finally {
      setFetchingData(false);
    }
  }, [courseId, form, onClose]);

  useEffect(() => {
    if (isOpen && isEditMode && courseId) {
      fetchCourseData();
    } else if (isOpen && !isEditMode) {
      form.resetFields();
    }
  }, [isOpen, courseId, isEditMode, fetchCourseData, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      let result;
      if (isEditMode) {
        const editData = {
          course_name: values.course_name,
          instructor: values.instructor,
          category: values.category,
          level: values.level,
          durationHours: values.durationHours,
          price: values.price,
          description: values.description,
          y_link: values.y_link,
          p_link: values.p_link,
        };
        result = await adminService.updateCourse(courseId, editData);
      } else {
        const addData = {
          course_name: values.course_name,
          instructor: values.instructor,
          category: values.category,
          level: values.level,
          durationHours: values.durationHours,
          price: values.price,
          description: values.description,
          y_link: values.y_link,
          p_link: values.p_link,
        };
        result = await adminService.createCourse(addData);
      }

      if (result.success) {
        message.success(isEditMode ? "Cập nhật khóa học thành công" : "Thêm khóa học thành công");
        form.resetFields();
        onClose();
        onSuccess?.();
      } else {
        message.error(result.error);
      }
    } catch {
      message.error("Đã xảy ra lỗi, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={modalTitle}
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width={600}
      className="custom-modal"
      destroyOnClose
    >
      {fetchingData ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
          <span className="ml-3 text-gray-600">Đang tải dữ liệu khóa học...</span>
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-2 space-y-4"
          initialValues={{
            course_name: "",
            instructor: "",
            category: "Frontend",
            level: "Beginner",
            durationHours: 12,
            price: 0,
            description: "",
            y_link: "",
            p_link: "",
          }}
        >
          <Form.Item
            label="Tên khóa học"
            name="course_name"
            rules={[
              { required: true, message: "Vui lòng nhập tên khóa học" },
              { min: 3, message: "Tên khóa học cần ít nhất 3 ký tự" },
              { max: 100, message: "Tên khóa học không vượt quá 100 ký tự" },
            ]}
          >
            <Input placeholder="Ví dụ: Spring Boot REST API và JWT" />
          </Form.Item>

          <Form.Item
            label="Giảng viên"
            name="instructor"
            rules={[
              { required: true, message: "Vui lòng nhập tên giảng viên" },
              { min: 2, message: "Tên giảng viên cần ít nhất 2 ký tự" },
            ]}
          >
            <Input placeholder="Nhập tên giảng viên phụ trách" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item
              label="Danh mục"
              name="category"
              rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
            >
              <Select placeholder="Chọn danh mục">
                <Option value="Frontend">Frontend</Option>
                <Option value="Backend">Backend</Option>
                <Option value="Database">Database</Option>
                <Option value="Data">Data</Option>
                <Option value="Mobile">Mobile</Option>
                <Option value="DevOps">DevOps</Option>
                <Option value="Programming">Programming</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Cấp độ"
              name="level"
              rules={[{ required: true, message: "Vui lòng chọn cấp độ" }]}
            >
              <Select placeholder="Chọn cấp độ">
                <Option value="Beginner">Beginner</Option>
                <Option value="Intermediate">Intermediate</Option>
                <Option value="Advanced">Advanced</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Thời lượng"
              name="durationHours"
              rules={[
                { required: true, message: "Vui lòng nhập thời lượng" },
                { type: "number", min: 1, message: "Thời lượng tối thiểu là 1 giờ" },
              ]}
            >
              <InputNumber className="w-full" min={1} max={200} addonAfter="giờ" />
            </Form.Item>
          </div>

          <Form.Item
            label="Học phí"
            name="price"
            rules={[
              { required: true, message: "Vui lòng nhập học phí" },
              { type: "number", min: 0, message: "Học phí không được âm" },
            ]}
          >
            <InputNumber
              placeholder="Nhập học phí"
              className="w-full"
              min={0}
              step={0.01}
              formatter={(value) =>
                `${value} VND`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\s?VND|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item
            label="Mô tả khóa học"
            name="description"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả khóa học" },
              { min: 10, message: "Mô tả cần ít nhất 10 ký tự" },
              { max: 500, message: "Mô tả không vượt quá 500 ký tự" },
            ]}
          >
            <TextArea rows={4} placeholder="Mô tả mục tiêu, nội dung chính và kết quả đầu ra của khóa học" showCount maxLength={500} />
          </Form.Item>

          <Form.Item
            label="Liên kết video"
            name="y_link"
            rules={[
              { required: true, message: "Vui lòng nhập liên kết video" },
              { type: "url", message: "Vui lòng nhập URL hợp lệ" },
            ]}
          >
            <Input placeholder="https://www.youtube.com/watch?v=..." />
          </Form.Item>

          <Form.Item
            label="Ảnh đại diện khóa học"
            name="p_link"
            rules={[
              { required: true, message: "Vui lòng nhập liên kết ảnh" },
              { type: "url", message: "Vui lòng nhập URL hợp lệ" },
            ]}
          >
            <Input placeholder="https://example.com/course-thumbnail.jpg" />
          </Form.Item>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium min-w-[140px] flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {loadingText}
                </>
              ) : (
                submitButtonText
              )}
            </button>
          </div>
        </Form>
      )}
    </Modal>
  );
}

export default CourseModal;
