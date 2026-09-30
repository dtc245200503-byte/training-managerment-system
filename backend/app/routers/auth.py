from datetime import datetime, timedelta

import jwt
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.role import Role
from app.models.user import User
from app.models.session import UserSession
from app.models.password_reset import PasswordResetToken
from app.schemas.auth import (
    LoginRequest,
    RefreshTokenRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest
)
from app.core.security import (
    SECRET_KEY,
    ALGORITHM,
    verify_password,
    hash_password,
    create_access_token,
    create_refresh_token,
    create_password_reset_token
)
from app.core.email import send_reset_password_email


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):

    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Email hoặc mật khẩu không đúng"
        )

    now = datetime.now()

    if user.locked_until is not None and user.locked_until > now:
        raise HTTPException(
            status_code=423,
            detail="Tài khoản tạm thời bị khóa. Vui lòng thử lại sau."
        )

    if user.locked_until is not None and user.locked_until <= now:
        user.locked_until = None
        user.failed_login_attempts = 0
        db.commit()

    if not verify_password(data.password, user.password):
        user.failed_login_attempts += 1

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

    refresh_token = create_refresh_token(
        user_id=user.user_id
    )

    session = UserSession(
        user_id=user.user_id,
        refresh_token=refresh_token,
        expires_at=datetime.now() + timedelta(days=7),
        revoked=False
    )

    db.add(session)
    db.commit()

    return {
        "message": "Đăng nhập thành công",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "user_id": user.user_id,
            "full_name": user.full_name,
            "email": user.email,
            "role": role_name
        }
    }


@router.post("/refresh")
def refresh_token(
    data: RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    session = db.query(UserSession).filter(
        UserSession.refresh_token == data.refresh_token
    ).first()

    if session is None or session.revoked:
        raise HTTPException(
            status_code=401,
            detail="Phiên đăng nhập không hợp lệ hoặc đã đăng xuất"
        )

    if session.expires_at <= datetime.now():
        session.revoked = True
        db.commit()

        raise HTTPException(
            status_code=401,
            detail="Phiên đăng nhập đã hết hạn"
        )

    try:
        payload = jwt.decode(
            data.refresh_token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

    except jwt.ExpiredSignatureError:
        session.revoked = True
        db.commit()

        raise HTTPException(
            status_code=401,
            detail="Phiên đăng nhập đã hết hạn"
        )

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Refresh token không hợp lệ"
        )

    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=401,
            detail="Token không hợp lệ"
        )

    user = db.query(User).filter(
        User.user_id == session.user_id
    ).first()

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Người dùng không tồn tại"
        )

    role = db.query(Role).filter(
        Role.role_id == user.role_id
    ).first()

    role_name = role.role_name if role else None

    new_access_token = create_access_token(
        user_id=user.user_id,
        role=role_name
    )

    return {
        "access_token": new_access_token,
        "token_type": "bearer"
    }


@router.post("/logout")
def logout(
    data: RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    session = db.query(UserSession).filter(
        UserSession.refresh_token == data.refresh_token
    ).first()

    if session is None:
        raise HTTPException(
            status_code=401,
            detail="Phiên đăng nhập không hợp lệ"
        )

    session.revoked = True
    db.commit()

    return {
        "message": "Đăng xuất thành công"
    }


@router.post("/forgot-password")
async def forgot_password(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    message = (
        "Nếu email tồn tại trong hệ thống, "
        "liên kết đặt lại mật khẩu sẽ được gửi đến email."
    )

    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if user is None:
        return {
            "message": message
        }

    reset_token = create_password_reset_token()

    reset = PasswordResetToken(
        user_id=user.user_id,
        token=reset_token,
        expires_at=datetime.now() + timedelta(minutes=30),
        used=False
    )

    db.add(reset)
    db.commit()

    reset_link = (
        "http://localhost:3000/reset-password"
        f"?token={reset_token}"
    )

    await send_reset_password_email(
        email=user.email,
        reset_link=reset_link
    )

    return {
        "message": message
    }


@router.post("/reset-password")
def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    reset = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == data.token
    ).first()

    if reset is None:
        raise HTTPException(
            status_code=400,
            detail="Liên kết đặt lại mật khẩu không hợp lệ"
        )

    if reset.used:
        raise HTTPException(
            status_code=400,
            detail="Liên kết đặt lại mật khẩu đã được sử dụng"
        )

    if reset.expires_at <= datetime.now():
        raise HTTPException(
            status_code=400,
            detail="Liên kết đặt lại mật khẩu đã hết hạn"
        )

    user = db.query(User).filter(
        User.user_id == reset.user_id
    ).first()

    if user is None:
        raise HTTPException(
            status_code=400,
            detail="Không thể đặt lại mật khẩu"
        )

    user.password = hash_password(data.new_password)
    reset.used = True

    db.commit()

    return {
        "message": "Đặt lại mật khẩu thành công"
    }