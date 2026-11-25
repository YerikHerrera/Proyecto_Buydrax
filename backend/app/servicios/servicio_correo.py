"""Envío de correo: SMTP si está configurado; si no, log a archivo (dev)."""

from __future__ import annotations

import logging
import smtplib
from email.message import EmailMessage
from pathlib import Path

from app.nucleo.configuracion import get_settings

logger = logging.getLogger(__name__)


def enviar_correo(destinatario: str, asunto: str, cuerpo_texto: str) -> bool:
    settings = get_settings()
    host = getattr(settings, "smtp_host", None) or ""
    port = int(getattr(settings, "smtp_port", 587) or 587)
    user = getattr(settings, "smtp_user", None) or ""
    password = getattr(settings, "smtp_password", None) or ""
    remitente = getattr(settings, "smtp_from", None) or user or "noreply@buydrax.local"

    if host and user:
        try:
            msg = EmailMessage()
            msg["Subject"] = asunto
            msg["From"] = remitente
            msg["To"] = destinatario
            msg.set_content(cuerpo_texto)
            with smtplib.SMTP(host, port, timeout=20) as smtp:
                smtp.starttls()
                smtp.login(user, password)
                smtp.send_message(msg)
            logger.info("Correo enviado a %s", destinatario)
            return True
        except Exception as exc:
            logger.exception("Fallo SMTP: %s", exc)

    # Fallback desarrollo: escribir a archivo
    out = Path("backend") / "logs" / "correos_enviados.log"
    try:
        out.parent.mkdir(parents=True, exist_ok=True)
        with out.open("a", encoding="utf-8") as f:
            f.write(f"\n---\nTO: {destinatario}\nSUBJECT: {asunto}\n{cuerpo_texto}\n")
        logger.warning("SMTP no configurado; correo logueado en %s", out)
        return True
    except Exception:
        logger.exception("No se pudo loguear el correo")
        return False
