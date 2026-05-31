package com.lms.dev.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.lms.dev.dto.AiChatMessage;
import com.lms.dev.dto.AiChatRequest;
import com.lms.dev.dto.AiChatResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.BAD_GATEWAY;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;
import static org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE;

@Service
@Slf4j
public class AiChatService {

    private static final int MAX_HISTORY_MESSAGES = 8;
    private static final int MAX_USER_MESSAGE_LENGTH = 2500;
    private static final int MAX_HISTORY_CONTENT_LENGTH = 1200;

    private final RestTemplate restTemplate;

    @Value("${app.groq.api-key:}")
    private String groqApiKey;

    @Value("${app.groq.model:llama-3.3-70b-versatile}")
    private String groqModel;

    @Value("${app.groq.chat-url:https://api.groq.com/openai/v1/chat/completions}")
    private String groqChatUrl;

    public AiChatService(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofSeconds(10))
                .setReadTimeout(Duration.ofSeconds(45))
                .build();
    }

    public AiChatResponse ask(AiChatRequest request) {
        String userMessage = sanitize(request.message(), MAX_USER_MESSAGE_LENGTH);
        if (userMessage.isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "Vui lòng nhập câu hỏi cho chatbot.");
        }

        if (groqApiKey == null || groqApiKey.isBlank()) {
            throw new ResponseStatusException(
                    SERVICE_UNAVAILABLE,
                    "Chưa cấu hình GROQ_API_KEY cho chatbot AI."
            );
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(groqApiKey);

        Map<String, Object> payload = Map.of(
                "model", groqModel,
                "messages", buildMessages(request.history(), userMessage),
                "temperature", 0.35,
                "max_tokens", 900
        );

        try {
            ResponseEntity<JsonNode> response = restTemplate.exchange(
                    groqChatUrl,
                    HttpMethod.POST,
                    new HttpEntity<>(payload, headers),
                    JsonNode.class
            );

            JsonNode content = response.getBody()
                    .path("choices")
                    .path(0)
                    .path("message")
                    .path("content");

            if (content.isMissingNode() || content.asText().isBlank()) {
                throw new ResponseStatusException(BAD_GATEWAY, "Groq không trả về nội dung hợp lệ.");
            }

            return new AiChatResponse(content.asText().trim(), groqModel);
        } catch (HttpStatusCodeException ex) {
            log.warn("Groq API error: status={}, body={}", ex.getStatusCode(), ex.getResponseBodyAsString());
            if (ex.getStatusCode().value() == 401 || ex.getStatusCode().value() == 403) {
                throw new ResponseStatusException(
                        UNAUTHORIZED,
                        "GROQ_API_KEY không hợp lệ hoặc đã bị thu hồi. Vui lòng tạo key mới trên Groq."
                );
            }
            throw new ResponseStatusException(
                    BAD_GATEWAY,
                    "Chatbot AI đang gặp lỗi kết nối Groq. Vui lòng thử lại sau."
            );
        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (Exception ex) {
            log.warn("Unexpected AI chat error", ex);
            throw new ResponseStatusException(
                    BAD_GATEWAY,
                    "Chatbot AI chưa thể phản hồi. Vui lòng thử lại sau."
            );
        }
    }

    private List<Map<String, String>> buildMessages(List<AiChatMessage> history, String userMessage) {
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of(
                "role", "system",
                "content", """
                        Bạn là CodePath AI Tutor trong hệ thống quản lý khóa học lập trình trực tuyến.
                        Hãy trả lời bằng tiếng Việt rõ ràng, thân thiện, ưu tiên giải thích từng bước.
                        Chỉ hỗ trợ các nội dung liên quan đến học lập trình, lộ trình học, debug, thuật toán,
                        frontend, backend, database, DevOps, quiz và cách sử dụng hệ thống CodePath LMS.
                        Khi người học hỏi bài tập, hãy hướng dẫn tư duy và ví dụ nhỏ; không khuyến khích chép đáp án máy móc.
                        Nếu không chắc, hãy nói rõ và đề xuất cách kiểm chứng.
                        """
        ));

        if (history != null && !history.isEmpty()) {
            int fromIndex = Math.max(0, history.size() - MAX_HISTORY_MESSAGES);
            for (AiChatMessage message : history.subList(fromIndex, history.size())) {
                String role = normalizeRole(message.role());
                String content = sanitize(message.content(), MAX_HISTORY_CONTENT_LENGTH);
                if (!content.isBlank()) {
                    messages.add(Map.of("role", role, "content", content));
                }
            }
        }

        messages.add(Map.of("role", "user", "content", userMessage));
        return messages;
    }

    private String normalizeRole(String role) {
        return "assistant".equals(role) ? "assistant" : "user";
    }

    private String sanitize(String value, int maxLength) {
        if (value == null) {
            return "";
        }
        String trimmed = value.trim();
        return trimmed.length() <= maxLength ? trimmed : trimmed.substring(0, maxLength);
    }
}
