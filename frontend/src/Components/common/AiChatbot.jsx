import React, { useMemo, useRef, useState } from "react";
import { Bot, Loader2, MessageCircle, RotateCcw, Send, X } from "lucide-react";
import { message as antdMessage } from "antd";
import { aiService } from "../../api/ai.service";
import { authService } from "../../api/auth.service";

const STORAGE_KEY = "codepath_ai_chat_history";

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.slice(-10) : [];
  } catch {
    return [];
  }
}

function saveHistory(messages) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-10)));
}

function AiChatbot() {
  const currentUser = authService.getCurrentUser();
  const isAuthenticated = Boolean(currentUser.token);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState(() => loadHistory());
  const inputRef = useRef(null);

  const displayName = useMemo(() => currentUser.name || "bạn", [currentUser.name]);

  if (!isAuthenticated) {
    return null;
  }

  const openChat = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 120);
  };

  const resetChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) {
      return;
    }

    const nextMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    saveHistory(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const result = await aiService.ask(trimmed, messages);
      const completed = [
        ...nextMessages,
        {
          role: "assistant",
          content: result.answer || "Mình chưa có câu trả lời phù hợp.",
        },
      ];
      setMessages(completed);
      saveHistory(completed);
    } catch (error) {
      const errorText =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Chatbot AI chưa thể phản hồi. Kiểm tra GROQ_API_KEY hoặc thử lại sau.";
      antdMessage.error(errorText);
      setMessages(nextMessages);
      saveHistory(nextMessages);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[1200]">
      {isOpen && (
        <section className="mb-4 flex h-[min(620px,calc(100vh-7rem))] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[#cfe1d8] bg-white shadow-2xl">
          <header className="flex items-center justify-between border-b border-[#e2eee8] bg-[#10201c] px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7b733] text-[#10201c]">
                <Bot size={21} strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <p className="m-0 text-sm font-black">CodePath AI Tutor</p>
                <p className="m-0 text-xs font-medium text-[#d8e9e1]">
                  Hỗ trợ học lập trình bằng Groq
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={resetChat}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#d8e9e1] transition hover:bg-white/10 hover:text-white"
                aria-label="Xóa lịch sử chat"
                title="Xóa lịch sử"
              >
                <RotateCcw size={18} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#d8e9e1] transition hover:bg-white/10 hover:text-white"
                aria-label="Đóng chatbot"
                title="Đóng"
              >
                <X size={20} />
              </button>
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#f6faf8] px-4 py-4 text-left">
            {messages.length === 0 && (
              <div className="rounded-2xl border border-[#dbe9e2] bg-white p-4 shadow-sm">
                <p className="m-0 text-sm font-black text-[#10201c]">
                  Xin chào {displayName}, mình có thể hỗ trợ gì?
                </p>
                <p className="mb-0 mt-2 text-sm leading-6 text-[#5d6c67]">
                  Bạn có thể hỏi về Java, React, Spring Boot, SQL, lộ trình học,
                  debug lỗi hoặc nội dung trong khóa học.
                </p>
              </div>
            )}

            {messages.map((item, index) => {
              const isUser = item.role === "user";
              return (
                <div
                  key={`${item.role}-${index}`}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[86%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                      isUser
                        ? "bg-[#16a676] text-white"
                        : "border border-[#dbe9e2] bg-white text-[#10201c]"
                    }`}
                  >
                    {item.content}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl border border-[#dbe9e2] bg-white px-4 py-3 text-sm font-semibold text-[#61706b] shadow-sm">
                  <Loader2 size={16} className="animate-spin" />
                  Đang suy nghĩ...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-[#e2eee8] bg-white p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSubmit(event);
                  }
                }}
                rows={2}
                maxLength={2500}
                placeholder="Hỏi AI về bài học, code hoặc lỗi bạn đang gặp..."
                className="min-h-[48px] flex-1 resize-none rounded-xl border border-[#d2e3db] bg-[#fbfefc] px-3 py-2 text-sm text-[#10201c] outline-none transition placeholder:text-[#8ca099] focus:border-[#16a676] focus:ring-4 focus:ring-[#16a676]/10"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#10201c] text-white shadow-sm transition hover:bg-[#1f3832] disabled:cursor-not-allowed disabled:bg-[#b8c8c1]"
                aria-label="Gửi câu hỏi"
              >
                {isLoading ? <Loader2 size={19} className="animate-spin" /> : <Send size={19} />}
              </button>
            </div>
            <p className="mb-0 mt-2 text-xs font-medium text-[#7b8d86]">
              AI có thể sai. Hãy kiểm chứng với bài học, tài liệu và kết quả chạy code.
            </p>
          </form>
        </section>
      )}

      {!isOpen && (
        <button
          type="button"
          onClick={openChat}
          className="group relative flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-4 text-sm font-black text-white shadow-glow-emerald transition hover:-translate-y-0.5"
        >
          {/* pulse notification ring */}
          <span className="absolute -right-1 -top-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[9px] font-black text-[#10201c]">
              1
            </span>
          </span>
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white">
            <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-xl bg-white/30" />
            <MessageCircle size={20} strokeWidth={2.5} className="relative" />
          </span>
          AI Tutor
        </button>
      )}
    </div>
  );
}

export default AiChatbot;
