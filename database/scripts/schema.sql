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

    failed_login_attempts INT NOT NULL DEFAULT 0,
    locked_until DATETIME NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (role_id)
        REFERENCES roles(role_id)
        ON DELETE SET NULL
);

-- Bảng quản lý phiên đăng nhập
CREATE TABLE IF NOT EXISTS user_sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    refresh_token VARCHAR(500) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    reset_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
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

CREATE TABLE IF NOT EXISTS permissions (
    permission_id INT AUTO_INCREMENT PRIMARY KEY,
    permission_name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,

    PRIMARY KEY (role_id, permission_id),

    FOREIGN KEY (role_id)
        REFERENCES roles(role_id)
        ON DELETE CASCADE,

    FOREIGN KEY (permission_id)
        REFERENCES permissions(permission_id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,

    PRIMARY KEY (user_id, role_id),

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (role_id)
        REFERENCES roles(role_id)
        ON DELETE CASCADE
);

INSERT INTO roles (role_id, role_name) VALUES
(1, 'ADMIN'),
(2, 'INSTRUCTOR'),
(3, 'STUDENT'),
(4, 'ACCOUNTANT'),
(5, 'TRAINING_MANAGER'),
(6, 'ADMISSIONS'),
(7, 'ACADEMIC_AFFAIRS'),
(8, 'MANAGEMENT')
ON DUPLICATE KEY UPDATE role_name = VALUES(role_name);

INSERT INTO roles (role_id, role_name) VALUES
(1, 'ADMIN'),
(2, 'INSTRUCTOR'),
(3, 'STUDENT'),
(4, 'ACCOUNTANT'),
(5, 'TRAINING_MANAGER'),
(6, 'ADMISSIONS'),
(7, 'ACADEMIC_AFFAIRS'),
(8, 'MANAGEMENT')
ON DUPLICATE KEY UPDATE role_name = VALUES(role_name);

INSERT INTO permissions (permission_name, description) VALUES
('USER_MANAGE', 'Quản lý tài khoản người dùng'),
('ROLE_MANAGE', 'Quản lý vai trò và phân quyền'),
('COURSE_MANAGE', 'Quản lý khóa học'),
('CLASS_MANAGE', 'Quản lý lớp học'),
('GRADE_VIEW', 'Xem điểm'),
('GRADE_EDIT', 'Cập nhật điểm'),
('TUITION_VIEW', 'Xem học phí'),
('TUITION_EDIT', 'Cập nhật học phí'),
('ATTENDANCE_VIEW', 'Xem điểm danh'),
('ATTENDANCE_EDIT', 'Cập nhật điểm danh')
ON DUPLICATE KEY UPDATE
description = VALUES(description);

-- =========================================
-- PHAN QUYEN CHO CAC VAI TRO
-- =========================================

-- ADMIN: có tất cả quyền
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT 1, permission_id
FROM permissions;


-- INSTRUCTOR: giảng viên
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT 2, permission_id
FROM permissions
WHERE permission_name IN (
    'COURSE_MANAGE',
    'CLASS_MANAGE',
    'GRADE_VIEW',
    'GRADE_EDIT',
    'ATTENDANCE_VIEW',
    'ATTENDANCE_EDIT'
);


-- STUDENT: học viên
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT 3, permission_id
FROM permissions
WHERE permission_name IN (
    'GRADE_VIEW',
    'TUITION_VIEW',
    'ATTENDANCE_VIEW'
);


-- ACCOUNTANT: kế toán
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT 4, permission_id
FROM permissions
WHERE permission_name IN (
    'TUITION_VIEW',
    'TUITION_EDIT'
);


-- TRAINING_MANAGER: quản lý đào tạo
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT 5, permission_id
FROM permissions
WHERE permission_name IN (
    'COURSE_MANAGE',
    'CLASS_MANAGE',
    'GRADE_VIEW',
    'ATTENDANCE_VIEW'
);


-- ADMISSIONS: tuyển sinh
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT 6, permission_id
FROM permissions
WHERE permission_name IN (
    'USER_MANAGE',
    'COURSE_MANAGE'
);


-- ACADEMIC_AFFAIRS: giáo vụ
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT 7, permission_id
FROM permissions
WHERE permission_name IN (
    'CLASS_MANAGE',
    'GRADE_VIEW',
    'ATTENDANCE_VIEW'
);


-- MANAGEMENT: ban quản lý
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT 8, permission_id
FROM permissions
WHERE permission_name IN (
    'GRADE_VIEW',
    'TUITION_VIEW',
    'ATTENDANCE_VIEW'
);