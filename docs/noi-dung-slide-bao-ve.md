# Nội dung slide - CodePath LMS



## Slide 1 - Giới thiệu đề tài

**Tên đề tài:** CodePath LMS - Hệ thống quản lý khóa học lập trình trực tuyến

**Nội dung slide:**

- Website hỗ trợ quản lý và học các khóa học lập trình trực tuyến.
- Admin có thể quản lý khóa học, bài học, câu hỏi quiz và theo dõi dữ liệu hệ thống.
- Học viên có thể xem khóa học, đăng ký học, học video, lưu tiến độ, làm quiz và nhận chứng chỉ.
- Hệ thống có thêm chatbot AI hỗ trợ học tập và chức năng quên mật khẩu qua email.

---

## Slide 2 - Lý do chọn đề tài

**Nội dung slide:**

- Nhu cầu học lập trình trực tuyến của sinh viên và người mới học rất phổ biến.
- Người học thường phải học rời rạc qua YouTube, tài liệu PDF, source code, bài tập riêng.
- Việc học bị khó theo dõi: không biết đã học tới đâu, bài nào đã hoàn thành, kết quả đánh giá ra sao.
- CodePath LMS gom khóa học, bài học, video, quiz, tiến độ và chứng chỉ vào một nền tảng thống nhất.

---

## Slide 3 - Mục tiêu sản phẩm

**Nội dung slide:**

- Xây dựng nền tảng học lập trình trực tuyến có thể sử dụng và demo thực tế.
- Áp dụng quy trình Agile/Scrum trong quản lý dự án.
- Quản lý backlog, sprint và tiến độ bằng Jira.
- Thiết kế database trên Supabase PostgreSQL.
- Phát triển frontend ReactJS và backend Spring Boot.
- Có testcase, tài liệu thiết kế và kịch bản demo.


---

## Slide 4 - Thành viên và phân công nhiệm vụ

> Ghi chú: phần tên thành viên có thể đổi lại theo tên thật của nhóm trước khi đưa vào slide.

| Thành viên | Vai trò chính | Nhiệm vụ đã phụ trách |
| --- | --- | --- |
| Thành viên 1 | PM/BA, Scrum support | Xác định phạm vi đề tài, viết Product Vision, chia user story, chuẩn bị nội dung báo cáo và slide |
| Thành viên 2 | Backend Developer | Thiết kế API Spring Boot, JWT, phân quyền, quản lý khóa học, bài học, quiz, assessment, chứng chỉ |
| Thành viên 3 | Frontend Developer | Xây dựng giao diện ReactJS, trang khóa học, trang học tập, dashboard admin, quiz, profile, certificate |
| Thành viên 4 | QA/Tester, Database/Docs | Thiết kế schema Supabase, viết testcase, kiểm thử chức năng, cập nhật tài liệu SDD, test report |



---

## Slide 5 - Công nghệ sử dụng

**Nội dung slide:**

- **Frontend:** ReactJS, TailwindCSS, Ant Design, React Router.
- **Backend:** Spring Boot, Spring Security, JWT, JPA/Hibernate.
- **Database:** Supabase PostgreSQL.
- **AI:** Groq API cho chatbot hỗ trợ học tập.
- **Email:** Gmail SMTP cho quên mật khẩu và xác thực.
- **PDF:** html2canvas và jsPDF để xuất chứng chỉ.
- **Quản lý dự án:** Jira, Confluence/Docs, Git/GitHub.

---

## Slide 6 - Kiến trúc tổng quan

**Nội dung slide:**

- Người dùng thao tác trên frontend ReactJS.
- Frontend gọi REST API đến backend Spring Boot.
- Backend xử lý nghiệp vụ, xác thực JWT, phân quyền Admin/User.
- Backend kết nối Supabase PostgreSQL để lưu dữ liệu.
- Một số dịch vụ ngoài:
  - Groq API cho chatbot AI.
  - Gmail SMTP cho email reset password.
  - SePay/VietQR cho luồng thanh toán demo.


---

## Slide 7 - Các chức năng đã hoàn thành

**Nội dung slide:**

- Đăng ký, đăng nhập, xác thực JWT.
- Phân quyền Admin/User.
- Đăng nhập Google OAuth.
- Quên mật khẩu và đặt lại mật khẩu qua email.
- Trang chủ, danh sách khóa học, bộ lọc khóa học.
- Admin quản lý khóa học và bài học.
- Học viên đăng ký khóa học và học video.
- Lưu tiến độ học từng bài và tổng tiến độ khóa học.
- Làm quiz, tính điểm và lưu kết quả assessment.
- Tạo và tải chứng chỉ PDF.
- Chatbot AI hỗ trợ học tập.
- Dashboard quản trị và hồ sơ người dùng.

---

## Slide 8 - Quy trình Agile/Scrum và Jira

**Nội dung slide:**

- Nhóm sử dụng Jira theo mô hình Scrum.
- Có Product Backlog, Sprint, Board và các trạng thái To Do/In Progress/In Review/Done.
- Các epic chính:
  - Xác thực và phân quyền.
  - Quản lý khóa học.
  - Học tập và lưu tiến độ.
  - Quiz và chứng chỉ.
  - Chatbot AI.
  - Tài liệu, kiểm thử, báo cáo.
- Mỗi work item có mô tả, mục tiêu, hiện trạng và kết quả thực hiện.


---

## Slide 9 - Tiến độ hiện tại

**Nội dung slide:**

**Đã hoàn thành:**

- Authentication, phân quyền, Google login.
- Quản lý khóa học và bài học.
- Học video, lưu tiến độ, dashboard học viên.
- Quiz cuối khóa/cuối chương, lưu điểm assessment.
- Chứng chỉ PDF và hiệu ứng chúc mừng.
- Chatbot AI hỗ trợ học tập.
- Quên mật khẩu qua email SMTP.
- Testcase report, schema database, SDD và tài liệu Jira.

**Đang/ cần hoàn thiện thêm nếu có thời gian:**

- Hoàn thiện thêm dữ liệu demo.
- Bổ sung một số báo cáo thống kê nâng cao.


## Slide 10 - Database và thiết kế dữ liệu

**Nội dung slide:**

- Database dùng Supabase PostgreSQL.
- Các bảng chính:
  - `users`: thông tin tài khoản và role.
  - `course`: thông tin khóa học.
  - `course_lessons`: bài học trong khóa.
  - `learning`: khóa học user đã đăng ký.
  - `lesson_progress`: tiến độ từng bài học.
  - `questions`: câu hỏi quiz.
  - `assessment`: kết quả làm bài quiz.
  - `password_reset_tokens`: token đặt lại mật khẩu.
  - `discussion`: bình luận/thảo luận.
- Entity backend được ánh xạ bằng JPA/Hibernate.


---

## Slide 12 - Kiểm thử

**Nội dung slide:**

- Nhóm có file testcase report cho các chức năng chính.
- Các nhóm test chính:
  - Đăng ký/đăng nhập.
  - Phân quyền Admin/User.
  - CRUD khóa học.
  - Tìm kiếm/lọc khóa học.
  - Đăng ký khóa học.
  - Học video và lưu tiến độ.
  - Quiz và lưu kết quả.
  - Dashboard admin.
  - Kết nối Supabase.
  - Git/GitHub.
- Kết quả hiện tại: các chức năng chính đã test thủ công và sửa lỗi phát sinh trong quá trình demo.


## Slide 13 - Kết quả đạt được

**Nội dung slide:**

- Có sản phẩm web chạy được, có frontend, backend và database thật.
- Có quản lý dự án bằng Jira/Scrum.
- Có tài liệu: SDD, schema, testcase report, kế hoạch Jira/Scrum.
- Có các chức năng cốt lõi của LMS:
  - Quản lý khóa học.
  - Học video.
  - Lưu tiến độ.
  - Quiz.
  - Chứng chỉ.
  - Chatbot AI.


---

## Slide 15 - Hướng phát triển tiếp theo

**Nội dung slide:**

- Làm rõ vai trò Instructor riêng với Admin.
- Bổ sung thanh toán hoàn chỉnh hơn nếu triển khai thương mại.
- Bổ sung thống kê học tập nâng cao.
- Lưu lịch sử chatbot AI và gợi ý bài học theo tiến độ.
- Hoàn thiện giao diện responsive và trải nghiệm mobile.


---

## Slide 16 - Kết luận

**Nội dung slide:**

- CodePath LMS là sản phẩm demo hoàn chỉnh theo hướng quản lý khóa học lập trình trực tuyến.
- Dự án giúp nhóm thực hành đầy đủ:
  - Phân tích yêu cầu.
  - Thiết kế hệ thống.
  - Quản lý backlog/sprint.
  - Phát triển frontend/backend.
  - Kết nối database.
  - Kiểm thử và sửa lỗi.
- Sản phẩm có thể tiếp tục mở rộng thành nền tảng học lập trình thực tế.
