import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { HOME_FOOTER_CATEGORY_LINKS, HOME_FOOTER_SERVICE_LINKS } from "@/constants/homeContent";

const Footer = () => (
  <footer className="site-footer">
    <div className="site-footer__container">
      <div className="site-footer__grid">
        <div>
          <Link to={ROUTES.HOME} className="site-footer__brand-link">
            <Heart className="site-header__logo-icon" />
            <span className="site-footer__brand-text">Fashion Elegance</span>
          </Link>
          <p className="site-footer__desc">探索最新時尚潮流，發現屬於你的獨特風格。</p>
        </div>

        <div>
          <h3 className="site-footer__col-title">商品分類</h3>
          <ul className="site-footer__links">
            {HOME_FOOTER_CATEGORY_LINKS.map((item) => (
              <li key={item.label}>
                <Link to={item.path}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="site-footer__col-title">客戶服務</h3>
          <ul className="site-footer__links">
            {HOME_FOOTER_SERVICE_LINKS.map((item) => (
              <li key={item.label}>
                {"path" in item ? <Link to={item.path}>{item.label}</Link> : <a href={item.href}>{item.label}</a>}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="site-footer__col-title">聯絡資訊</h3>
          <ul className="site-footer__links">
            <li>台北市中山區市民大道100號</li>
            <li>電話：02-1234-5678</li>
            <li>客服專線：0800-123-456</li>
            <li>Email：service@fashionelegance.com</li>
            <li>營業時間：週一至週六 10:00 - 19:00</li>
          </ul>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p className="site-footer__copy">© 2026 Fashion Elegance. All rights reserved.</p>
        <div className="site-footer__social">
          <SocialLink href="https://www.instagram.com/" label="Instagram">
            <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.25-2.25a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
          </SocialLink>
          <SocialLink href="https://www.facebook.com/" label="Facebook">
            <path d="M14 8h2.5V5.25C16.5 3.45 15.05 2 12.75 2h-2.5C7.7 2 5 4.7 5 8.25V11H2v4h3v9h4v-9h3.5l.5-4H9v-2.25c0-1.1.9-2 2.25-2H14z" />
          </SocialLink>
          <SocialLink href="https://www.youtube.com/" label="Youtube">
            <path d="M21.8 8.001a2.75 2.75 0 0 0-1.94-1.94C18.2 5.5 12 5.5 12 5.5s-6.2 0-7.86.561A2.75 2.75 0 0 0 2.2 8.001 28.9 28.9 0 0 0 1.5 12a28.9 28.9 0 0 0 .7 3.999 2.75 2.75 0 0 0 1.94 1.94C5.8 18.5 12 18.5 12 18.5s6.2 0 7.86-.561a2.75 2.75 0 0 0 1.94-1.94A28.9 28.9 0 0 0 22.5 12a28.9 28.9 0 0 0-.7-3.999zM10 15.25V8.75L15.5 12 10 15.25z" />
          </SocialLink>
        </div>
      </div>
    </div>
  </footer>
);

const SocialLink = ({ href, label, children }: { href: string; label: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      {children}
    </svg>
  </a>
);

export default Footer;
