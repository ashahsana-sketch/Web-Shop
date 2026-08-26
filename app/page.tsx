import type { Product, ProductsResponse } from "./types";
import Header from "./components/Header/Header";
import SummaryCards from "./components/Summary-card/SummaryCard";
import SearchBar from "./components/SearchBar";
import ProductTable from "./components/ProductTable";
const defaultLimit = "6";

const API_URL = "http://localhost:4000";
const PAGE_SIZE = 6;

interface HomeProps {
  searchParams: Promise<{ page?: string ;categoryId?: string;
    stock?: string;}>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const currentPage = Number(params.page ?? 1);
   const categoryId = params.categoryId;
  const stock = params.stock;
 //we use the fetch() method to get the products from the API
  // in this fetch we sort using _sort and _order and we limit the number of products using _limit
  // we also use _expand to get the relational category data
  // we can use the other destructed variables like page, total and so on to create pagination or show info
  //fetching data from the API and destructuring the response to get the products, total, page, pages and limit
  const categoryFilter = categoryId ? `&categoryId=${categoryId}` : "";
  let stockFilter = "";

  if (stock === "in") {
    stockFilter = "&stock_gte=11";
  }

  if (stock === "low") {
    stockFilter = "&stock_gte=1&stock_lte=10";
  }

  if (stock === "out") {
    stockFilter = "&stock=0";
  }
   const { products, page, pages, limit }: ProductsResponse = await fetch(
    `http://localhost:4000/products?_page=${currentPage}&_limit=${defaultLimit}&_sort=id&_order=desc&_expand=category${categoryFilter}${stockFilter}`,
  ).then((res) => res.json());

  // const allProductsResponse: { products: Product[] } = await fetch(
  //   "http://localhost:4000/products?_limit=1000&_expand=category",
  // ).then((res) => res.json());

  // const allProducts = allProductsResponse.products;
  // const inStock = allProducts.filter(
  //   (product) => (product.stock ?? 0) > 10,
  // ).length;

  // const lowStock = allProducts.filter((product) => {
  //   const stock = product.stock ?? 0;

  //   return stock > 0 && stock <= 10;
  // }).length;

  // const outOfStock = allProducts.filter(
  //   (product) => (product.stock ?? 0) === 0,
  // ).length;

  // const categories: Category[] = await fetch(
  //   "http://localhost:4000/categories",
  // ).then((res) => res.json());

  // Single fetch call with Next.js Time-Based Revalidation (caches for 60 seconds)
  const response = await fetch(
    `${API_URL}/products?_sort=id&_order=desc&_expand=category`,
    {
      next: { revalidate: 60, tags: ["products"] },
    }
  )
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    })
    .then((data) => (Array.isArray(data) ? data : data.products ?? []))
    .catch(() => []);

  const allProducts = Array.isArray(response) ? response : [];

  // Calculate summary metrics from cached full dataset
  const total = allProducts.length;
  const inStock = allProducts.filter((p: any) => (p.stock ?? 0) > 10).length;
  const lowStock = allProducts.filter( (p: any) => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 10 ).length;
  const outOfStock = allProducts.filter((p: any) => (p.stock ?? 0) === 0).length;

  // Perform manual pagination in memory
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedProducts = allProducts.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <main>
      <Header />
      <SummaryCards
        total={total}
        inStock={inStock}
        lowStock={lowStock}
        outOfStock={outOfStock}
      />
      <SearchBar />
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