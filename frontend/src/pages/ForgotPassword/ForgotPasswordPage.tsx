import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../../components/layout/Header/Header";
import AuthService from "../../services/authService";
import { ROUTES } from "../../constants/routes";
import notify from "../../utils/notify";
import "../AuthPage/AuthPage.scss";

const ForgotPasswordPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") ?? "";

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirectSeconds, setRedirectSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (redirectSeconds === null) return;
    if (redirectSeconds <= 0) {
      navigate(ROUTES.LOGIN, { replace: true });
      return;
    }

    const timer = window.setTimeout(() => {
      setRedirectSeconds((prev) => (prev === null ? null : prev - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [redirectSeconds, navigate]);

  const handleRequestReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await AuthService.requestPasswordReset(email);
      notify.success("已送出密碼重設請求，請檢查信箱。");
    } catch (error) {
      console.error("Request password reset failed:", error);
      notify.error("送出重設請求失敗，請稍後再試。");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      notify.error("缺少重設 token，請重新申請重設連結。");
      return;
    }
    setLoading(true);
    try {
      await AuthService.resetPassword(token, newPassword);
      notify.success("密碼已重設，請重新登入。");
      setSearchParams({});
      setNewPassword("");
      setRedirectSeconds(3);
    } catch (error) {
      console.error("Reset password failed:", error);
      notify.error("密碼重設失敗，請確認連結是否過期。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <Header variant="auth" />
      <main className="auth__main">
        <div className="auth__container">
          <div className="auth__heading">
            <h1 className="auth__title">{token ? "重設密碼" : "忘記密碼"}</h1>
            <p className="auth__subtitle">{token ? "請輸入新的密碼" : "輸入註冊 Email 以取得重設連結"}</p>
          </div>

          {!token ? (
            <form className="auth__form" onSubmit={handleRequestReset}>
              <div className="auth__field">
                <label className="auth__label">Email</label>
                <input className="auth__input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <button type="submit" className="auth__submit-btn" disabled={loading}>
                {loading ? "處理中..." : "送出重設請求"}
              </button>
            </form>
          ) : (
            <form className="auth__form" onSubmit={handleResetPassword}>
              <div className="auth__field">
                <label className="auth__label">新密碼</label>
                <input
                  className="auth__input"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
              <button type="submit" className="auth__submit-btn" disabled={loading || redirectSeconds !== null}>
                {loading ? "處理中..." : "確認重設密碼"}
              </button>
              {redirectSeconds !== null && (
                <p className="auth__info-message">
                  密碼已更新，將在 {redirectSeconds} 秒後自動返回登入頁...
                </p>
              )}
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default ForgotPasswordPage;
