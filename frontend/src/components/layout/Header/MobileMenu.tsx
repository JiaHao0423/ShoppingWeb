import { useEffect } from "react";
import { X } from "lucide-react";
import { HOME_MOBILE_NAV_LINKS } from "@/constants/homeContent";

export type MobileMenuCategory = {
  id: string;
  name: string;
  items: Array<{ name: string; path: string }>;
};

type MobileMenuProps = {
  open: boolean;
  categories: MobileMenuCategory[];
  onClose: () => void;
  onItemClick: (path: string) => void;
};

const MobileMenu = ({ open, categories, onClose, onItemClick }: MobileMenuProps) => {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="site-drawer__backdrop" onClick={onClose} aria-hidden />
      <aside className="site-drawer__panel" aria-label="導覽選單">
        <div className="site-drawer__head">
          <button type="button" className="site-drawer__close" onClick={onClose} aria-label="關閉選單">
            <X />
          </button>
        </div>
        <nav className="site-drawer__nav">
          {HOME_MOBILE_NAV_LINKS.map((link) => (
            <button key={link.label} type="button" className="site-drawer__link" onClick={() => onItemClick(link.path)}>
              {link.label}
            </button>
          ))}
          {categories.length > 0 ? (
            <div className="site-drawer__group">
              {categories.map((group) => (
                <div key={group.id}>
                  <p className="site-drawer__group-title">{group.name}</p>
                  <ul className="site-drawer__group-list">
                    {group.items.map((item) => (
                      <li key={item.path}>
                        <button type="button" className="site-drawer__group-link" onClick={() => onItemClick(item.path)}>
                          {item.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : null}
        </nav>
      </aside>
    </>
  );
};

export default MobileMenu;
