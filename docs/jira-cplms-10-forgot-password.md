# Jira guide - CPLMS-10 Quen mat khau qua email SMTP

## Work item

```text
CPLMS-10 Quen mat khau va dat lai mat khau qua email SMTP
```

Loai work item:

```text
Feature
```

## Description

```text
Xay dung chuc nang quen mat khau dung email reset link/token. He thong tao token dat lai mat khau, luu vao database, gui link qua SMTP va cho user tao mat khau moi. Mat khau moi duoc ma hoa bang BCrypt.
```

## Acceptance Criteria

```text
- User truy cap duoc /forgot-password tu man hinh dang nhap.
- User nhap email va he thong gui link reset qua SMTP.
- Link reset co token va het han sau 30 phut.
- User truy cap /reset-password?token=... de tao mat khau moi.
- Mat khau moi co it nhat 6 ky tu va duoc ma hoa BCrypt.
- Token da dung khong the dung lai.
- Neu SMTP chua cau hinh, he thong bao loi ro rang.
- Backend/frontend build thanh cong.
```

## Subtasks

```text
Them dependency spring-boot-starter-mail
Tao bang password_reset_tokens
Tao API /api/auth/forgot-password
Tao API /api/auth/reset-password
Tao service gui email reset qua SMTP
Tao trang /forgot-password
Tao trang /reset-password
Test reset password va login bang mat khau moi
```

## Jira status

Sau khi da code:

```text
CPLMS-10 -> Testing
```

Sau khi cau hinh SMTP va reset thanh cong tren UI:

```text
CPLMS-10 -> Done
```

## Cau hinh SMTP de demo Gmail

Can tao Gmail App Password, khong dung mat khau Gmail thuong.

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-gmail-app-password
MAIL_FROM=your-email@gmail.com
MAIL_SMTP_AUTH=true
MAIL_SMTP_STARTTLS_ENABLE=true
FRONTEND_URL=http://localhost:3000
```

