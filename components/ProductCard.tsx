import type { Product } from "@/app/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <img
        src={product.thumbnail}
        alt={product.title}
        className="product-card__image"
      />

      <div className="product-card__content">
        <p className="product-card__category">
          {product.category?.name ?? "Uncategorized"}
        </p>

        <h2 className="product-card__title">{product.title}</h2>

        <p className="product-card__description">{product.description}</p>

        <p className="product-card__price">${product.price.toFixed(2)}</p>

        <div className="product-card__actions">
          <button type="button" className="product-card__edit-button">
            Edit
          </button>

          <button type="button" className="product-card__delete-button">
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
