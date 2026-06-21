package com.lms.dev.config;

import com.lms.dev.entity.Course;
import com.lms.dev.entity.CourseLesson;
import com.lms.dev.entity.Questions;
import com.lms.dev.repository.CourseLessonRepository;
import com.lms.dev.repository.CourseRepository;
import com.lms.dev.repository.QuestionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@Slf4j
public class CourseCatalogInitializer {

    @Bean
    public CommandLineRunner createProgrammingCourseCatalog(CourseRepository courseRepository,
                                                            CourseLessonRepository courseLessonRepository,
                                                            QuestionRepository questionRepository) {
        return args -> {
            if (courseRepository.count() > 0) {
                backfillCourseMetadata(courseRepository);
                seedLessonsForCatalog(courseRepository.findAll(), courseLessonRepository, courseRepository);
                seedQuestionsForCatalog(courseRepository.findAll(), questionRepository);
                log.info("Course catalog already has data, metadata backfill checked.");
                return;
            }

            List<Course> courses = courseRepository.saveAll(List.of(
                    createCourse(
                            "ReactJS từ cơ bản đến dự án thực tế",
                            "Nguyen Minh Khoa",
                            499000,
                            "Frontend",
                            "Intermediate",
                            18,
                            "Học React theo lộ trình thực chiến: component, props, state, hooks, routing, API và xây dựng dashboard quản lý khóa học.",
                            "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80",
                            "https://www.youtube.com/watch?v=x0fSBAgBrOQ"
                    ),
                    createCourse(
                            "Spring Boot REST API và JWT",
                            "Tran Bao Long",
                            599000,
                            "Backend",
                            "Advanced",
                            22,
                            "Xây dựng backend Java với Spring Boot, Spring Data JPA, Spring Security, JWT, Swagger và kết nối PostgreSQL/Supabase.",
                            "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
                            "https://www.youtube.com/watch?v=MiHVcukru3U"
                    ),
                    createCourse(
                            "Java Core cho người mới bắt đầu",
                            "Pham Quang Huy",
                            399000,
                            "Backend",
                            "Beginner",
                            20,
                            "Nắm vững Java Core, OOP, collection, exception, file IO và các nền tảng cần có trước khi học Spring Boot.",
                            "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1200&q=80",
                            "https://www.youtube.com/watch?v=3gtOAlcovoQ"
                    ),
                    createCourse(
                            "SQL và thiết kế cơ sở dữ liệu",
                            "Le Anh Thu",
                            349000,
                            "Database",
                            "Beginner",
                            14,
                            "Học SQL, ERD, chuẩn hóa dữ liệu, truy vấn nâng cao và thiết kế database cho hệ thống quản lý khóa học.",
                            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
                            "https://www.youtube.com/watch?v=2fanjSYVElY"
                    ),
                    createCourse(
                            "Python nền tảng và ứng dụng",
                            "Do Thanh Nam",
                            449000,
                            "Data",
                            "Beginner",
                            16,
                            "Làm quen Python, cấu trúc dữ liệu, xử lý file, module và viết các ứng dụng nhỏ phục vụ học tập lập trình.",
                            "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80",
                            "https://www.youtube.com/watch?v=NZj6LI5a9vc"
                    ),
                    createCourse(
                            "DevOps căn bản với Docker và CI/CD",
                            "Hoang Gia Bao",
                            699000,
                            "DevOps",
                            "Intermediate",
                            18,
                            "Tìm hiểu Docker, container, biến môi trường, pipeline CI/CD và triển khai ứng dụng fullstack lên cloud.",
                            "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1200&q=80",
                            "https://www.youtube.com/watch?v=P1IpryhFeLM"
                    )
            ));
            seedLessonsForCatalog(courses, courseLessonRepository, courseRepository);
            seedQuestionsForCatalog(courses, questionRepository);
            log.info("Sample programming course catalog created.");
        };
    }

    private Course createCourse(String name,
                                String instructor,
                                int price,
                                String category,
                                String level,
                                int durationHours,
                                String description,
                                String imageLink,
                                String videoLink) {
        Course course = new Course();
        course.setCourse_name(name);
        course.setInstructor(instructor);
        course.setPrice(price);
        course.setCategory(category);
        course.setLevel(level);
        course.setDurationHours(durationHours);
        course.setDescription(description);
        course.setP_link(imageLink);
        course.setY_link(videoLink);
        return course;
    }

    private void backfillCourseMetadata(CourseRepository courseRepository) {
        List<Course> courses = courseRepository.findAll();
        boolean changed = false;

        for (Course course : courses) {
            String name = course.getCourse_name() == null ? "" : course.getCourse_name().toLowerCase();

            if (applyVietnameseCourseCopy(course, name)) {
                changed = true;
                name = course.getCourse_name() == null ? "" : course.getCourse_name().toLowerCase();
            }

            if (course.getCategory() == null || course.getCategory().isBlank()) {
                if (name.contains("react")) course.setCategory("Frontend");
                else if (name.contains("spring") || name.contains("java")) course.setCategory("Backend");
                else if (name.contains("sql")) course.setCategory("Database");
                else if (name.contains("python")) course.setCategory("Data");
                else if (name.contains("devops") || name.contains("docker")) course.setCategory("DevOps");
                else course.setCategory("Programming");
                changed = true;
            }

            if (course.getLevel() == null || course.getLevel().isBlank()) {
                if (name.contains("co ban") || name.contains("nguoi moi")) course.setLevel("Beginner");
                else if (name.contains("rest api") || name.contains("devops")) course.setLevel("Intermediate");
                else course.setLevel("Beginner");
                changed = true;
            }

            if (course.getDurationHours() == null || course.getDurationHours() <= 0) {
                course.setDurationHours(suggestDurationHours(name));
                changed = true;
            }
        }

        if (changed) {
            courseRepository.saveAll(courses);
            log.info("Course metadata backfilled for existing catalog.");
        }
    }

    private boolean applyVietnameseCourseCopy(Course course, String currentName) {
        CourseProfile profile = null;

        if (currentName.contains("react")) {
            profile = new CourseProfile(
                    "ReactJS từ cơ bản đến dự án thực tế",
                    "Học React theo lộ trình thực chiến: component, props, state, hooks, routing, API và xây dựng dashboard quản lý khóa học.",
                    "https://www.youtube.com/watch?v=x0fSBAgBrOQ"
            );
        } else if (currentName.contains("spring")) {
            profile = new CourseProfile(
                    "Spring Boot REST API và JWT",
                    "Xây dựng backend Java với Spring Boot, Spring Data JPA, Spring Security, JWT, Swagger và kết nối PostgreSQL/Supabase.",
                    "https://www.youtube.com/watch?v=MiHVcukru3U"
            );
        } else if (currentName.contains("java")) {
            profile = new CourseProfile(
                    "Java Core cho người mới bắt đầu",
                    "Nắm vững Java Core, OOP, collection, exception, file IO và các nền tảng cần có trước khi học Spring Boot.",
                    "https://www.youtube.com/watch?v=3gtOAlcovoQ"
            );
        } else if (currentName.contains("sql")) {
            profile = new CourseProfile(
                    "SQL và thiết kế cơ sở dữ liệu",
                    "Học SQL, ERD, chuẩn hóa dữ liệu, truy vấn nâng cao và thiết kế database cho hệ thống quản lý khóa học.",
                    "https://www.youtube.com/watch?v=2fanjSYVElY"
            );
        } else if (currentName.contains("python")) {
            profile = new CourseProfile(
                    "Python nền tảng và ứng dụng",
                    "Làm quen Python, cấu trúc dữ liệu, xử lý file, module và viết các ứng dụng nhỏ phục vụ học tập lập trình.",
                    "https://www.youtube.com/watch?v=NZj6LI5a9vc"
            );
        } else if (currentName.contains("devops") || currentName.contains("docker")) {
            profile = new CourseProfile(
                    "DevOps căn bản với Docker và CI/CD",
                    "Tìm hiểu Docker, container, biến môi trường, pipeline CI/CD và triển khai ứng dụng fullstack lên cloud.",
                    "https://www.youtube.com/watch?v=P1IpryhFeLM"
            );
        }

        if (profile == null) {
            return false;
        }

        boolean changed = false;
        if (!profile.name().equals(course.getCourse_name())) {
            course.setCourse_name(profile.name());
            changed = true;
        }
        if (!profile.description().equals(course.getDescription())) {
            course.setDescription(profile.description());
            changed = true;
        }
        if (course.getY_link() == null || course.getY_link().contains("bMknfKXIFA8")
                || course.getY_link().contains("9SGDpanrc8U")
                || course.getY_link().contains("eIrMbAQSU34")
                || course.getY_link().contains("HXV3zeQKqGY")
                || course.getY_link().contains("rfscVS0vtbw")
                || course.getY_link().contains("fqMOX6JJhGo")) {
            course.setY_link(profile.videoUrl());
            changed = true;
        }
        return changed;
    }

    private void seedLessonsForCatalog(List<Course> courses,
                                       CourseLessonRepository lessonRepository,
                                       CourseRepository courseRepository) {
        boolean courseChanged = false;

        for (Course course : courses) {
            if (course.getCourse_id() == null || lessonRepository.countByCourseId(course.getCourse_id()) > 0) {
                continue;
            }

            List<LessonSeed> lessons = lessonsForCourse(course);
            if (lessons.isEmpty()) {
                continue;
            }

            List<CourseLesson> entities = lessons.stream()
                    .map(seed -> createLesson(course, seed))
                    .toList();
            lessonRepository.saveAll(entities);

            LessonSeed firstLesson = lessons.get(0);
            course.setY_link(firstLesson.videoUrl());
            courseChanged = true;
        }

        if (courseChanged) {
            courseRepository.saveAll(courses);
        }
    }

    private List<LessonSeed> lessonsForCourse(Course course) {
        String name = course.getCourse_name() == null ? "" : course.getCourse_name().toLowerCase();
        String category = course.getCategory() == null ? "" : course.getCategory().toLowerCase();

        if (name.contains("react") || category.contains("frontend")) {
            return List.of(
                    lesson(1, "ReactJS là gì và vì sao nên học", "Tổng quan ReactJS, SPA/MPA và cách React hỗ trợ xây dựng UI hiện đại.", "https://www.youtube.com/watch?v=x0fSBAgBrOQ", "F8 Official", 18),
                    lesson(2, "State và two-way binding với React Hooks", "Thực hành quản lý dữ liệu form, state và ràng buộc hai chiều trong React.", "https://www.youtube.com/watch?v=CVaEWBFpxhc", "F8 Official", 16),
                    lesson(3, "Todolist với useState", "Xây dựng tính năng nhỏ để hiểu cách tách component và cập nhật state.", "https://www.youtube.com/watch?v=bpVFSiNsFHY", "F8 Official", 20),
                    lesson(4, "React Router V6", "Thiết kế điều hướng nhiều trang cho SPA bằng react-router-dom.", "https://www.youtube.com/watch?v=5jYlY4y5Dfs", "F8 Official", 22),
                    lesson(5, "Gọi API bằng Axios", "Kết nối frontend với backend REST API và xử lý dữ liệu trả về.", "https://www.youtube.com/watch?v=_zeOSnVHI2I", "F8 Official", 18)
            );
        }

        if (name.contains("spring")) {
            return List.of(
                    lesson(1, "Hello World với Spring Boot 3", "Tạo project đầu tiên, hiểu cấu trúc cơ bản và cách chạy ứng dụng.", "https://www.youtube.com/watch?v=MiHVcukru3U", "Devteria", 22),
                    lesson(2, "Lộ trình Java Spring Boot", "Nắm bức tranh tổng quan backend Java và các module cần học.", "https://www.youtube.com/watch?v=H2gquNz1bvs", "Devteria", 18),
                    lesson(3, "Lombok và MapStruct", "Giảm boilerplate code, chuẩn hóa DTO mapper trong backend.", "https://www.youtube.com/watch?v=3AIjB50cRzU", "Devteria", 24),
                    lesson(4, "BCrypt cho mật khẩu an toàn", "Mã hóa mật khẩu và kiểm tra password matching trong hệ thống xác thực.", "https://www.youtube.com/watch?v=i519oXXPtgQ", "Devteria", 21),
                    lesson(5, "JWT trong Spring Boot", "Tạo, ký và xác thực JSON Web Token cho API phân quyền.", "https://www.youtube.com/watch?v=1XC5WPQkXek", "Devteria", 25)
            );
        }

        if (name.contains("java")) {
            return List.of(
                    lesson(1, "Giới thiệu Java", "Tổng quan Java, JVM và lý do Java phù hợp cho backend.", "https://www.youtube.com/watch?v=3gtOAlcovoQ", "K team", 14),
                    lesson(2, "Cài đặt môi trường Java", "Chuẩn bị JDK, IDE và môi trường chạy chương trình Java.", "https://www.youtube.com/watch?v=KjMRn1YQcLc", "K team", 16),
                    lesson(3, "Chương trình Java đầu tiên", "Viết, biên dịch và chạy chương trình Java đầu tiên.", "https://www.youtube.com/watch?v=jIQmebw9VaA", "K team", 18),
                    lesson(4, "Vòng lặp While trong Java", "Thực hành điều khiển luồng và vòng lặp cơ bản.", "https://www.youtube.com/watch?v=tDfQ33fmmvs", "K team", 17)
            );
        }

        if (name.contains("sql") || category.contains("database")) {
            return List.of(
                    lesson(1, "Giới thiệu SQL và SQL Server", "Làm quen hệ quản trị cơ sở dữ liệu và vai trò của SQL.", "https://www.youtube.com/watch?v=2fanjSYVElY", "K team", 15),
                    lesson(2, "Tạo database", "Tạo cơ sở dữ liệu, bảng và chuẩn bị dữ liệu thực hành.", "https://www.youtube.com/watch?v=XUIm5VQlpJM", "K team", 18),
                    lesson(3, "Insert, Delete, Update table", "Thực hành các thao tác thay đổi dữ liệu trong bảng.", "https://www.youtube.com/watch?v=viVwygluDDY", "K team", 20),
                    lesson(4, "Tìm kiếm gần đúng", "Sử dụng LIKE và các điều kiện lọc dữ liệu thường gặp.", "https://www.youtube.com/watch?v=mrBW6g7oG3A", "K team", 16),
                    lesson(5, "Group By và Having", "Tổng hợp dữ liệu phục vụ dashboard và báo cáo thống kê.", "https://www.youtube.com/watch?v=AlFTd0HOIyY", "K team", 19)
            );
        }

        if (name.contains("python") || category.contains("data")) {
            return List.of(
                    lesson(1, "Giới thiệu ngôn ngữ Python", "Tổng quan Python và các ứng dụng phổ biến trong học tập, automation, data.", "https://www.youtube.com/watch?v=NZj6LI5a9vc", "K team", 14),
                    lesson(2, "Cài đặt môi trường Python", "Cài Python, IDE và chuẩn bị thư mục code.", "https://www.youtube.com/watch?v=jf-q_dG8WzI", "K team", 15),
                    lesson(3, "Iteration trong Python", "Hiểu iteration và cách duyệt dữ liệu trong Python.", "https://www.youtube.com/watch?v=GSUwh958k_A", "K team", 18),
                    lesson(4, "While Loop trong Python", "Thực hành vòng lặp while và kiểm soát điều kiện dừng.", "https://www.youtube.com/watch?v=wq7Th3nXyCQ", "K team", 17),
                    lesson(5, "Dictionary trong Python", "Làm việc với dữ liệu key-value, một cấu trúc rất hay dùng.", "https://www.youtube.com/watch?v=xw3cb_4mh9s", "TITV", 16)
            );
        }

        if (name.contains("devops") || name.contains("docker") || category.contains("devops")) {
            return List.of(
                    lesson(1, "Giới thiệu Docker", "Hiểu container, image và lý do Docker hữu ích khi triển khai ứng dụng.", "https://www.youtube.com/watch?v=P1IpryhFeLM", "Học Lập Trình Online", 22),
                    lesson(2, "Docker architecture và concepts", "Nắm kiến trúc Docker client/server, registry, image và container.", "https://www.youtube.com/watch?v=O00nCyGKSQM", "Học Lập Trình Online", 24),
                    lesson(3, "Tự học Docker siêu tốc", "Ôn nhanh Docker bằng ví dụ thực hành và code mẫu.", "https://www.youtube.com/watch?v=1k8pox8mkxc", "Phạm Huy Hoàng", 11),
                    lesson(4, "GitHub Actions CI/CD", "Tạo pipeline CI/CD căn bản với GitHub Actions.", "https://www.youtube.com/watch?v=ZKaDy0mNHGs", "HoleTex", 18)
            );
        }

        return List.of();
    }

    private CourseLesson createLesson(Course course, LessonSeed seed) {
        CourseLesson lesson = new CourseLesson();
        lesson.setCourse(course);
        lesson.setTitle(seed.title());
        lesson.setDescription(seed.description());
        lesson.setVideoUrl(seed.videoUrl());
        lesson.setSourceName(seed.sourceName());
        lesson.setDurationMinutes(seed.durationMinutes());
        lesson.setLessonOrder(seed.order());
        return lesson;
    }

    private void seedQuestionsForCatalog(List<Course> courses, QuestionRepository questionRepository) {
        int createdCount = 0;

        for (Course course : courses) {
            if (course.getCourse_id() == null || !questionRepository.findByCourse(course).isEmpty()) {
                continue;
            }

            List<QuestionSeed> questions = questionsForCourse(course);
            if (questions.isEmpty()) {
                continue;
            }

            List<Questions> entities = questions.stream()
                    .map(seed -> createQuestion(course, seed))
                    .toList();
            questionRepository.saveAll(entities);
            createdCount += entities.size();
        }

        if (createdCount > 0) {
            log.info("Seeded {} quiz questions for course catalog.", createdCount);
        }
    }

    private List<QuestionSeed> questionsForCourse(Course course) {
        String name = course.getCourse_name() == null ? "" : course.getCourse_name().toLowerCase();
        String category = course.getCategory() == null ? "" : course.getCategory().toLowerCase();

        if (name.contains("react") || category.contains("frontend")) {
            return List.of(
                    question("ReactJS chủ yếu được dùng để làm gì?", "Xây dựng giao diện người dùng", "Quản trị database", "Cấu hình hệ điều hành", "Thiết kế mạng máy tính", "Xây dựng giao diện người dùng"),
                    question("Hook nào thường dùng để quản lý state trong function component?", "useState", "useRouter", "useTable", "useQueryOnly", "useState"),
                    question("React Router giúp ứng dụng React xử lý phần nào?", "Điều hướng giữa các route/trang", "Mã hóa mật khẩu", "Tạo database schema", "Biên dịch Java bytecode", "Điều hướng giữa các route/trang"),
                    question("Props trong React được dùng để làm gì?", "Truyền dữ liệu từ component cha xuống component con", "Lưu dữ liệu trực tiếp vào PostgreSQL", "Chạy câu lệnh SQL", "Khởi động server Spring Boot", "Truyền dữ liệu từ component cha xuống component con"),
                    question("Axios thường được dùng trong frontend để làm gì?", "Gọi HTTP API", "Tạo Docker image", "Chạy migration database", "Ký JWT token", "Gọi HTTP API")
            );
        }

        if (name.contains("spring")) {
            return List.of(
                    question("Spring Boot giúp lập trình viên Java làm gì?", "Xây dựng ứng dụng backend nhanh với cấu hình tối giản", "Thiết kế ảnh vector", "Viết CSS tự động", "Quản lý thiết bị phần cứng", "Xây dựng ứng dụng backend nhanh với cấu hình tối giản"),
                    question("Annotation nào thường dùng để tạo REST controller trong Spring Boot?", "@RestController", "@EntityOnly", "@ReactComponent", "@DatabaseTableOnly", "@RestController"),
                    question("BCrypt thường được dùng để làm gì?", "Mã hóa/hash mật khẩu", "Nén file video", "Tạo QR thanh toán", "Render component React", "Mã hóa/hash mật khẩu"),
                    question("JWT trong hệ thống xác thực thường chứa thông tin gì?", "Thông tin định danh và quyền của người dùng", "Mã nguồn frontend", "File PDF bài học", "Lịch sử commit Git", "Thông tin định danh và quyền của người dùng"),
                    question("Spring Data JPA hỗ trợ thao tác chính với thành phần nào?", "Database/entity", "Canvas 3D", "Ảnh thumbnail", "DNS server", "Database/entity")
            );
        }

        if (name.contains("java")) {
            return List.of(
                    question("JVM là viết tắt của cụm nào?", "Java Virtual Machine", "Java Visual Module", "Joint Version Manager", "Json View Model", "Java Virtual Machine"),
                    question("Đặc trưng nào là một nguyên lý chính của OOP?", "Đóng gói", "Nén ảnh", "Định tuyến DNS", "Tạo QR", "Đóng gói"),
                    question("Từ khóa nào dùng để tạo lớp kế thừa trong Java?", "extends", "inherits", "parent", "using", "extends"),
                    question("Collection trong Java thường dùng để làm gì?", "Lưu trữ và thao tác tập hợp dữ liệu", "Chạy container", "Tạo khóa SSH", "Biên tập video", "Lưu trữ và thao tác tập hợp dữ liệu"),
                    question("Exception trong Java biểu diễn điều gì?", "Lỗi hoặc tình huống bất thường khi chạy chương trình", "Một kiểu ảnh", "Một cổng mạng", "Một dependency frontend", "Lỗi hoặc tình huống bất thường khi chạy chương trình")
            );
        }

        if (name.contains("sql") || category.contains("database")) {
            return List.of(
                    question("SQL được dùng chủ yếu để làm gì?", "Truy vấn và thao tác dữ liệu trong cơ sở dữ liệu quan hệ", "Thiết kế giao diện React", "Chạy Docker container", "Tạo JWT", "Truy vấn và thao tác dữ liệu trong cơ sở dữ liệu quan hệ"),
                    question("Khóa chính (primary key) có vai trò gì?", "Định danh duy nhất mỗi bản ghi trong bảng", "Lưu ảnh đại diện", "Tự động gửi email", "Biên dịch source code", "Định danh duy nhất mỗi bản ghi trong bảng"),
                    question("Câu lệnh SELECT dùng để làm gì?", "Lấy dữ liệu từ bảng", "Xóa database server", "Tạo component UI", "Mã hóa password", "Lấy dữ liệu từ bảng"),
                    question("GROUP BY thường dùng khi nào?", "Khi cần nhóm dữ liệu để tính toán/tổng hợp", "Khi cần upload video", "Khi cần tạo route frontend", "Khi cần đăng nhập Google", "Khi cần nhóm dữ liệu để tính toán/tổng hợp"),
                    question("Quan hệ một-nhiều trong database nghĩa là gì?", "Một bản ghi bảng A liên kết với nhiều bản ghi bảng B", "Mỗi bảng chỉ có một dòng", "Không bảng nào được liên kết", "Chỉ dùng được với file PDF", "Một bản ghi bảng A liên kết với nhiều bản ghi bảng B")
            );
        }

        if (name.contains("python") || category.contains("data")) {
            return List.of(
                    question("Python nổi bật với ưu điểm nào?", "Cú pháp dễ đọc và dễ học", "Chỉ chạy được trên một hệ điều hành", "Không hỗ trợ thư viện", "Chỉ dùng để viết CSS", "Cú pháp dễ đọc và dễ học"),
                    question("Dictionary trong Python lưu dữ liệu theo dạng nào?", "Key-value", "Hàng đợi video", "Bytecode Java", "CSS selector", "Key-value"),
                    question("Vòng lặp while chạy khi nào?", "Khi điều kiện còn đúng", "Chỉ chạy đúng một lần", "Khi không có điều kiện", "Chỉ chạy trong SQL", "Khi điều kiện còn đúng"),
                    question("Module trong Python giúp làm gì?", "Tổ chức và tái sử dụng code", "Tạo table PostgreSQL tự động", "Ký giao dịch ngân hàng", "Render JSX", "Tổ chức và tái sử dụng code"),
                    question("Kiểu list trong Python thường dùng để làm gì?", "Lưu danh sách phần tử có thứ tự", "Lưu duy nhất một ký tự", "Tạo Docker network", "Xác thực JWT", "Lưu danh sách phần tử có thứ tự")
            );
        }

        if (name.contains("devops") || name.contains("docker") || category.contains("devops")) {
            return List.of(
                    question("Docker container dùng để làm gì?", "Đóng gói và chạy ứng dụng trong môi trường cô lập", "Thiết kế logo", "Viết truy vấn SQL", "Tạo form React", "Đóng gói và chạy ứng dụng trong môi trường cô lập"),
                    question("Docker image là gì?", "Bản mẫu để tạo container", "Một loại database", "Một dạng JWT", "Một component frontend", "Bản mẫu để tạo container"),
                    question("CI/CD giúp nhóm phát triển điều gì?", "Tự động kiểm thử, build và triển khai phần mềm", "Tăng dung lượng RAM thủ công", "Vẽ sơ đồ UI", "Tạo mật khẩu ngẫu nhiên cho user", "Tự động kiểm thử, build và triển khai phần mềm"),
                    question("GitHub Actions thường được dùng để làm gì?", "Tạo pipeline tự động trong repository GitHub", "Chỉnh sửa video YouTube", "Quản lý role trong database", "Tạo bảng HTML", "Tạo pipeline tự động trong repository GitHub"),
                    question("Biến môi trường trong deploy thường dùng để lưu gì?", "Cấu hình như database URL, secret key, API key", "Nội dung bài thơ", "Kích thước màn hình người dùng", "Màu nền cố định", "Cấu hình như database URL, secret key, API key")
            );
        }

        return List.of();
    }

    private Questions createQuestion(Course course, QuestionSeed seed) {
        Questions question = new Questions();
        question.setCourse(course);
        question.setQuestion(seed.question());
        question.setOption1(seed.option1());
        question.setOption2(seed.option2());
        question.setOption3(seed.option3());
        question.setOption4(seed.option4());
        question.setAnswer(seed.answer());
        return question;
    }

    private QuestionSeed question(String question,
                                  String option1,
                                  String option2,
                                  String option3,
                                  String option4,
                                  String answer) {
        return new QuestionSeed(question, option1, option2, option3, option4, answer);
    }

    private LessonSeed lesson(int order,
                              String title,
                              String description,
                              String videoUrl,
                              String sourceName,
                              int durationMinutes) {
        return new LessonSeed(order, title, description, videoUrl, sourceName, durationMinutes);
    }

    private record LessonSeed(int order,
                              String title,
                              String description,
                              String videoUrl,
                              String sourceName,
                              int durationMinutes) {
    }

    private record QuestionSeed(String question,
                                String option1,
                                String option2,
                                String option3,
                                String option4,
                                String answer) {
    }

    private record CourseProfile(String name, String description, String videoUrl) {
    }

    private int suggestDurationHours(String name) {
        if (name.contains("spring")) return 22;
        if (name.contains("java")) return 20;
        if (name.contains("react")) return 18;
        if (name.contains("devops")) return 18;
        if (name.contains("python")) return 16;
        if (name.contains("sql")) return 14;
        return 12;
    }
}
