from app.database import SessionLocal
from app.models.role import Role
from app.models.user import User
from app.core.security import hash_password

db = SessionLocal()

try:
    existing_user = db.query(User).filter(
        User.email == "admin@example.com"
    ).first()

    if existing_user:
        print("Tai khoan test da ton tai.")
    else:
        user = User(
            username="admin",
            email="admin@example.com",
            password=hash_password("Admin@123"),
            full_name="Quản trị hệ thống",
            role_id=1,
            failed_login_attempts=0
        )

        db.add(user)
        db.commit()

        print("Tao tai khoan test thanh cong.")

finally:
    db.close()