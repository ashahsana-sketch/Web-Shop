import type { Category, Product, ProductsResponse } from "./types";
import Header from "./components/Header/Header";
import SummaryCards from "./components/Summary-card/SummaryCard";
import SearchBar from "./components/SearchBar/SearchBar";
import ProductTable from "./components/product/ProductTable";
const defaultLimit = "6";

interface HomeProps {
  searchParams: Promise<{
    page?: string;
    categoryId?: string;
    stock?: string;
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

  const { products, total, page, pages, limit }: ProductsResponse = await fetch(
    `http://localhost:4000/products?_page=${currentPage}&_limit=${defaultLimit}&_sort=id&_order=desc&_expand=category${categoryFilter}${stockFilter}`,
  ).then((res) => res.json());

  const allProductsResponse: { products: Product[] } = await fetch(
    "http://localhost:4000/products?_limit=1000&_expand=category",
  ).then((res) => res.json());

  const allProducts = allProductsResponse.products;
  const inStock = allProducts.filter(
    (product) => (product.stock ?? 0) > 10,
  ).length;

  const lowStock = allProducts.filter((product) => {
    const stock = product.stock ?? 0;

    return stock > 0 && stock <= 10;
  }).length;

  const outOfStock = allProducts.filter(
    (product) => (product.stock ?? 0) === 0,
  ).length;

  const categories: Category[] = await fetch(
    "http://localhost:4000/categories",
  ).then((res) => res.json());

  return (
    <main>
      <Header />
      {/* calling the Header component to display the header of the page */}
      {/* calling the SummaryCards component to display the summary cards of the page */}
      <SummaryCards
        total={allProducts.length}
        inStock={inStock}
        lowStock={lowStock}
        outOfStock={outOfStock}
      />
      <SearchBar categories={categories} />
      <div className="page-container">
        <ProductTable
          products={products}
          currentPage={page}
          totalPages={pages}
          totalItems={total}
          pageSize={limit}
        />
      </div>
    </main>
  );
}
