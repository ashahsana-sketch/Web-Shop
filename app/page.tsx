import type { ProductsResponse } from "./types";
import Header from "./components/Header/Header";
import SummaryCards from "./components/Summary-card/SummaryCard";
import SearchBar from "./components/SearchBar";
import ProductTable from "./components/ProductTable";

const API_URL = "http://localhost:4000";
const PAGE_SIZE = 6;

interface HomeProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const currentPage = Number(params.page ?? 1);

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