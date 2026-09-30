import os

from dotenv import load_dotenv
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType


load_dotenv()


conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)


async def send_reset_password_email(
    email: str,
    reset_link: str
):
    html = f"""
    <h2>Đặt lại mật khẩu</h2>

    <p>Bạn đã yêu cầu đặt lại mật khẩu.</p>

    <p>
        <a href="{reset_link}">
            Nhấn vào đây để đặt lại mật khẩu
        </a>
    </p>

    <p>Liên kết có hiệu lực trong 30 phút và chỉ sử dụng được một lần.</p>

    <p>Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>
    """

    message = MessageSchema(
        subject="Đặt lại mật khẩu - Training Management System",
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)

    await fm.send_message(message)