# Bao cao tien do du an CodePath LMS

## 1. Thong tin chung

**Ten de tai:** CodePath LMS - He thong quan ly khoa hoc lap trinh truc tuyen

**Mo ta ngan:**  
CodePath LMS la ung dung web ho tro quan ly va hoc cac khoa hoc lap trinh truc tuyen. He thong cho phep Admin quan ly khoa hoc, bai hoc, video, tai lieu; User co the dang ky khoa hoc, xem bai hoc, theo doi tien do hoc tap, su dung chatbot AI de hoi dap va dat lai mat khau qua email khi quen mat khau.

**Cong nghe su dung:**

- Frontend: ReactJS
- Backend: Spring Boot
- Database: Supabase PostgreSQL
- Xac thuc: JWT, BCrypt
- AI: Groq API
- Email: Gmail SMTP
- Quan ly du an: Jira, Confluence
- Quan ly source code: Git, GitHub

## 2. Ly do chon de tai

Nhom chon de tai he thong quan ly khoa hoc lap trinh vi nhu cau hoc lap trinh truc tuyen cua sinh vien rat pho bien. Tuy nhien, nguoi hoc thuong phai hoc tren nhieu nen tang khac nhau nhu YouTube, tai lieu PDF, source code va cac bai tap rieng le. Dieu nay lam cho qua trinh hoc bi roi rac, kho theo doi tien do va kho danh gia ket qua.

Vi vay, CodePath LMS duoc xay dung de gom cac noi dung hoc lap trinh vao mot he thong duy nhat, co khoa hoc, bai hoc, video, tai lieu, tien do hoc tap va cac chuc nang ho tro nhu chatbot AI va quen mat khau qua email.

## 3. Muc tieu cua san pham

**Muc tieu chinh:**

- Xay dung mot nen tang hoc lap trinh truc tuyen co tinh ung dung thuc te.
- Ap dung mo hinh Agile/Scrum trong quan ly va phat trien phan mem.
- Su dung Jira de quan ly backlog, sprint, task va tien do.
- Su dung Confluence de luu Product Vision va tai lieu du an.
- Phat trien duoc ban demo co the trinh bay va kiem thu truc tiep.

**Doi tuong su dung:**

- Admin: quan ly khoa hoc, bai hoc, user va thong ke.
- User/Hoc vien: dang ky khoa hoc, hoc bai, luu tien do, hoi chatbot AI.
- Instructor: co the mo rong de quan ly noi dung khoa hoc.

## 4. Ket qua da hoan thanh

### 4.1. Ve quan ly du an

Nhom da tao project Jira ten **CodePath LMS** theo mo hinh Scrum. Trong Jira, nhom da tao Backlog, Sprint, Board va cac work item chinh cho du an.

**Cac work item da tao tren Jira:**

- CPLMS-1: Xac thuc va phan quyen nguoi dung
- CPLMS-2: Quan ly khoa hoc lap trinh
- CPLMS-3: Hoc tap truc tuyen va luu tien do
- CPLMS-4: Quiz va danh gia ket qua
- CPLMS-7: Tai lieu, kiem thu va bao cao
- CPLMS-8: Dashboard quan tri
- CPLMS-9: Chatbot AI ho tro hoc tap
- CPLMS-10: Quen mat khau va dat lai mat khau qua email SMTP

Nhom cung da viet Product Vision tren Confluence/Docs va chuan bi cac tai lieu lien quan nhu SDD, Supabase schema, testcase report va ke hoach Jira/Scrum.

### 4.2. Ve phan tich va thiet ke

Nhom da xac dinh duoc tam nhin san pham, doi tuong nguoi dung, cac chuc nang chinh va luong nghiep vu co ban.

**Tai lieu da co:**

- Product Vision ban demo
- Software Design Document
- Supabase database schema
- Jira/Scrum plan
- Testcases report
- Huong dan Jira cho tung feature moi

### 4.3. Ve phat trien san pham

Ban demo hien tai da phat trien duoc cac chuc nang nen tang:

- Dang ky tai khoan hoc vien
- Dang nhap va xac thuc bang JWT
- Phan quyen Admin/User
- Trang chu va danh sach khoa hoc lap trinh
- Quan ly khoa hoc trong trang Admin
- Quan ly bai hoc theo khoa hoc
- Bai hoc su dung video YouTube tieng Viet phu hop voi tung noi dung
- User dang ky khoa hoc
- Trang "Lop hoc cua toi"
- Luu tien do hoc theo tung bai
- Ho so nguoi dung
- Upload/cap nhat thong tin profile
- Chatbot AI ho tro hoc tap su dung Groq API
- Quen mat khau qua email SMTP voi reset link/token
- Ket noi database Supabase PostgreSQL that

## 5. Kien truc he thong

He thong duoc xay dung theo mo hinh client-server.

**Frontend ReactJS** dam nhan giao dien nguoi dung, cac trang khoa hoc, trang hoc tap, profile, admin dashboard va chatbot AI.

**Backend Spring Boot** xu ly nghiep vu, xac thuc JWT, phan quyen, quan ly khoa hoc, quan ly bai hoc, luu tien do hoc tap, gui email reset mat khau va goi Groq API cho chatbot.

**Supabase PostgreSQL** duoc dung lam database chinh, luu tru thong tin users, courses, course lessons, learning, lesson progress, questions, assessment va password reset tokens.

## 6. Tien do tren Sprint/Jira

**Sprint hien tai:** CPLMS Sprint 1

**Sprint Goal:**  
Hoan thanh nen tang xac thuc, quan ly khoa hoc, luu tien do hoc tap va cac tai lieu Product Vision cho ban demo CodePath LMS.

**Trang thai hien tai:**

- CPLMS-1: Da hoan thanh hoac dang o Done
- CPLMS-2: Dang phat trien/Testing
- CPLMS-3: Dang phat trien/Testing
- CPLMS-7: Dang cap nhat tai lieu
- CPLMS-9: Da tich hop chatbot AI, co the dua vao Testing/Done sau khi demo thanh cong
- CPLMS-10: Da code xong quen mat khau SMTP, dang Testing sau khi gui email thanh cong
- CPLMS-4 va CPLMS-8: De trong Backlog/Sprint sau neu chua lam hoan chinh

## 7. Phan chia vai tro nhom 4 thanh vien

Do nhom co 4 thanh vien, nhom phan chia vai tro theo cach gop role hop ly:

| Vai tro | Nhiem vu |
| --- | --- |
| PM/BA | Phan tich yeu cau, viet Product Vision, SRS/SDD, xac dinh pham vi |
| PO/Scrum Master | Quan ly backlog, lap sprint, uu tien cong viec, theo doi tien do |
| Dev/DevOps | Phat trien frontend/backend, ket noi Supabase, Git/GitHub, deploy/local demo |
| QA/Tester | Viet testcase, test chuc nang, ghi nhan loi, xac nhan feature hoan thanh |

Trong qua trinh lam, moi thanh vien khong chi lam dung vai tro cua minh ma con phai hieu cach cac vai tro khac hoat dong de phoi hop tot hon trong Scrum team.

## 8. Noi dung demo de thuyet trinh

Khi thuyet trinh, co the demo theo thu tu sau:

1. Mo Jira project **CodePath LMS**.
2. Gioi thieu Backlog va cac work item chinh.
3. Mo Sprint/Board de giai thich cac trang thai To Do, In Progress, Testing, Done.
4. Mo Confluence/Docs de gioi thieu Product Vision.
5. Mo web local tai `http://localhost:3000`.
6. Demo dang ky/dang nhap.
7. Demo danh sach khoa hoc va chi tiet khoa hoc.
8. Demo user dang ky khoa hoc va vao "Lop hoc cua toi".
9. Demo luu tien do hoc theo tung bai.
10. Demo chatbot AI ho tro nguoi hoc.
11. Demo quen mat khau: nhap email, nhan reset link qua Gmail, dat mat khau moi.

## 9. Noi dung noi khi thuyet trinh

**Mo dau:**

> Nhom em thuc hien de tai CodePath LMS, la he thong quan ly khoa hoc lap trinh truc tuyen. Muc tieu cua san pham la giup nguoi hoc lap trinh co mot nen tang hoc tap tap trung, co khoa hoc, bai hoc, video, tien do hoc tap va cac tinh nang ho tro nhu chatbot AI.

**Ve quy trinh:**

> Nhom em ap dung mo hinh Agile/Scrum trong qua trinh phat trien. Tren Jira, nhom da tao project CodePath LMS, tao backlog, sprint va chia cac chuc nang thanh cac work item. Moi chuc nang duoc gan trang thai theo qua trinh lam viec nhu To Do, In Progress, Testing va Done.

**Ve san pham:**

> Ve mat ky thuat, he thong gom ReactJS o frontend, Spring Boot o backend va Supabase PostgreSQL lam database. Backend dam nhan xac thuc JWT, phan quyen, xu ly nghiep vu va ket noi voi cac dich vu ben ngoai nhu Groq API va Gmail SMTP.

**Ve tien do:**

> Den thoi diem hien tai, nhom da hoan thanh cac chuc nang nen tang gom dang ky, dang nhap, phan quyen, quan ly khoa hoc, quan ly bai hoc, dang ky khoa hoc, luu tien do hoc tap, chatbot AI va quen mat khau qua email. Mot so chuc nang nang cao nhu quiz, dashboard thong ke va chung chi se duoc tiep tuc hoan thien trong sprint sau.

**Ket thuc:**

> Qua du an nay, nhom em khong chi xay dung mot san pham web co tinh ung dung ma con thuc hanh duoc quy trinh phat trien phan mem tu Product Vision, Jira/Scrum, thiet ke database, lap trinh, kiem thu den demo san pham.

## 10. Kho khan va cach xu ly

**Kho khan 1:** Chuyen source goc sang dung Supabase PostgreSQL.  
**Cach xu ly:** Cap nhat cau hinh database, dieu chinh entity va schema de phu hop voi PostgreSQL.

**Kho khan 2:** Giao dien ban dau chua phu hop voi de tai lap trinh truc tuyen.  
**Cach xu ly:** Viet hoa noi dung, thiet ke lai trang chu, trang khoa hoc, trang hoc tap va profile theo huong ro rang hon.

**Kho khan 3:** Luu tien do hoc theo tung bai hoc.  
**Cach xu ly:** Bo sung bang `lesson_progress`, API rieng va logic frontend de cap nhat tien do theo lesson.

**Kho khan 4:** Tich hop AI chatbot va bao ve API key.  
**Cach xu ly:** Khong goi Groq truc tiep tu frontend, ma goi qua backend Spring Boot de giu API key an toan.

**Kho khan 5:** Quen mat khau can gui email that.  
**Cach xu ly:** Cau hinh Gmail App Password, dung SMTP de gui reset link, luu token va han su dung trong database.

## 11. Ke hoach tiep theo

Trong giai doan tiep theo, nhom se tiep tuc:

- Hoan thien quiz cuoi chuong va tinh diem
- Hoan thien dashboard thong ke cho Admin
- Cap chung chi khi hoan thanh khoa hoc
- Luu lich su hoi thoai AI vao database
- Cai thien giao dien hoc bai va trai nghiem nguoi dung
- Viet them testcase report
- Cap nhat SRS/SDD day du hon
- Chuan bi slide va kich ban demo cho cuoi ky

## 12. Ket luan

CodePath LMS hien da co ban demo hoat dong voi cac chuc nang cot loi cua mot he thong quan ly khoa hoc lap trinh truc tuyen. Du an the hien duoc viec ap dung kien thuc Cong nghe phan mem vao thuc te, bao gom phan tich yeu cau, thiet ke he thong, quan ly du an bang Jira/Scrum, phat trien code, ket noi database, kiem thu va demo san pham.

