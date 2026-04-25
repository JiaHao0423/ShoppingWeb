import clsx from "clsx";

type HamburgerButtonProps = {
  isOpen: boolean;
  isSearchPage: boolean;
  onClick: () => void;
};

const HamburgerButton = ({ isOpen, isSearchPage, onClick }: HamburgerButtonProps) => {
  const buttonClass = clsx("header__hamburger", {
    "header__hamburger--active": isOpen,
    "header__hamburger--search": isSearchPage,
  });

  const lineClass = clsx("header__hamburger-line", {
    "header__hamburger-line--white": isOpen,
  });

  return (
    <button className={buttonClass} onClick={onClick} aria-label="切換選單" aria-expanded={isOpen} type="button">
      <span className={lineClass} />
      <span className={lineClass} />
      <span className={lineClass} />
    </button>
  );
};

export default HamburgerButton;
