import { useNavigate } from "react-router-dom";
import type { ProductSectionItem } from "@/components/productSection/ProductSection";
import { resolveProductImageUrl } from "@/constants/unsplashImages";

type ProductCardProps = {
  product: ProductSectionItem;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const imageSrc = resolveProductImageUrl(product.imageUrl || product.image, product.id);

  const goToProduct = () => navigate(`/product/${product.id}`);

  return (
    <article className="home__product">
      <div className="home__product-media">
        <button type="button" className="home__product-img-btn" onClick={goToProduct} aria-label={product.name}>
          <img src={imageSrc} alt={product.name} className="home__product-img" loading="lazy" />
        </button>
      </div>
      <h3 className="home__product-name">{product.name}</h3>
      <p className="home__product-price">NT$ {product.price.toLocaleString()}</p>
      <button type="button" className="home__product-link" onClick={goToProduct}>
        查看商品
      </button>
    </article>
  );
};

export default ProductCard;
