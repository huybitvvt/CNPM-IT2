package com.lms.dev.config;

import com.lms.dev.entity.User;
import com.lms.dev.enums.UserRole;
import com.lms.dev.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@Slf4j
public class AdminInitializer {

    @Value("${app.default-admin.username:admin}")
    private String defaultUsername;

    @Value("${app.default-admin.password:admin123}")
    private String defaultPassword;

    @Value("${app.default-admin.email:admin@gmail.com}")
    private String defaultEmail;

    @Bean
    public CommandLineRunner createDefaultAdmin(UserRepository userRepository,
                                                PasswordEncoder passwordEncoder) {
        return args -> {
            upsertDemoAccount(
                    userRepository,
                    passwordEncoder,
                    defaultEmail,
                    defaultUsername,
                    defaultPassword,
                    UserRole.ADMIN,
                    "Quản trị viên CodePath"
            );

            upsertDemoAccount(
                    userRepository,
                    passwordEncoder,
                    "user@gmail.com",
                    "Nguyễn Văn Học",
                    "user123",
                    UserRole.USER,
                    "Học viên demo"
            );
        };
    }

    private void upsertDemoAccount(UserRepository userRepository,
                                   PasswordEncoder passwordEncoder,
                                   String email,
                                   String username,
                                   String rawPassword,
                                   UserRole role,
                                   String profession) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setMobileNumber(role == UserRole.ADMIN ? "0900000001" : "0900000002");
            user.setLocation("TP. Hồ Chí Minh");
            user.setGender("Prefer not to say");
            user.setGithub_url("https://github.com/demo");
        }

        user.setUsername(username);
        user.setRole(role);
        user.setProfession(profession);
        user.setIsActive(true);

        if (user.getPassword() == null || !passwordEncoder.matches(rawPassword, user.getPassword())) {
            user.setPassword(passwordEncoder.encode(rawPassword));
        }

        userRepository.save(user);
        log.info("Demo account ready: {} ({})", email, role);
    }
}
