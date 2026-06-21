import api from "./api";

async function getQuestions(courseId) {
  try {
    const { data } = await api.get(`/api/questions/course/${courseId}`);
    return { success: true, data };
  } catch (err) {
    console.error("Error fetching questions:", err);
    return { success: false, error: "Unable to fetch questions" };
  }
}

async function submitAssessment(userId, courseId, marks) {
  try {
    const payload = { courseId, userId, marks };
    const { data } = await api.post(`/api/assessments/add/${userId}/${courseId}`, payload);
    return { success: true, data };
  } catch (err) {
    console.error("Error submitting assessment:", err);
    return { success: false, error: "Unable to submit assessment" };
  }
}

async function getAssessmentsByUserAndCourse(userId, courseId) {
  try {
    const { data } = await api.get(`/api/assessments/user/${userId}/course/${courseId}`);
    return { success: true, data };
  } catch (err) {
    console.error("Error fetching course assessment:", err);
    return { success: false, error: "Unable to fetch course assessment" };
  }
}

export const assessmentService = {
  getQuestions,
  submitAssessment,
  getAssessmentsByUserAndCourse,
};
