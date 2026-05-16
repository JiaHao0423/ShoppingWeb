type SectionHeadingProps = {
  label: string;
  title: string;
  className?: string;
};

const SectionHeading = ({ label, title, className = "" }: SectionHeadingProps) => (
  <header className={`home__heading${className ? ` ${className}` : ""}`}>
    <span className="home__heading-label">{label}</span>
    <h2 className="home__heading-title">{title}</h2>
  </header>
);

export default SectionHeading;
