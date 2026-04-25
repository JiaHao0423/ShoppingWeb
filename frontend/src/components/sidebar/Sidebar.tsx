import { useState } from "react";
import "./Siderbar.scss";

type TabKey = "category" | "color" | "size" | "price";

type ExpandedTabs = Record<TabKey, boolean>;

type FilterPayload = {
  category?: string;
  color?: string;
  size?: string;
  priceRange?: [number, number];
};

type SidebarProps = {
  onFilterChange?: (payload: FilterPayload) => void;
};

const Sidebar = ({ onFilterChange }: SidebarProps) => {
  const [expandedTabs, setExpandedTabs] = useState<ExpandedTabs>({
    category: true,
    color: false,
    size: false,
    price: true,
  });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([500, 1000]);

  const minPrice = 0;
  const maxPrice = 2000;

  const toggleTab = (tabName: TabKey) => {
    const isMobile = window.innerWidth <= 767;
    setExpandedTabs((prev) => {
      if (isMobile) {
        return {
          category: false,
          color: false,
          size: false,
          price: false,
          [tabName]: !prev[tabName],
        };
      }
      return {
        ...prev,
        [tabName]: !prev[tabName],
      };
    });
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    onFilterChange?.({ category: value });
  };

  const handleColorChange = (value: string) => {
    setSelectedColor(value);
    onFilterChange?.({ color: value });
  };

  const handleSizeChange = (value: string) => {
    setSelectedSize(value);
    onFilterChange?.({ size: value });
  };

  const handlePriceChange = (index: 0 | 1, value: string) => {
    const newRange: [number, number] = [...priceRange];
    newRange[index] = Number(value);

    if (index === 0 && newRange[0] > newRange[1]) {
      newRange[0] = newRange[1];
    }
    if (index === 1 && newRange[1] < newRange[0]) {
      newRange[1] = newRange[0];
    }

    setPriceRange(newRange);
    onFilterChange?.({ priceRange: newRange });
  };

  const leftPercent = ((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100;
  const rightPercent = ((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100;
  const isAnyTabOpen = Object.values(expandedTabs).some(Boolean);

  const categories = [
    { value: "tops", label: "上衣" },
    { value: "bottoms", label: "下身" },
    { value: "outerwear", label: "外套" },
    { value: "dresses", label: "連身裙" },
  ];

  const colors = [
    { value: "black", label: "黑色" },
    { value: "white", label: "白色" },
    { value: "red", label: "紅色" },
    { value: "blue", label: "藍色" },
    { value: "green", label: "綠色" },
  ];

  const sizes = [
    { value: "xs", label: "XS" },
    { value: "s", label: "S" },
    { value: "m", label: "M" },
    { value: "l", label: "L" },
    { value: "xl", label: "XL" },
  ];

  return (
    <>
      {isAnyTabOpen && <div className="sidebar__overlay" onClick={() => setExpandedTabs({ category: false, color: false, size: false, price: false })} />}
      <aside className="sidebar">
        <div className="sidebar__section">
          <button className={`sidebar__tab ${expandedTabs.category ? "sidebar__tab--active" : ""}`} onClick={() => toggleTab("category")}>
            <span className="sidebar__tab-title">類別</span>
            <svg className={`sidebar__tab-arrow ${expandedTabs.category ? "sidebar__tab-arrow--active" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>

          <div className={`sidebar__content ${expandedTabs.category ? "sidebar__content--open" : ""}`}>
            <div className="sidebar__options">
              {categories.map((cat) => (
                <label key={cat.value} className="sidebar__option">
                  <input
                    type="radio"
                    name="category"
                    value={cat.value}
                    checked={selectedCategory === cat.value}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="sidebar__radio"
                  />
                  <span className="sidebar__label">{cat.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="sidebar__section">
          <button className={`sidebar__tab ${expandedTabs.color ? "sidebar__tab--active" : ""}`} onClick={() => toggleTab("color")}>
            <span className="sidebar__tab-title">顏色</span>
            <svg className={`sidebar__tab-arrow ${expandedTabs.color ? "sidebar__tab-arrow--active" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>

          <div className={`sidebar__content ${expandedTabs.color ? "sidebar__content--open" : ""}`}>
            <div className="sidebar__options">
              {colors.map((color) => (
                <label key={color.value} className="sidebar__option">
                  <input
                    type="radio"
                    name="color"
                    value={color.value}
                    checked={selectedColor === color.value}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="sidebar__radio"
                  />
                  <span className="sidebar__label">{color.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="sidebar__section">
          <button className={`sidebar__tab ${expandedTabs.size ? "sidebar__tab--active" : ""}`} onClick={() => toggleTab("size")}>
            <span className="sidebar__tab-title">尺寸</span>
            <svg className={`sidebar__tab-arrow ${expandedTabs.size ? "sidebar__tab-arrow--active" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>

          <div className={`sidebar__content ${expandedTabs.size ? "sidebar__content--open" : ""}`}>
            <div className="sidebar__options">
              {sizes.map((size) => (
                <label key={size.value} className="sidebar__option">
                  <input
                    type="radio"
                    name="size"
                    value={size.value}
                    checked={selectedSize === size.value}
                    onChange={(e) => handleSizeChange(e.target.value)}
                    className="sidebar__radio"
                  />
                  <span className="sidebar__label">{size.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="sidebar__section">
          <button className={`sidebar__tab ${expandedTabs.price ? "sidebar__tab--active" : ""}`} onClick={() => toggleTab("price")}>
            <span className="sidebar__tab-title">價錢</span>
            <svg className={`sidebar__tab-arrow ${expandedTabs.price ? "sidebar__tab-arrow--active" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>

          <div className={`sidebar__content ${expandedTabs.price ? "sidebar__content--open" : ""}`}>
            <div className="sidebar__price-slider">
              <div className="sidebar__slider-wrapper">
                <div className="slider__track" />
                <div className="slider__range" style={{ left: `${leftPercent}%`, width: `${rightPercent - leftPercent}%` }} />
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  step="10"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(0, e.target.value)}
                  className="sidebar__range sidebar__range--min"
                />
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(1, e.target.value)}
                  className="sidebar__range sidebar__range--max"
                />
              </div>
              <div className="sidebar__price-display">價格區間：{priceRange[0]} - {priceRange[1]}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
