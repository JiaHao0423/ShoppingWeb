import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header/Header";
import "./AuthPage.scss";
import AuthService from "../../services/authService";
import { useAuth } from "../../contexts/AuthContext";

type AuthVariant = "register" | "login" | "simple-login";
type FieldType = "text" | "password";

type FieldConfig = {
  name: "name" | "account" | "password";
  label: string;
  type: FieldType;
  required: boolean;
};

type LinkConfig = { text: string; to: string } | null;

type PageConfig = {
  title: string;
  subtitle: string | null;
  fields: FieldConfig[];
  rememberMe: boolean;
  forgotPassword: boolean;
  submitLabel: string;
  socialDividerText: string | null;
  socialButtons: string[];
  bottomDivider: boolean;
  bottomLink: LinkConfig;
  footerLink: LinkConfig;
};

const PAGE_CONFIG: Record<AuthVariant, PageConfig> = {
  register: {
    title: "建立新帳戶",
    subtitle: "請輸入真實資料",
    fields: [
      { name: "name", label: "姓名", type: "text", required: true },
      { name: "account", label: "帳號", type: "text", required: true },
      { name: "password", label: "密碼", type: "password", required: true },
    ],
    rememberMe: true,
    forgotPassword: false,
    submitLabel: "註冊",
    socialDividerText: null,
    socialButtons: ["google", "apple"],
    bottomDivider: true,
    bottomLink: null,
    footerLink: { text: "忘記密碼？", to: "/forgot-password" },
  },
  login: {
    title: "歡迎回來！",
    subtitle: null,
    fields: [
      { name: "account", label: "帳號", type: "text", required: true },
      { name: "password", label: "密碼", type: "password", required: true },
    ],
    rememberMe: true,
    forgotPassword: true,
    submitLabel: "登入",
    socialDividerText: "使用以下方式快速登入",
    socialButtons: ["google", "apple"],
    bottomDivider: true,
    bottomLink: { text: "建立帳戶", to: "/register" },
    footerLink: null,
  },
  "simple-login": {
    title: "登入",
    subtitle: null,
    fields: [
      { name: "account", label: "帳號", type: "text", required: true },
      { name: "password", label: "密碼", type: "password", required: true },
    ],
    rememberMe: true,
    forgotPassword: false,
    submitLabel: "登入",
    socialDividerText: null,
    socialButtons: ["google", "apple"],
    bottomDivider: true,
    bottomLink: null,
    footerLink: { text: "忘記密碼？", to: "/forgot-password" },
  },
};

type AuthPageProps = {
  variant?: AuthVariant;
};

type AuthFormData = {
  name: string;
  account: string;
  password: string;
};

const AuthPage = ({ variant = "login" }: AuthPageProps) => {
  const navigate = useNavigate();
  const config = PAGE_CONFIG[variant] || PAGE_CONFIG.login;
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<AuthFormData>({
    name: "",
    account: "",
    password: "",
  });

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const validateForm = () => {
    for (const field of config.fields) {
      if (field.required && !formData[field.name]?.trim()) {
        setError(`${field.label}為必填項`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      if (variant === "register") {
        await AuthService.register(
          formData.account,
          `${formData.account}@example.com`,
          formData.password,
          formData.name,
          "",
          "",
          "",
          "",
          ""
        );
        navigate("/login");
      } else {
        const response = await AuthService.login(formData.account, formData.password);
        login({
          token: response.token ?? "",
          roles: response.roles ?? [],
        });
        navigate("/");
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "操作失敗，請稍後再試";
      setError(errorMessage);
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = () => (
    <button
      type="button"
      className="auth__eye-btn"
      onClick={() => setShowPassword(!showPassword)}
      aria-label={showPassword ? "隱藏密碼" : "顯示密碼"}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </button>
  );

  return (
    <div className="auth">
      <button className="auth__back-btn" onClick={handleGoBack} aria-label="返回">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <Header variant="auth" />

      <main className="auth__main">
        <div className="auth__container">
          <div className="auth__heading">
            <h1 className="auth__title">{config.title}</h1>
            {config.subtitle && <p className="auth__subtitle">{config.subtitle}</p>}
          </div>

          <form className="auth__form" onSubmit={handleSubmit}>
            {error && <div className="auth__error-message">{error}</div>}

            {config.fields.map((field) => (
              <div key={field.name} className="auth__field">
                <label className="auth__label">{field.label}</label>
                <div className="auth__input-wrapper">
                  <input
                    className="auth__input"
                    type={field.type === "password" ? (showPassword ? "text" : "password") : field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    disabled={loading}
                    required={field.required}
                  />
                  {field.type === "password" && <EyeIcon />}
                </div>
              </div>
            ))}

            {(config.rememberMe || config.forgotPassword) && (
              <div className="auth__options">
                {config.rememberMe && (
                  <label className="auth__checkbox-label">
                    <input
                      type="checkbox"
                      className="auth__checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>記住我</span>
                  </label>
                )}
                {config.forgotPassword && (
                  <Link to="/forgot-password" className="auth__forgot-link">
                    忘記密碼？
                  </Link>
                )}
              </div>
            )}

            <button
              type="submit"
              className={`auth__submit-btn ${variant === "simple-login" ? "auth__submit-btn-login" : ""}`}
              disabled={loading}
            >
              {loading ? "處理中..." : config.submitLabel}
            </button>

            {config.socialDividerText && (
              <div className="auth__social-divider">
                <span className="auth__social-divider-line" />
                <span className="auth__social-divider-text">{config.socialDividerText}</span>
              </div>
            )}

            {config.socialButtons.length > 0 && (
              <div className="auth__social-btns">
                {config.socialButtons.includes("google") && (
                  <button type="button" className="auth__social-btn">
                    使用Google帳號登入
                  </button>
                )}
                {config.socialButtons.includes("apple") && (
                  <button type="button" className="auth__social-btn">
                    使用Apple帳號登入
                  </button>
                )}
              </div>
            )}

            {config.bottomDivider && <hr className="auth__divider" />}

            {config.bottomLink && (
              <div className="auth__bottom-link-wrapper">
                <Link to={config.bottomLink.to} className="auth__bottom-link">
                  {config.bottomLink.text}
                </Link>
              </div>
            )}

            {config.footerLink && (
              <div className="auth__footer-link-wrapper">
                <Link to={config.footerLink.to} className="auth__footer-link">
                  {config.footerLink.text}
                </Link>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
