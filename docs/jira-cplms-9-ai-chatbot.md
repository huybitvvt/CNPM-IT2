# Jira guide - CPLMS-9 Chatbot AI ho tro hoc tap

## 1. Tao work item tren Jira

Tao work item moi trong Backlog:

```text
CPLMS-9 Chatbot AI ho tro hoc tap
```

Loai work item nen chon:

```text
Feature
```

Neu Jira khong co Feature thi chon `Task`.

## 2. Description

Dan noi dung sau vao phan Description:

```text
Tich hop chatbot AI vao CodePath LMS de ho tro nguoi hoc hoi dap ve lap trinh, noi dung khoa hoc, loi code, lo trinh hoc va cach su dung he thong. Chatbot su dung Groq API, backend Spring Boot giu API key va frontend React hien thi cua so chat noi cho user da dang nhap.
```

## 3. Acceptance Criteria

Them cac tieu chi hoan thanh:

```text
- User da dang nhap thay nut AI Tutor tren giao dien.
- User co the gui cau hoi va nhan cau tra loi bang tieng Viet.
- Frontend khong luu hoac de lo GROQ_API_KEY.
- Backend goi Groq API qua endpoint /api/ai-chat.
- Neu chua cau hinh GROQ_API_KEY, he thong hien thong bao loi ro rang.
- Chatbot luu tam lich su hoi thoai ngan trong localStorage.
- Build backend va frontend thanh cong.
```

## 4. Subtasks

Tao cac subtask sau:

```text
Tao DTO request/response cho AI chat
Tao service backend goi Groq Chat Completions API
Tao controller /api/ai-chat
Them bien moi truong GROQ_API_KEY va GROQ_MODEL
Tao frontend ai.service.js
Tao widget AiChatbot hien thi noi toan app
Test khi chua cau hinh GROQ_API_KEY
Test build frontend/backend
```

## 5. Phan cong theo role

Vi ban la Dev/DevOps, gan:

```text
CPLMS-9 -> Dev/DevOps
Tat ca subtask ky thuat -> Dev/DevOps
Subtask test -> QA/Tester
Subtask mo ta tinh nang trong Product Vision -> PM/BA
```

## 6. Nen dua vao Sprint nao?

Neu Sprint 1 van con dang chay va ban muon demo chatbot giua ky:

```text
Move CPLMS-9 vao CPLMS Sprint 1
Status ban dau: To Do
Sau khi code xong: In Review hoac Testing
Sau khi build/test thanh cong: Done
```

Neu khong muon lam tang scope Sprint 1:

```text
De CPLMS-9 trong Backlog va dua vao Sprint 2
```

Khuyen nghi: dua vao Sprint 2 neu thoi gian giua ky gap.

## 7. Cau noi khi present

```text
Ngoai cac chuc nang LMS co ban, nhom em bo sung chatbot AI ho tro hoc tap. Chatbot su dung Groq API, duoc goi thong qua backend Spring Boot de bao ve API key. Nguoi hoc co the hoi dap ve lap trinh, loi code va noi dung khoa hoc truc tiep trong he thong.
```

