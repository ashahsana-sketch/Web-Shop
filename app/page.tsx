import type { ProductsResponse } from "./types";
import Header from "./components/Header/Header";
import SummaryCards from "./components/Summary-card/SummaryCard";
import SearchBar from "./components/SearchBar";

const API_URL = "http://localhost:4000";
const defaultLimit = "6";

export default async function Home() {

  // we use the fetch() method to get the products from the API
  // in this fetch we sort using _sort and _order and we limit the number of products using _limit
  // we also use _expand to get the relational category data
  // we can use the other destructed variables like page, total and so on to create pagination or show info
  //fetching data from the API and destructuring the response to get the products, total, page, pages and limit
  const { products, total, page, pages, limit }: ProductsResponse = await fetch(
    `${API_URL}/products/?_limit=${defaultLimit}&_sort=id&_order=desc&_expand=category`,
  ).then((res) => res.json());
  //total instock products 
  const inStock = products.filter((product) => product.stock ?? 0 > 0).length;
//total low stock products 
 const lowStock = products.filter((product) => (product.stock ?? 0) > 0 && (product.stock ?? 0) <= 10).length;
//total out of stock products
  const outOfStock = products.filter((product) => (product.stock ?? 0) === 0).length;


console.log(products);

  return (
    <main>
      <Header /> {/* calling the Header component to display the header of the page */}
     {/* calling the SummaryCards component to display the summary cards of the page */}
     <SummaryCards
        total={total}
        inStock={inStock}
        lowStock={lowStock}
        outOfStock={outOfStock}
      />

      <div>
        {products.map((product) => (
          <h2 key={product.id}>
            {product.title} - {product.category?.name}
          </h2>
        ))}
      </div>
      <div>{products.map((product) => <h2 key={product.id}>{product.title} - {product.category?.name}</h2>)}</div>
    </main>
  );
}