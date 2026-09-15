import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from .config import get_settings

settings = get_settings()


def send_contact_email(name: str, email: str, phone: str, message: str, selected_unit: str, unit_email: str) -> None:
    if not settings.smtp_username or not settings.smtp_password:
        return

    msg = MIMEMultipart()
    msg["From"] = settings.smtp_from or settings.smtp_username
    msg["To"] = f"{settings.manager_email}, {unit_email}"
    msg["Subject"] = f"Novo lead Arena01 - {selected_unit}"

    body = f"""
    Nome: {name}
    E-mail: {email}
    Telefone: {phone or 'Não informado'}
    Unidade: {selected_unit}

    Mensagem:
    {message or 'Sem mensagem'}
    """

    msg.attach(MIMEText(body, "plain", "utf-8"))

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
        server.starttls()
        server.login(settings.smtp_username, settings.smtp_password)
        server.send_message(msg)
