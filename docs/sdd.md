# Software Design Document

## Kien truc tong quan

He thong duoc thiet ke theo mo hinh client-server:

- Client: React web application.
- Server: Spring Boot REST API.
- Database: Supabase PostgreSQL.
- Authentication: Spring Security va JWT.

React gui request den Spring Boot thong qua REST API. Backend xu ly nghiep vu, kiem tra quyen truy cap, doc/ghi du lieu vao Supabase PostgreSQL va tra ve JSON cho frontend.

## Thanh phan frontend

- Trang chu gioi thieu he thong.
- Danh sach khoa hoc lap trinh.
- Chi tiet khoa hoc va video hoc tap.
- Trang dang nhap/dang ky.
- Trang khoa hoc da dang ky.
- Ho so nguoi dung va ket qua hoc tap.
- Trang admin dashboard.
- Trang quan ly khoa hoc va cau hoi quiz.

## Thanh phan backend

- AuthController: dang ky, dang nhap, dang xuat.
- CourseController: CRUD khoa hoc.
- LearningController: dang ky va xem khoa hoc da hoc.
- ProgressController: luu tien do hoc tap.
- QuestionController: quan ly cau hoi quiz.
- AssessmentController: lam quiz va luu diem.
- UserController: quan ly thong tin nguoi dung.

## Database chinh

- `users`: tai khoan, role, ho so nguoi dung.
- `password_reset_tokens`: token dat lai mat khau qua email SMTP.
- `course`: khoa hoc lap trinh, gom ten khoa hoc, giang vien, danh muc, cap do, thoi luong, hoc phi, mo ta, anh va video.
- `course_lessons`: danh sach bai hoc cua tung khoa hoc.
- `learning`: khoa hoc user da dang ky.
- `progress`: tien do hoc video.
- `lesson_progress`: tien do hoc theo tung bai hoc va trang thai hoan thanh.
- `questions`: cau hoi quiz.
- `assessment`: ket qua danh gia.
- `feedback`: phan hoi khoa hoc.
- `discussion`: thao luan trong khoa hoc.

## Quan ly ma nguon

Du an su dung Git de quan ly phien ban va GitHub de luu tru repository. Nhom co the chia branch theo chuc nang, tao pull request, review code va merge vao nhanh chinh khi hoan thanh.
