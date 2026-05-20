type SectionHeadingProps = {
  kicker?: string;
  title: string;
  align?: "left" | "center";
  className?: string;
};

const SectionHeading = ({ kicker, title, align = "left", className = "" }: SectionHeadingProps) => (
  <header
    className={`home__heading${align === "center" ? " home__heading--center" : ""}${className ? ` ${className}` : ""}`}
  >
    {kicker ? <p className="home__heading-kicker">{kicker}</p> : null}
    <h2 className="home__heading-title">{title}</h2>
  </header>
);

export default SectionHeading;
