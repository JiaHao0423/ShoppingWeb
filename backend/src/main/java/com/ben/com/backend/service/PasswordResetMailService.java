package com.ben.com.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.nio.charset.StandardCharsets;
import java.io.IOException;
import java.net.URI;
import java.time.Duration;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetMailService {

  private final ObjectMapper objectMapper = new ObjectMapper();
  private final HttpClient httpClient = HttpClient.newBuilder()
    .connectTimeout(Duration.ofSeconds(5))
    .build();

  @Value("${app.frontend.base-url:http://localhost:5173}")
  private String frontendBaseUrl;

  @Value("${app.mail.from:ShoppingWeb <onboarding@resend.dev>}")
  private String fromEmail;

  @Value("classpath:mail-templates/password-reset.html")
  private Resource passwordResetTemplate;

  @Value("${app.mail.allow-fallback-log-link:true}")
  private boolean allowFallbackLogLink;

  @Value("${app.mail.provider:resend}")
  private String mailProvider;

  @Value("${app.mail.resend.api-url:https://api.resend.com/emails}")
  private String resendApiUrl;

  @Value("${app.mail.resend.api-key:}")
  private String resendApiKey;

  @Value("${app.mail.resend.fallback-from:ShoppingWeb <onboarding@resend.dev>}")
  private String resendFallbackFrom;

  public Map<String, Object> getMailDebugInfo() {
    Map<String, Object> debugInfo = new HashMap<>();
    debugInfo.put("provider", mailProvider);
    debugInfo.put("resendApiUrl", resendApiUrl);
    debugInfo.put("hasResendApiKey", resendApiKey != null && !resendApiKey.isBlank());
    debugInfo.put("fromEmail", maskEmailValue(fromEmail));
    debugInfo.put("fallbackFromEmail", maskEmailValue(resendFallbackFrom));
    return debugInfo;
  }

  public void sendResetPasswordEmail(String toEmail, String resetToken) {
    String resetLink = frontendBaseUrl + "/reset-password?token=" + resetToken;
    String htmlContent = buildResetPasswordHtml(resetLink);
    log.info("Password reset link generated for {}: {}", toEmail, resetLink);

    try {
      sendEmail(toEmail, "[ShoppingWeb] 重設您的密碼", htmlContent);
    } catch (Exception ex) {
      if (allowFallbackLogLink) {
        log.warn("Mail send failed for {}, fallback to log-only mode. Configure {} provider to enable real delivery.", toEmail, mailProvider, ex);
        return;
      }
      log.error("Failed to send reset password email to {}", toEmail, ex);
      throw new RuntimeException("Failed to send reset password email", ex);
    }
  }

  public void sendMailHealthCheckEmail(String toEmail) {
    String healthLink = frontendBaseUrl + "/login";
    String htmlContent = buildHealthCheckHtml(healthLink);
    log.info("Mail health-check requested for {}", toEmail);
    try {
      sendEmail(toEmail, "[ShoppingWeb] 郵件服務測試信", htmlContent);
    } catch (Exception ex) {
      log.error("Failed to send mail health-check email to {}", toEmail, ex);
      throw new RuntimeException("Failed to send test email", ex);
    }
  }

  private void sendEmail(String toEmail, String subject, String htmlContent) throws IOException, InterruptedException {
    if (!"resend".equalsIgnoreCase(mailProvider)) {
      throw new IllegalStateException("Unsupported mail provider: " + mailProvider);
    }
    if (resendApiKey == null || resendApiKey.isBlank()) {
      throw new IllegalStateException("Missing RESEND_API_KEY");
    }

    HttpResponse<String> response = sendWithFromAddress(toEmail, subject, htmlContent, fromEmail);
    if (response.statusCode() >= 200 && response.statusCode() < 300) {
      return;
    }

    // If custom domain sender is not ready, auto fallback to Resend onboarding sender for testing.
    if (resendFallbackFrom != null && !resendFallbackFrom.isBlank() && !resendFallbackFrom.equals(fromEmail)) {
      HttpResponse<String> fallbackResponse = sendWithFromAddress(toEmail, subject, htmlContent, resendFallbackFrom);
      if (fallbackResponse.statusCode() >= 200 && fallbackResponse.statusCode() < 300) {
        log.warn("Primary sender {} failed, fallback sender {} succeeded. Primary error: {}", fromEmail, resendFallbackFrom, response.body());
        return;
      }
      throw new RuntimeException(
        "Resend API error (primary and fallback failed): primary=" + response.statusCode() + " " + response.body() +
          " | fallback=" + fallbackResponse.statusCode() + " " + fallbackResponse.body()
      );
    }

    throw new RuntimeException("Resend API error: " + response.statusCode() + " " + response.body());
  }

  private HttpResponse<String> sendWithFromAddress(String toEmail, String subject, String htmlContent, String sender)
    throws IOException, InterruptedException {
    Map<String, Object> payload = new HashMap<>();
    payload.put("from", sender);
    payload.put("to", new String[]{toEmail});
    payload.put("subject", subject);
    payload.put("html", htmlContent);

    String body = objectMapper.writeValueAsString(payload);
    HttpRequest request = HttpRequest.newBuilder()
      .uri(URI.create(resendApiUrl))
      .timeout(Duration.ofSeconds(10))
      .header("Authorization", "Bearer " + resendApiKey)
      .header("Content-Type", "application/json")
      .POST(HttpRequest.BodyPublishers.ofString(body))
      .build();
    return httpClient.send(request, HttpResponse.BodyHandlers.ofString());
  }

  private String maskEmailValue(String value) {
    if (value == null || value.isBlank()) {
      return "";
    }
    int atIndex = value.indexOf('@');
    if (atIndex <= 1) {
      return "***";
    }
    return value.substring(0, 1) + "***" + value.substring(atIndex);
  }

  private String buildResetPasswordHtml(String resetLink) {
    try {
      String template = StreamUtils.copyToString(passwordResetTemplate.getInputStream(), StandardCharsets.UTF_8);
      return template
        .replace("{{RESET_LINK}}", resetLink)
        .replace("{{RESET_LINK_TEXT}}", resetLink);
    } catch (IOException ex) {
      throw new RuntimeException("Failed to load password reset email template", ex);
    }
  }

  private String buildHealthCheckHtml(String link) {
    return """
      <!doctype html>
      <html lang="zh-Hant">
      <head><meta charset="UTF-8" /><title>SMTP 測試</title></head>
      <body style="font-family:Arial,'Noto Sans TC',sans-serif;padding:24px;background:#f8fafc;color:#0f172a;">
        <h2 style="margin:0 0 12px;">ShoppingWeb SMTP 測試成功</h2>
        <p style="margin:0 0 14px;">如果你收到這封信，代表目前 SMTP 設定可正常寄送外部郵件。</p>
        <p style="margin:0;">
          <a href="%s" style="color:#2563eb;text-decoration:none;">返回網站登入頁</a>
        </p>
      </body>
      </html>
      """.formatted(link);
  }
}
