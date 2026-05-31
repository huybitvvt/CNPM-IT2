import api from "./api";

async function ask(message, history = []) {
  const response = await api.post("/api/ai-chat", {
    message,
    history: history.map((item) => ({
      role: item.role,
      content: item.content,
    })),
  });
  return response.data;
}

export const aiService = {
  ask,
};
