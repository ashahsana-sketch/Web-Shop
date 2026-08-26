import type { Category, Product, ProductsResponse } from "./types";
import Header from "./components/Header/Header";
import SummaryCards from "./components/Summary-card/SummaryCard";
import SearchBar from "./components/SearchBar";
import ProductTable from "./components/ProductTable";
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
  const categoryId = params.categoryId;
  const stock = params.stock;

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

  // Perform manual pagination in memory
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedProducts = allProducts.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <main>
      <Header />
      <SummaryCards
        total={allProducts.length}
        inStock={inStock}
        lowStock={lowStock}
        outOfStock={outOfStock}
      />
      <SearchBar categories={categories} />
      <div className="page-container">
        <ProductTable
          products={paginatedProducts}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={total}
          pageSize={PAGE_SIZE}
        />
      </div>
    </main>
  );
}