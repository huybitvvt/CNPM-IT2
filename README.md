# CodePath LMS - He thong quan ly khoa hoc lap trinh truc tuyen

CodePath LMS la website quan ly va hoc cac khoa hoc lap trinh truc tuyen. Du an duoc phat trien dua tren source LMS ma nguon mo, sau do tuy bien lai theo de tai bai tap lon mon Cong nghe phan mem: giao dien tieng Viet, nghiep vu khoa hoc lap trinh, phan quyen, dashboard, quiz, tien do hoc tap va cau hinh database Supabase PostgreSQL.

## Muc tieu de tai

- Xay dung nen tang hoc lap trinh truc tuyen co tai khoan Admin va User.
- Cho phep Admin quan ly khoa hoc, nguoi dung va cau hoi danh gia.
- Cho phep User dang ky khoa hoc, xem video bai hoc, theo doi tien do va lam quiz.
- Ho tro chung chi hoan thanh sau khi dat yeu cau danh gia.
- Ap dung quy trinh phat trien phan mem: SRS, SDD, testcase, Agile/Scrum, Git/GitHub.

## Cong nghe su dung

### Frontend

- React 18.
- React Router.
- Tailwind CSS.
- Ant Design.
- Axios.
- React Player.

### Backend

- Spring Boot 3.
- Spring Security.
- JWT Authentication.
- Spring Data JPA.
- Swagger/OpenAPI.
- Maven.

### Database

- Supabase PostgreSQL.
- Hibernate auto migration qua `DDL_AUTO=update`.
- Seed du lieu khoa hoc lap trinh mau khi database trong.

## Chuc nang chinh

### Nguoi dung

- Dang ky tai khoan.
- Dang nhap bang email va mat khau.
- Xem danh sach khoa hoc lap trinh.
- Tim kiem, loc va sap xep khoa hoc.
- Loc khoa hoc theo danh muc va cap do.
- Dang ky khoa hoc.
- Xem video khoa hoc.
- Theo doi tien do hoc.
- Lam quiz sau khi hoan thanh khoa hoc.
- Xem ket qua hoc tap va chung chi.

### Admin

- Dang nhap bang tai khoan quan tri.
- Xem dashboard thong ke nguoi dung, khoa hoc va luot dang ky.
- Them, sua, xoa khoa hoc.
- Quan ly cau hoi kiem tra cho tung khoa hoc.
- Quan ly danh sach nguoi dung.

## Tai khoan admin mac dinh

Backend tu tao admin neu database chua co tai khoan quan tri:

```text
Email: admin@gmail.com
Password: admin123
```

Co the doi bang bien moi truong:

```powershell
$env:ADMIN_EMAIL="admin@codepath.vn"
$env:ADMIN_PASSWORD="your-password"
```

## Cau truc thu muc

```text
Learning-Management-System/
├─ backend/                  # Spring Boot REST API
├─ frontend/                 # React application
├─ docs/                     # Huong dan cau hinh Supabase
├─ README.md
└─ .gitignore
```

## Chay backend

Yeu cau:

- Java 17 tro len.
- Maven wrapper da co san trong thu muc backend.
- Supabase project hoac PostgreSQL local.

Cau hinh Supabase:

```powershell
$env:DB_URL="jdbc:postgresql://<supabase-host>:5432/postgres?sslmode=require"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="<supabase-database-password>"
$env:DDL_AUTO="update"
$env:JWT_SECRET="change-this-secret-to-a-long-random-string"
```

Chay backend:

```powershell
cd E:\cnpm\Learning-Management-System\backend
$env:JAVA_HOME="E:\Apache NetBeans\jdk"
$env:Path="$env:JAVA_HOME\bin;$env:Path"
.\mvnw.cmd spring-boot:run
```

Swagger API:

```text
http://localhost:8080/swagger-ui/index.html
```

## Chay frontend

```powershell
cd E:\cnpm\Learning-Management-System\frontend
npm.cmd install --cache .\.npm-cache
npm.cmd start --cache .\.npm-cache
```

Mo trinh duyet:

```text
http://localhost:3000
```

Neu backend chay o URL khac, tao file `.env` trong thu muc `frontend`:

```text
REACT_APP_API_BASE_URL=http://localhost:8080
```

## Kiem tra build

Backend:

```powershell
cd E:\cnpm\Learning-Management-System\backend
$env:JAVA_HOME="E:\Apache NetBeans\jdk"
$env:Path="$env:JAVA_HOME\bin;$env:Path"
.\mvnw.cmd --no-transfer-progress -DskipTests compile
```

Frontend:

```powershell
cd E:\cnpm\Learning-Management-System\frontend
$env:CI="false"
npm.cmd run build --cache .\.npm-cache
```

## Git/GitHub workflow de xuat

- `main`: nhanh on dinh de demo/nop bai.
- `feature/auth`: dang nhap, dang ky, phan quyen.
- `feature/course-management`: quan ly khoa hoc.
- `feature/learning-progress`: dang ky hoc va tien do.
- `feature/quiz-certificate`: quiz va chung chi.
- `feature/ui-vietnamese`: Viet hoa giao dien va cai thien trai nghiem.

Quy trinh:

1. Tao issue hoac task tren Jira.
2. Tao branch theo chuc nang.
3. Commit theo tung phan nho.
4. Tao pull request tren GitHub.
5. Review va merge vao `main`.

## Tai lieu bai tap lon

Bo tai lieu de tai nam o thu muc ngoai repo:

```text
E:\cnpm\docs
```

Bao gom:

- Project Vision.
- SRS.
- SDD.
- Testcases Report.
- Jira/Scrum Plan.
- Supabase schema tham khao.
