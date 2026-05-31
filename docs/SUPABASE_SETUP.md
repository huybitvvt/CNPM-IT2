# Huong dan cau hinh Supabase cho CodePath LMS

Ban dang o man hinh **Database > Tables** trong Supabase. Khi backend chua chay lan dau, khu vuc Tables co the trong. Sau khi Spring Boot ket noi thanh cong, Hibernate se tu tao cac bang can thiet va seed du lieu mau.

## 1. Lay connection string trong Supabase

Trong Supabase:

1. Vao project **Web quan ly khoa hoc lap trinh**.
2. Mo **Project Settings**.
3. Chon **Database**.
4. Tim phan **Connection string**.
5. Chon dang **URI** hoac **JDBC**.
6. Copy connection string va thay `[YOUR-PASSWORD]` bang database password cua project.

Dang JDBC nen co mau:

```text
jdbc:postgresql://<host>:5432/postgres?sslmode=require
```

Voi project hien tai cua ban, direct database host la:

```text
db.<your-supabase-project-ref>.supabase.co
```

Nen JDBC URL direct se la:

```text
jdbc:postgresql://db.<your-supabase-project-ref>.supabase.co:5432/postgres?sslmode=require
```

Neu dung **Transaction pooler**, username thuong co dang:

```text
postgres.<project-ref>
```

Khi do URL thuong dung port `6543`, vi du:

```text
jdbc:postgresql://<your-pooler-host>:6543/postgres?sslmode=require
```

Luu y: Neu Supabase hien canh bao **Not IPv4 compatible**, may/mang cua ban co the khong ket noi duoc qua direct host port `5432`. Khi do hay vao **Pooler settings** va dung connection string cua **Session pooler** hoac **Transaction pooler**.

## 2. Tao file cau hinh local

Tao file:

```text
E:\cnpm\Learning-Management-System\backend\.env.local
```

Noi dung mau:

```text
DB_URL=jdbc:postgresql://db.<your-supabase-project-ref>.supabase.co:5432/postgres?sslmode=require
DB_USERNAME=postgres
DB_PASSWORD=<supabase-database-password>
DDL_AUTO=update
JWT_SECRET=<change-this-to-a-long-random-secret>
JWT_EXPIRATION=86400000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_EMAIL=admin@gmail.com
APP_LOG_LEVEL=INFO
SECURITY_LOG_LEVEL=INFO
```

Khong commit file `.env.local` len GitHub vi co password database.

## 3. Chay backend

```powershell
cd E:\cnpm\Learning-Management-System\backend
.\run-local.cmd
```

Neu thanh cong, log se co cac y sau:

```text
Started LearningManagementSystemApplication
Default admin user created.
Sample programming course catalog created.
```

Sau do quay lai Supabase **Database > Tables**, bam refresh. Ban se thay cac bang nhu:

- `users`
- `course`
- `course_lessons`
- `learning`
- `progress`
- `lesson_progress`
- `questions`
- `assessment`
- `feedback`
- `discussion`

## 4. Chay frontend

```powershell
cd E:\cnpm\Learning-Management-System\frontend
npm.cmd start --cache .\.npm-cache
```

Mo:

```text
http://localhost:3000
```

## 5. Tai khoan admin mac dinh

```text
Email: admin@gmail.com
Password: admin123
```

## 6. Kiem tra nhanh

1. Mo `http://localhost:3000`.
2. Dang nhap bang admin.
3. Vao trang **Quan tri**.
4. Kiem tra danh sach khoa hoc mau.
5. Vao Supabase **Tables** de xem du lieu da duoc tao.

## 7. Loi thuong gap

### Backend bao loi ket noi database

Kiem tra:

- `DB_URL` da co `jdbc:postgresql://`.
- URL co `?sslmode=require`.
- `DB_USERNAME` dung voi loai connection string.
- Password la database password, khong phai password tai khoan Supabase.

### Khong thay bang trong Supabase

Kiem tra backend da chay thanh cong chua. Neu backend chua start xong thi Hibernate chua tao bang.

### Dang nhap admin khong duoc

Neu admin da tung duoc tao voi password cu, xoa user admin trong bang `users` roi chay lai backend, hoac doi password truc tiep trong database bang cach tao user moi qua API/register.
