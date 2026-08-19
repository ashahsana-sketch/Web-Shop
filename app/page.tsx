import ProductCard from "@/components/ProductCard";
import type { ProductsResponse } from "./types";
import Header from "./components/Header/Header";
import SummaryCards from "./components/Summary-card/SummaryCard";
import SearchBar from "./components/SearchBar";
import { Pagination } from "./components/Pagination/Pagination";

const API_URL = "http://localhost:4000";
const defaultLimit = "6";

interface HomeProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const currentPage = Number(params.page ?? 1);

  // we use the fetch() method to get the products from the API
  // in this fetch we sort using _sort and _order and we limit the number of products using _limit
  // we also use _expand to get the relational category data
  // we can use the other destructed variables like page, total and so on to create pagination or show info
  //fetching data from the API and destructuring the response to get the products, total, page, pages and limit
  const { products, total, page, pages, limit }: ProductsResponse = await fetch(
    `${API_URL}/products?_page=${currentPage}&_limit=${defaultLimit}&_sort=id&_order=desc&_expand=category`,
  ).then((res) => res.json());
  //total instock products
  const inStock = products.filter((product) => product.stock ?? 0 > 0).length;
  //total low stock products
  const lowStock = products.filter(
    (product) => (product.stock ?? 0) > 0 && (product.stock ?? 0) <= 10,
  ).length;
  //total out of stock products
  const outOfStock = products.filter(
    (product) => (product.stock ?? 0) === 0,
  ).length;

  // console.log(products);

  return (
    <main>
       <Header />
      
        {/* calling the Header component to display the header of the page */}
        {/* calling the SummaryCards component to display the summary cards of the page */}
        <SummaryCards
          total={total}
          inStock={inStock}
          lowStock={lowStock}
          outOfStock={outOfStock}
        />
        <SearchBar />
        <div className="page-container">
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
                <ProductCard key={product.id} product={product} />
              ))}
            </tbody>
            <tfoot className="pagination-footer">
              <tr>
                <td colSpan={6}>
                  <Pagination
                    currentPage={page}
                    totalPages={pages}
                    totalItems={total}
                    pageSize={limit}
                  />
                </td>
              </tr>
            </tfoot>
          </table>
        </section>
      </div>
    </main>
  );
}
