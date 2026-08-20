import type { Product } from "@/app/types";

interface ProductRowProps {
  product: Product;
}

function getStockStatus(stock: number) {
  if (stock === 0) {
    return {
      label: "Out of Stock",
      className: "stock-status stock-status--out",
    };
  }

  if (stock <= 10) {
    return {
      label: "Low Stock",
      className: "stock-status stock-status--low",
    };
  }

  return {
    label: "In Stock",
    className: "stock-status stock-status--in",
  };
}

export default function ProductRow({ product }: ProductRowProps) {
  const stock = product.stock ?? 0;
  const stockStatus = getStockStatus(stock);

  return (
    <tr className="product-row">
      <td className="product-row__title-cell">
        <div className="product-row__product">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="product-row__image"
          />

          <div className="product-row__title-content">
            <span className="product-row__title">{product.title}</span>

            <span className="product-row__sku">
              SKU: {product.sku ?? "Not available"}
            </span>
          </div>
        </div>
      </td>

      <td>{product.brand ?? "Unknown brand"}</td>

      <td>{product.category?.name ?? "Uncategorized"}</td>

      <td>
        <span className={stockStatus.className}>
          {stockStatus.label} <span>({stock})</span>
        </span>
      </td>

      <td className="product-row__price">${product.price.toFixed(2)}</td>

      <td>
        <div className="product-row__actions">
          <button
            type="button"
            className="product-row__action-button"
            aria-label={`Delete ${product.title}`}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="product-row__action-icon"
            >
              <path
                d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            type="button"
            className="product-row__action-button"
            aria-label={`Edit ${product.title}`}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="product-row__action-icon"
            >
              <path
                d="m4 20 4.2-1 10.6-10.6a2 2 0 0 0-2.8-2.8L5.4 16.2 4 20Zm10.5-12.9 2.8 2.8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}
