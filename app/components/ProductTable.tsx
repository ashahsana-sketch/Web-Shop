import type { Product } from "@/app/types";
import ProductRow from "./ProductRow";
import { Pagination } from "./Pagination/Pagination";

interface ProductTableProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export default function ProductTable({
  products,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
}: ProductTableProps) {
  return (
    <section className="products-table-section">
      <table className="products-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </tbody>
        <tfoot className="pagination-footer">
          <tr>
            <td colSpan={6}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={pageSize}
              />
            </td>
          </tr>
        </tfoot>
      </table>
    </section>
  );
}
