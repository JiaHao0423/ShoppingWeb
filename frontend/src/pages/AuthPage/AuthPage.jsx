import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/layout/Header/Header.jsx';
import './AuthPage.scss';

// ==================== 頁面設定 ====================

const PAGE_CONFIG = {
    register: {
        title: '建立新帳戶',
        subtitle: '請輸入真實資料',
        fields: [
            { name: 'name', label: '姓名', type: 'text' },
            { name: 'account', label: '帳號', type: 'text' },
            { name: 'password', label: '密碼', type: 'password' },
        ],
        rememberMe: true,
        forgotPassword: false,
        submitLabel: '註冊',
        socialDividerText: null,
        socialButtons: ['google', 'apple'],
        bottomDivider: true,
        bottomLink: null,
        footerLink: { text: '忘記密碼？', to: '/forgot-password' },
    },
    login: {
        title: '歡迎回來！',
        subtitle: null,
        fields: [
            { name: 'account', label: '帳號', type: 'text' },
            { name: 'password', label: '密碼', type: 'password' },
        ],
        rememberMe: true,
        forgotPassword: true,
        submitLabel: '登入',
        socialDividerText: '使用以下方式快速登入',
        socialButtons: ['google', 'apple'],
        bottomDivider: true,
        bottomLink: { text: '建立帳戶', to: '/register' },
        footerLink: null,
    },
    'simple-login': {
        title: '登入',
        subtitle: null,
        fields: [
            { name: 'account', label: '帳號', type: 'text' },
            { name: 'password', label: '密碼', type: 'password' },
        ],
        rememberMe: true,
        forgotPassword: false,
        submitLabel: '登入',
        socialDividerText: null,
        socialButtons: ['google', 'apple'],
        bottomDivider: true,
        bottomLink: null,
        footerLink: { text: '忘記密碼？', to: '/forgot-password' },
    },
};

// ==================== 主組件 ====================

const AuthPage = ({ variant = 'login' }) => {
    const navigate = useNavigate();
    const config = PAGE_CONFIG[variant] || PAGE_CONFIG.login;

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleGoBack = () => navigate(-1);

    // 密碼眼睛圖標
    const EyeIcon = () => (
        <button
            type="button"
            className="auth__eye-btn"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? '隱藏密碼' : '顯示密碼'}
        >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        </button>
    );

    return (
        <div className="auth">

            {/* ── 行動版返回按鈕 ── */}
            <button className="auth__back-btn" onClick={handleGoBack} aria-label="返回">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
            </button>

            {/* ── 桌面版 Header ── */}
            <Header variant="auth" />

            {/* ── 主內容 ── */}
            <main className="auth__main">
                <div className="auth__container">

                    {/* 左側標題區 */}
                    <div className="auth__heading">
                        <h1 className="auth__title">{config.title}</h1>
                        {config.subtitle && (
                            <p className="auth__subtitle">{config.subtitle}</p>
                        )}
                    </div>

                    {/* 右側表單區 */}
                    <form className="auth__form" onSubmit={(e) => e.preventDefault()}>

                        {/* 動態欄位 */}
                        {config.fields.map((field) => (
                            <div key={field.name} className="auth__field">
                                <label className="auth__label">{field.label}</label>
                                <div className="auth__input-wrapper">
                                    <input
                                        className="auth__input"
                                        type={field.type === 'password' ? (showPassword ? 'text' : 'password') : field.type}
                                        name={field.name}
                                    />
                                    {field.type === 'password' && <EyeIcon />}
                                </div>
                            </div>
                        ))}

                        {/* 記住我 + 忘記密碼 */}
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
                                    <Link to="/forgot-password" className="auth__forgot-link">忘記密碼？</Link>
                                )}
                            </div>
                        )}

                        {/* 主按鈕 */}
                        <button type="submit" className={`auth__submit-btn ${variant === 'simple-login' ? 'auth__submit-btn-login' : ''}`}>
                            {config.submitLabel}
                        </button>

                        {/* 第三方登入分隔文字 */}
                        {config.socialDividerText && (
                            <div className="auth__social-divider">
                                <span className="auth__social-divider-line" />
                                <span className="auth__social-divider-text">{config.socialDividerText}</span>
                            </div>
                        )}

                        {/* 第三方登入按鈕 */}
                        {config.socialButtons.length > 0 && (
                            <div className="auth__social-btns">
                                {config.socialButtons.includes('google') && (
                                    <button type="button" className="auth__social-btn">使用Google帳號登入</button>
                                )}
                                {config.socialButtons.includes('apple') && (
                                    <button type="button" className="auth__social-btn">使用Apple帳號登入</button>
                                )}
                            </div>
                        )}

                        {/* 底部分隔線 */}
                        {config.bottomDivider && <hr className="auth__divider" />}

                        {/* 底部連結（如「建立帳戶」） */}
                        {config.bottomLink && (
                            <div className="auth__bottom-link-wrapper">
                                <Link to={config.bottomLink.to} className="auth__bottom-link">
                                    {config.bottomLink.text}
                                </Link>
                            </div>
                        )}

                        {/* 頁尾連結（如「忘記密碼？」） */}
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