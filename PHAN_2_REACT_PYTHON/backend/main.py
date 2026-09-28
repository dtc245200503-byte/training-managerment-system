from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ==============================================================================
# QUẢN LÝ NGƯỜI DÙNG & ĐA VAI TRÒ (MULTI-ROLE RBAC)
# ==============================================================================
USERS_DB = {
    "admin_an": {
        "name": "Thầy Trần Văn An",
        "roles": ["admin", "teacher"]  # Giữ nhiều vai trò cùng lúc
    },
    "gv_ha": {
        "name": "Cô Thu Hà",
        "roles": ["teacher"]
    },
    "hs_nam": {
        "name": "Lê Hoàng Nam",
        "roles": ["student"]
    }
}

ALL_MENUS = [
    {"id": "home", "name": "Trang chủ đào tạo", "icon": "🏠", "roles": ["admin", "teacher", "student"]},
    {"id": "results", "name": "Xem kết quả chuyên cần", "icon": "📊", "roles": ["admin", "teacher", "student"]},
    {"id": "diemdanh", "name": "Điểm danh học viên", "icon": "📝", "roles": ["admin", "teacher"]},
    {"id": "roles", "name": "Cấu hình phân quyền", "icon": "⚙️", "roles": ["admin"]}
]

@app.route("/api/users", methods=["GET"])
def get_users():
    """Lấy danh sách người dùng và các vai trò hiện tại"""
    return jsonify({"status": "success", "users": USERS_DB}), 200

@app.route("/api/menus", methods=["GET"])
def get_menus():
    """Lọc danh sách menu theo vai trò người dùng (RBAC Filtering)"""
    username = request.args.get("username", "admin_an")
    user = USERS_DB.get(username)
    if not user:
        return jsonify({"status": "error", "message": "Người dùng không tồn tại!"}), 404

    user_roles = set(user["roles"])
    # Menu được hiển thị nếu người dùng có ít nhất 1 vai trò được phép
    filtered_menus = [
        m for m in ALL_MENUS if any(r in user_roles for r in m["roles"])
    ]

    return jsonify({
        "status": "success",
        "user": {
            "username": username,
            "name": user["name"],
            "roles": user["roles"]
        },
        "menus": filtered_menus
    }), 200

@app.route("/api/update-roles", methods=["POST"])
def update_roles():
    """
    Cập nhật vai trò có hiệu lực ngay lập tức.
    RÀNG BUỘC BẢO MẬT: Quy tắc an toàn Anti-Lockout.
    Không thể tự thu hồi vai trò quản trị của chính mình.
    """
    data = request.get_json() or {}
    operator_username = data.get("operator_username", "")  # Người đang thao tác
    target_username = data.get("target_username", "")      # Người bị đổi vai trò
    new_roles = data.get("roles", [])                      # Danh sách vai trò mới

    if target_username not in USERS_DB:
        return jsonify({"status": "error", "message": "Tài khoản không tồn tại!"}), 404

    # KIỂM TRA QUY TẮC ANTI-LOCKOUT
    if operator_username == target_username and "admin" in USERS_DB[operator_username]["roles"] and "admin" not in new_roles:
        return jsonify({
            "status": "error",
            "error_code": "ANTI_LOCKOUT_VIOLATION",
            "message": "Quy tắc an toàn (Anti-Lockout): Bạn không thể tự thu hồi quyền Quản trị viên của chính mình!"
        }), 403

    # Cập nhật quyền có hiệu lực tức thì
    USERS_DB[target_username]["roles"] = new_roles

    return jsonify({
        "status": "success",
        "message": f"Đã cập nhật vai trò cho {USERS_DB[target_username]['name']} thành công!",
        "user": {
            "username": target_username,
            "name": USERS_DB[target_username]["name"],
            "roles": USERS_DB[target_username]["roles"]
        }
    }), 200

if __name__ == "__main__":
    print("🚀 Server Phần 2 (Python Flask) đang chạy tại: http://localhost:5001")
    app.run(port=5001, debug=True)
