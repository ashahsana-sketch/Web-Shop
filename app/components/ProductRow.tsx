import type { Product } from "@/app/types";
import { productTableColumns } from "./productTableColumns";

interface ProductRowProps {
  product: Product;
}

function getStockStatus(stock: number) {
  if (stock === 0) {
    return {
      label: "Out of Stock",
      className: "text-[#ff293d]",
    };
  }

  if (stock <= 10) {
    return {
      label: "Low Stock",
      className: "text-[#e86900]",
    };
  }

  return {
    label: "In Stock",
    className: "text-[#00a63e]",
  };
}

const tdBase =
  "border-b border-[#e5e5e5] px-3.5 py-2.5 align-middle text-sm text-[#111111] max-md:px-2.5 max-md:py-3";

export default function ProductRow({ product }: ProductRowProps) {
  const stock = product.stock ?? 0;
  const stockStatus = getStockStatus(stock);

  return (
    <tr className="hover:bg-[#fafafa]">
      <td
        className={`${tdBase} ${productTableColumns.title} whitespace-nowrap max-md:whitespace-normal`}
      >
        <div className="flex items-center gap-3 max-md:gap-2.5">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="h-10.5 w-10.5 shrink-0 rounded border border-[#e5e5e5] bg-white object-contain max-md:h-11 max-md:w-11"
          />

          <div className="flex flex-col gap-0.75">
            <span className="whitespace-nowrap font-semibold text-[#111111] max-md:whitespace-normal max-md:leading-tight">
              {product.title}
            </span>

            <span className="text-xs text-[#8a8a8a]">
              SKU: {product.sku ?? "Not available"}
            </span>
          </div>
        </div>
      </td>

      <td
        className={`${tdBase} ${productTableColumns.brand} whitespace-nowrap`}
      >
        {product.brand ?? "Generic"}
      </td>

      <td
        className={`${tdBase} ${productTableColumns.category} whitespace-nowrap`}
      >
        {product.category?.name ?? "Uncategorized"}
      </td>

      <td
        className={`${tdBase} ${productTableColumns.stock} whitespace-nowrap`}
      >
        <span className={`font-medium whitespace-nowrap ${stockStatus.className}`}>
          {stockStatus.label} <span>({stock})</span>
        </span>
      </td>

      <td
        className={`${tdBase} ${productTableColumns.price} whitespace-nowrap font-semibold`}
      >
        ${product.price.toFixed(2)}
      </td>

      <td
        className={`${tdBase} ${productTableColumns.actions} whitespace-nowrap`}
      >
        <div className="flex items-center gap-3 max-md:justify-end max-md:gap-1">
          <button
            type="button"
            className="grid h-7 w-7 cursor-pointer place-items-center border-0 bg-transparent text-[#111111] hover:text-violet-700 max-md:h-6.5 max-md:w-6.5"
            aria-label={`Delete ${product.title}`}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5 max-md:h-4.5 max-md:w-4.5"
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
            className="grid h-7 w-7 cursor-pointer place-items-center border-0 bg-transparent text-[#111111] hover:text-violet-700 max-md:h-6.5 max-md:w-6.5"
            aria-label={`Edit ${product.title}`}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5 max-md:h-4.5 max-md:w-4.5"
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
