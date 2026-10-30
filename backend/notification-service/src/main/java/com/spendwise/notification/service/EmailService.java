package com.spendwise.notification.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

/**
 * EmailService — sends HTML email notifications to users.
 *
 * Emails are sent ASYNCHRONOUSLY so they never block the main notification flow.
 * If email sending fails, it only logs the error — the app keeps running normally.
 *
 * To enable email: set MAIL_ENABLED=true and configure MAIL_USERNAME, MAIL_PASSWORD
 * in environment variables or application.yml.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${app.mail.from:spendwise.notify@gmail.com}")
    private String fromEmail;

    /**
     * Send an HTML email notification.
     * Called asynchronously from NotificationService after saving to DB.
     *
     * @param toEmail    Recipient email address
     * @param subject    Email subject line
     * @param type       Notification type (EXPENSE_APPROVED, BUDGET_WARNING, etc.)
     * @param title      Notification title
     * @param message    Notification message body
     */
    @Async
    public void sendNotificationEmail(String toEmail, String subject, String type, String title, String message) {
        if (!mailEnabled) {
            log.debug("Email notifications disabled. Would have sent to {}: {}", toEmail, subject);
            return;
        }

        try {
            MimeMessage mail = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mail, true, "UTF-8");

            helper.setFrom(fromEmail, "SpendWise");
            helper.setTo(toEmail);
            helper.setSubject("[SpendWise] " + subject);
            helper.setText(buildHtml(type, title, message), true);

            mailSender.send(mail);
            log.info("Email notification sent to {}: {}", toEmail, subject);

        } catch (MessagingException e) {
            log.error("Failed to send email to {}: {}", toEmail, e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error sending email to {}: {}", toEmail, e.getMessage());
        }
    }

    /**
     * Build a clean HTML email body.
     */
    private String buildHtml(String type, String title, String message) {
        String iconColor = getIconColor(type);
        String icon      = getIcon(type);

        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>SpendWise Notification</title>
            </head>
            <body style="margin:0;padding:0;background:#0a0a0a;font-family:Inter,-apple-system,sans-serif;">
              <div style="max-width:520px;margin:40px auto;background:#141414;border:1px solid #222;border-radius:12px;overflow:hidden;">
                <!-- Header -->
                <div style="background:#141414;padding:28px 32px 20px;border-bottom:1px solid #222;">
                  <div style="display:flex;align-items:center;gap:10px;">
                    <div style="width:32px;height:32px;background:#f5f5f5;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:#090909;">$</div>
                    <span style="font-size:18px;font-weight:800;color:#f5f5f5;letter-spacing:-0.3px;">SpendWise</span>
                  </div>
                </div>
                <!-- Body -->
                <div style="padding:32px;">
                  <div style="width:48px;height:48px;background:ICONBG;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;font-size:24px;">ICON</div>
                  <h1 style="font-size:20px;font-weight:700;color:#f5f5f5;margin:0 0 10px;letter-spacing:-0.3px;">TITLE</h1>
                  <p style="font-size:14px;color:#a3a3a3;line-height:1.65;margin:0 0 24px;">MESSAGE</p>
                  <a href="http://localhost:5173" style="display:inline-block;background:#f5f5f5;color:#090909;padding:11px 22px;border-radius:8px;font-weight:700;font-size:13.5px;text-decoration:none;">
                    View in SpendWise →
                  </a>
                </div>
                <!-- Footer -->
                <div style="padding:18px 32px;border-top:1px solid #222;font-size:11px;color:#555;">
                  You received this because you have an active SpendWise account.
                  This is an automated notification — please do not reply.
                </div>
              </div>
            </body>
            </html>
            """
            .replace("ICONBG", iconColor)
            .replace("ICON", icon)
            .replace("TITLE", escapeHtml(title))
            .replace("MESSAGE", escapeHtml(message));
    }

    private String getIconColor(String type) {
        if (type == null) return "rgba(79,142,247,0.15)";
        return switch (type) {
            case "EXPENSE_APPROVED"  -> "rgba(53,201,138,0.15)";
            case "EXPENSE_REJECTED"  -> "rgba(255,69,69,0.15)";
            case "BUDGET_WARNING"    -> "rgba(245,158,11,0.15)";
            case "BUDGET_CRITICAL",
                 "BUDGET_EXCEEDED"   -> "rgba(255,69,69,0.15)";
            default                  -> "rgba(79,142,247,0.15)";
        };
    }

    private String getIcon(String type) {
        if (type == null) return "🔔";
        return switch (type) {
            case "EXPENSE_SUBMITTED" -> "📤";
            case "EXPENSE_APPROVED"  -> "✅";
            case "EXPENSE_REJECTED"  -> "❌";
            case "BUDGET_WARNING"    -> "⚠️";
            case "BUDGET_CRITICAL",
                 "BUDGET_EXCEEDED"   -> "🚨";
            default                  -> "🔔";
        };
    }

    private String escapeHtml(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }
}

