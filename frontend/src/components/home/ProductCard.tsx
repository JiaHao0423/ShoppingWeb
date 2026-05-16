import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ProductSectionItem } from "@/components/productSection/ProductSection";

type ProductCardProps = {
  product: ProductSectionItem;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const imageSrc = product.imageUrl || product.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop";

  const goToProduct = () => navigate(`/product/${product.id}`);

  return (
    <article className="home__product">
      <div className="home__product-media">
        <button type="button" className="home__product-img-btn" onClick={goToProduct} aria-label={product.name}>
          <img src={imageSrc} alt={product.name} className="home__product-img" loading="lazy" />
        </button>
        <div className="home__product-gradient" />
        <button type="button" className="home__product-wish" aria-label="加入願望清單">
          <Heart />
        </button>
        <button type="button" onClick={goToProduct} className="home__product-cart-btn">
          加入購物車
        </button>
      </div>
      <h3 className="home__product-name">{product.name}</h3>
      <p className="home__product-price">$${product.price}</p>
    </article>
  );
};

export default ProductCard;
