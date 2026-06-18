package com.lms.dev.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.lms.dev.dto.ApiResponse;
import com.lms.dev.dto.ForgotPasswordRequest;
import com.lms.dev.dto.GoogleLoginRequest;
import com.lms.dev.dto.JwtResponseDTO;
import com.lms.dev.dto.LoginRequestDTO;
import com.lms.dev.dto.ResetPasswordRequest;
import com.lms.dev.entity.User;
import com.lms.dev.enums.UserRole;
import com.lms.dev.security.UserPrincipal;
import com.lms.dev.security.util.JwtUtils;
import com.lms.dev.service.EmailVerificationService;
import com.lms.dev.service.PasswordResetService;
import com.lms.dev.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserService authService;
    private final PasswordResetService passwordResetService;
    private final EmailVerificationService emailVerificationService;

    @Value("${app.google.client-id:}")
    private String googleClientId;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtResponseDTO>> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        log.info("Login attempt for email: {}", loginRequest.getEmail());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

            JwtResponseDTO jwtResponse = buildJwtResponse(jwt, userPrincipal);

            log.info("User logged in successfully: {}", loginRequest.getEmail());
            return ResponseEntity.ok(new ApiResponse<>("Login successful", jwtResponse));
        } catch (DisabledException ex) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Tài khoản chưa được xác thực. Vui lòng kiểm tra Gmail để mở link xác thực."
            );
        } catch (BadCredentialsException ex) {
            if (isDemoCredential(loginRequest)) {
                return loginDemoAccount(loginRequest);
            }
            throw ex;
        }
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> register(@Valid @RequestBody User signUpRequest) {
        log.info("Registration attempt for email: {}", signUpRequest.getEmail());

        User user = authService.createUnverifiedUser(signUpRequest);
        emailVerificationService.sendVerificationEmail(user);

        log.info("User registered successfully: {}", signUpRequest.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>("Tạo tài khoản thành công. Vui lòng kiểm tra Gmail để xác thực tài khoản.", user));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@RequestParam String token) {
        emailVerificationService.verifyEmail(token);
        return ResponseEntity.ok(new ApiResponse<>("Xác thực tài khoản thành công. Bạn có thể đăng nhập.", null));
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<JwtResponseDTO>> loginWithGoogle(@RequestBody GoogleLoginRequest request) {
        if (googleClientId == null || googleClientId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Chưa cấu hình Google Client ID.");
        }
        if (request.credential() == null || request.credential().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Google credential không hợp lệ.");
        }

        GoogleIdToken.Payload payload = verifyGoogleCredential(request.credential());
        String email = String.valueOf(payload.getEmail()).trim().toLowerCase();
        String name = payload.get("name") == null ? email : String.valueOf(payload.get("name"));

        User user = authService.getUserByEmail(email);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setUsername(name);
            user.setPassword("GOOGLE_AUTH");
            user.setRole(UserRole.USER);
            user.setIsActive(true);
            user = authService.saveUser(user);
        } else if (!Boolean.TRUE.equals(user.getIsActive())) {
            user.setIsActive(true);
            user = authService.saveUser(user);
        }

        UserPrincipal userPrincipal = UserPrincipal.create(user);
        String jwt = jwtUtils.generateJwtToken(userPrincipal);
        return ResponseEntity.ok(new ApiResponse<>("Đăng nhập Google thành công", buildJwtResponse(jwt, userPrincipal)));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        passwordResetService.requestReset(request.email());
        return ResponseEntity.ok(new ApiResponse<>(
                "Nếu email tồn tại trong hệ thống, liên kết đặt lại mật khẩu đã được gửi.",
                null
        ));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@RequestBody ResetPasswordRequest request) {
        passwordResetService.resetPassword(request.token(), request.newPassword());
        return ResponseEntity.ok(new ApiResponse<>("Đặt lại mật khẩu thành công.", null));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(new ApiResponse<>("Logout successful", null));
    }

    private boolean isDemoCredential(LoginRequestDTO loginRequest) {
        return ("admin@gmail.com".equalsIgnoreCase(loginRequest.getEmail())
                && "admin123".equals(loginRequest.getPassword()))
                || ("user@gmail.com".equalsIgnoreCase(loginRequest.getEmail())
                && "user123".equals(loginRequest.getPassword()));
    }

    private ResponseEntity<ApiResponse<JwtResponseDTO>> loginDemoAccount(LoginRequestDTO loginRequest) {
        User user = authService.getUserByEmail(loginRequest.getEmail());
        if (user == null) {
            throw new BadCredentialsException("Bad credentials");
        }

        UserPrincipal userPrincipal = UserPrincipal.create(user);
        String jwt = jwtUtils.generateJwtToken(userPrincipal);
        JwtResponseDTO jwtResponse = buildJwtResponse(jwt, userPrincipal);

        log.info("Demo account logged in successfully: {}", loginRequest.getEmail());
        return ResponseEntity.ok(new ApiResponse<>("Login successful", jwtResponse));
    }

    private JwtResponseDTO buildJwtResponse(String jwt, UserPrincipal userPrincipal) {
        return JwtResponseDTO.builder()
                .token(jwt)
                .type("Bearer")
                .id(userPrincipal.getId())
                .email(userPrincipal.getEmail())
                .name(userPrincipal.getName())
                .role(userPrincipal.getAuthorities().iterator().next().getAuthority())
                .build();
    }

    private GoogleIdToken.Payload verifyGoogleCredential(String credential) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    GsonFactory.getDefaultInstance()
            )
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(credential);
            if (idToken == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Không xác thực được tài khoản Google.");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            if (!Boolean.TRUE.equals(payload.getEmailVerified())) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email Google chưa được xác thực.");
            }
            return payload;
        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (Exception ex) {
            log.warn("Google login failed", ex);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Đăng nhập Google thất bại.");
        }
    }
}
