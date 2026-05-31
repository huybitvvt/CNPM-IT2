package com.lms.dev.controller;

import com.lms.dev.dto.AiChatRequest;
import com.lms.dev.dto.AiChatResponse;
import com.lms.dev.service.AiChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai-chat")
@RequiredArgsConstructor
public class AiChatController {

    private final AiChatService aiChatService;

    @PostMapping
    public ResponseEntity<AiChatResponse> ask(@RequestBody AiChatRequest request) {
        return ResponseEntity.ok(aiChatService.ask(request));
    }
}
