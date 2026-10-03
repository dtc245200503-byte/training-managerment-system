# Hệ thống quản lý đào tạo

Hệ thống quản lý đào tạo được xây dựng để hỗ trợ quản lý người dùng, phân quyền, khóa học, lớp học, điểm, học phí, điểm danh và các nghiệp vụ liên quan đến đào tạo.

## Công nghệ sử dụng

### Backend
- Python
- FastAPI
- SQLAlchemy
- PyMySQL
- MySQL

### Frontend
- React
- TypeScript
- Vite
- React Router

### Database
- MySQL 8.0

### Công cụ
- Docker
- Docker Compose
- Git
- GitHub


# Hướng dẫn cài đặt và chạy project

## 1. Yêu cầu trước khi chạy

Máy cần cài đặt:

- Git
- Python
- Node.js
- Docker Desktop

Kiểm tra Git:

```powershell
git --version
```

Kiểm tra Python:

```powershell
python --version
```

Kiểm tra Node.js:

```powershell
node --version
```

Kiểm tra npm:

```powershell
npm --version
```

Kiểm tra Docker:

```powershell
docker --version
```

---

## 2. Clone project

Mở PowerShell hoặc Terminal tại thư mục muốn lưu project.

Chạy:

```powershell
git clone https://github.com/dtc245200503-byte/training-managerment-system.git
```

Đi vào thư mục project:

```powershell
cd training-managerment-system
```

Chuyển sang branch `develop`:

```powershell
git checkout develop
```

Cập nhật code mới nhất:

```powershell
git pull origin develop
```

---

## 3. Cấu hình Backend

Đi vào thư mục:

```text
backend/
```

Tạo file:

```text
.env
```

Nội dung:

```env
DATABASE_URL=mysql+pymysql://training_user:training123@localhost:3307/training_management

SECRET_KEY=your-secret-key

MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-google-app-password
MAIL_FROM=your-email@gmail.com
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
```

### Lưu ý

Không được push file `.env` lên GitHub.

Không chia sẻ:

- Gmail App Password
- SECRET_KEY thật
- Các thông tin đăng nhập cá nhân

Các chức năng gửi email như:

- Quên mật khẩu
- Gửi mật khẩu tạm thời

cần cấu hình email hợp lệ.

---

## 4. Cài thư viện Backend

Từ thư mục gốc project:

```powershell
cd backend
```

Cài các thư viện Python:

```powershell
python -m pip install -r requirements.txt
```

Sau khi cài xong:

```powershell
cd ..
```

---

## 5. Cài thư viện Frontend

Đi vào frontend:

```powershell
cd frontend
```

Cài package:

```powershell
npm install
```

Sau khi cài xong:

```powershell
cd ..
```

---

## 6. Khởi động Database

Mở Docker Desktop.

Tại thư mục gốc project chạy:

```powershell
docker compose up -d
```

Kiểm tra container:

```powershell
docker ps
```

Nếu thành công sẽ thấy container MySQL:

```text
training-mysql
```

MySQL được cấu hình:

```text
Host: localhost
Port: 3307
Database: training_management
User: training_user
```

Dữ liệu MySQL được lưu trong Docker Volume nên không bị mất khi dừng container thông thường.

### Không chạy lệnh sau nếu muốn giữ dữ liệu

```powershell
docker compose down -v
```

Lệnh trên sẽ xóa Docker Volume và có thể làm mất dữ liệu database.

---

## 7. Chạy Backend

Mở Terminal thứ nhất.

Đi vào backend:

```powershell
cd backend
```

Chạy:

```powershell
python -m uvicorn app.main:app --reload
```

Backend chạy tại:

```text
http://127.0.0.1:8000
```

Swagger API:

```text
http://127.0.0.1:8000/docs
```

Kiểm tra Backend:

```text
http://127.0.0.1:8000/health
```

Kiểm tra kết nối Database:

```text
http://127.0.0.1:8000/health/db
```

---

## 8. Chạy Frontend

Mở Terminal thứ hai.

Đi vào frontend:

```powershell
cd frontend
```

Chạy:

```powershell
npm run dev
```

Frontend chạy tại:

```text
http://localhost:5173
```

Mở trình duyệt và truy cập:

```text
http://localhost:5173
```

---

# Cách chạy lại project sau khi tắt máy

Không cần cài lại thư viện mỗi lần chạy.

## Bước 1

Mở Docker Desktop.

## Bước 2

Tại thư mục gốc project:

```powershell
docker compose up -d
```

## Bước 3

Mở Terminal thứ nhất:

```powershell
cd backend
python -m uvicorn app.main:app --reload
```

## Bước 4

Mở Terminal thứ hai:

```powershell
cd frontend
npm run dev
```

Sau đó truy cập:

```text
http://localhost:5173
```

---

# Cách cập nhật code mới nhất từ GitHub

Nếu đã clone project trước đó thì không cần clone lại.

Trước tiên kiểm tra code đang làm:

```powershell
git status
```

Nếu không có thay đổi chưa commit, chuyển sang `develop`:

```powershell
git checkout develop
```

Tải code mới nhất:

```powershell
git pull origin develop
```

Nếu `requirements.txt` có thay đổi, chạy lại:

```powershell
cd backend
python -m pip install -r requirements.txt
cd ..
```

Nếu package frontend có thay đổi, chạy:

```powershell
cd frontend
npm install
cd ..
```

Sau đó chạy project như bình thường.

---

# Quy trình Git của nhóm

Branch chính:

```text
main
```

Branch tích hợp:

```text
develop
```

Khi làm một chức năng mới, không code trực tiếp trên `main` hoặc `develop`.

Ví dụ:

```powershell
git checkout develop
git pull origin develop
git checkout -b feature/ten-chuc-nang
```

Sau khi hoàn thành:

```powershell
git add .
git commit -m "Mo ta chuc nang"
git push -u origin feature/ten-chuc-nang
```

Sau đó tạo Pull Request:

```text
feature/ten-chuc-nang
        ↓
     develop
```

Sau khi kiểm tra và merge, các thành viên khác cập nhật bằng:

```powershell
git checkout develop
git pull origin develop
```

---

# Cấu trúc project

```text
training-managerment-system/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── database.py
│   │   └── main.py
│   │
│   ├── scripts/
│   ├── tests/
│   ├── .env
│   └── requirements.txt
│
├── database/
│   └── scripts/
│       └── schema.sql
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── services/
│   │   └── types/
│   │
│   └── package.json
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

# Các địa chỉ sử dụng

| Chức năng | Địa chỉ |
|---|---|
| Frontend | `http://localhost:5173` |
| Backend API | `http://127.0.0.1:8000` |
| Swagger | `http://127.0.0.1:8000/docs` |
| Backend Health | `http://127.0.0.1:8000/health` |
| Database Health | `http://127.0.0.1:8000/health/db` |
| MySQL | `localhost:3307` |

---

# Lưu ý

- Luôn cập nhật branch `develop` trước khi bắt đầu chức năng mới.
- Không push `.env` lên GitHub.
- Không push mật khẩu hoặc App Password lên GitHub.
- Không làm trực tiếp trên branch `main`.
- Mỗi chức năng nên có branch riêng.
- Kiểm tra `git status` trước khi commit.
- Kiểm tra project chạy ổn trước khi tạo Pull Request.
- Không sử dụng `docker compose down -v` nếu muốn giữ dữ liệu MySQL.