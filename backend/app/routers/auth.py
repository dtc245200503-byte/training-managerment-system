from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.role import Role
from app.models.user import User
from app.schemas.auth import LoginRequest
from app.core.security import verify_password, create_access_token


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):

    user = db.query(User).filter(
        User.email == data.email
    ).first()

    # Email không tồn tại
    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Email hoặc mật khẩu không đúng"
        )

    now = datetime.now()

    # Tài khoản vẫn đang bị khóa
    if user.locked_until is not None and user.locked_until > now:
        raise HTTPException(
            status_code=423,
            detail="Tài khoản tạm thời bị khóa. Vui lòng thử lại sau."
        )

    # Nếu thời gian khóa đã hết
    if user.locked_until is not None and user.locked_until <= now:
        user.locked_until = None
        user.failed_login_attempts = 0
        db.commit()

    # Mật khẩu sai
    if not verify_password(data.password, user.password):

        user.failed_login_attempts += 1

        # Sai lần thứ 5
        if user.failed_login_attempts >= 5:
            user.locked_until = now + timedelta(minutes=15)
            db.commit()

            raise HTTPException(
                status_code=423,
                detail="Tài khoản tạm thời bị khóa trong 15 phút."
            )

        db.commit()

        raise HTTPException(
            status_code=401,
            detail="Email hoặc mật khẩu không đúng"
        )

    # Đăng nhập thành công -> reset số lần sai
    user.failed_login_attempts = 0
    user.locked_until = None
    db.commit()

    role = db.query(Role).filter(
        Role.role_id == user.role_id
    ).first()

    role_name = role.role_name if role else None

    access_token = create_access_token(
        user_id=user.user_id,
        role=role_name
    )

    return {
    "message": "Đăng nhập thành công",
    "access_token": access_token,
    "token_type": "bearer",
    "user": {
        "user_id": user.user_id,
        "full_name": user.full_name,
        "email": user.email,
        "role": role_name
    }
}