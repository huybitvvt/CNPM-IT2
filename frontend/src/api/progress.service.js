import api from "./api";

async function getProgress(userId, courseId) {
  try {
    const { data } = await api.get(`/api/progress/${userId}/${courseId}`);
    return { success: true, data };
  } catch (err) {
    console.error("Error fetching progress:", err);
    return { success: false, error: err.response?.data?.message || "Unable to fetch progress" };
  }
}

async function updateDuration(userId, courseId, duration) {
  try {
    await api.put(`/api/progress/update-duration`, { userId, courseId, duration });
    return { success: true };
  } catch (err) {
    console.error("Error updating duration:", err);
    return { success: false, error: err.response?.data?.message || "Unable to update duration" };
  }
}

async function updateProgress(userId, courseId, playedTime, duration) {
  try {
    await api.put(`/api/progress/update-progress`, { userId, courseId, playedTime, duration });
    return { success: true };
  } catch (err) {
    console.error("Error updating progress:", err);
    return { success: false, error: err.response?.data?.message || "Unable to update progress" };
  }
}

async function getLessonProgress(userId, lessonId) {
  try {
    const { data } = await api.get(`/api/lesson-progress/${userId}/${lessonId}`);
    return { success: true, data };
  } catch (err) {
    console.error("Error fetching lesson progress:", err);
    return { success: false, error: err.response?.data?.message || "Unable to fetch lesson progress" };
  }
}

async function getCourseProgressSummary(userId, courseId) {
  try {
    const { data } = await api.get(`/api/lesson-progress/${userId}/course/${courseId}/summary`);
    return { success: true, data };
  } catch (err) {
    console.error("Error fetching course progress summary:", err);
    return { success: false, error: err.response?.data?.message || "Unable to fetch course progress summary" };
  }
}

async function updateLessonProgress(userId, lessonId, playedTime, duration) {
  try {
    const { data } = await api.put(`/api/lesson-progress/update`, {
      userId,
      lessonId,
      playedTime,
      duration,
    });
    return { success: true, data };
  } catch (err) {
    console.error("Error updating lesson progress:", err);
    return { success: false, error: err.response?.data?.message || "Unable to update lesson progress" };
  }
}

export const progressService = {
  getProgress,
  updateDuration,
  updateProgress,
  getLessonProgress,
  getCourseProgressSummary,
  updateLessonProgress,
};
