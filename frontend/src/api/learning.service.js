import api from "./api";

async function getEnrollments(userId) {
  try {
    const { data } = await api.get(`/api/learning/${userId}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return { success: false, error: "Could not fetch enrollments" };
  }
}

async function enrollCourse(userId, courseId) {
  try {
    const { data } = await api.post("/api/learning", { userId, courseId });
    return { success: true, data };
  } catch (error) {
    console.error("Enrollment error:", error);
    return { success: false, error: "Could not enroll in course" };
  }
}

async function createCoursePayment(userId, courseId) {
  try {
    const { data } = await api.post("/api/payments/course", { userId, courseId });
    return { success: true, data: data.data };
  } catch (error) {
    console.error("Create payment error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Không tạo được đơn thanh toán.",
    };
  }
}

async function getPayment(paymentId) {
  try {
    const { data } = await api.get(`/api/payments/${paymentId}`);
    return { success: true, data: data.data };
  } catch (error) {
    console.error("Get payment error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Không lấy được trạng thái thanh toán.",
    };
  }
}

export const learningService = {
  getEnrollments,
  enrollCourse,
  createCoursePayment,
  getPayment,
};
