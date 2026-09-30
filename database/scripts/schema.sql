-- 1. Tạo bảng Vai trò (Roles: Admin, Giảng viên, Học viên)
CREATE TABLE IF NOT EXISTS roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- 2. Tạo bảng Người dùng / Tài khoản (Users)
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    role_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE SET NULL
);

-- 3. Tạo bảng Khóa học (Courses)
CREATE TABLE IF NOT EXISTS courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_months INT DEFAULT 1
);

-- 4. Tạo bảng Lớp học (Classes)
CREATE TABLE IF NOT EXISTS classes (
    class_id INT AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(100) NOT NULL,
    course_id INT,
    instructor_id INT,
    start_date DATE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- 5. Tạo bảng Học viên - Lớp học (Student_Classes)
CREATE TABLE IF NOT EXISTS student_classes (
    student_id INT,
    class_id INT,
    enrolled_date DATE DEFAULT (CURRENT_DATE),
    PRIMARY KEY (student_id, class_id),
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE
);

-- 6. Chèn dữ liệu mẫu ban đầu (Data Seed)
INSERT INTO roles (role_id, role_name) VALUES 
(1, 'ADMIN'), 
(2, 'INSTRUCTOR'), 
(3, 'STUDENT')
ON DUPLICATE KEY UPDATE role_name=VALUES(role_name);