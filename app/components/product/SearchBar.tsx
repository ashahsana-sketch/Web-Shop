import { Filter } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="page-container">
      <div
        role="search"
        className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center"
      >
        <label htmlFor="product-search" className="sr-only">
          Search products
        </label>
        <input
          id="product-search"
          type="text"
          placeholder="Search products..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-400"
        />

        <label htmlFor="category-filter" className="sr-only">
          Filter by category
        </label>
        <select
          id="category-filter"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          {/*Found the categories in localhost:4000/categories, it's hardcoded for now.*/}
          <option>All Categories</option>
          <option>Beauty</option>
          <option>Fragrances</option>
          <option>Furniture</option>
          <option>Groceries</option>
          <option>Home Decoration</option>
          <option>Kitchen Accessories</option>
          <option>Laptops</option>
          <option>Men's Shirts</option>
          <option>Men's Shoes</option>
          <option>Men's Watches</option>
          <option>Mobile Accessories</option>
          <option>Motorcycle</option>
          <option>Skin Care</option>
          <option>Smartphones</option>
          <option>Sports Accessories</option>
          <option>Sunglasses</option>
          <option>Tablets</option>
          <option>Tops</option>
          <option>Vehicle</option>
          <option>Women's Bags</option>
          <option>Women's Dresses</option>
          <option>Women's Jewellery</option>
          <option>Women's Shoes</option>
          <option>Women's Watches</option>
        </select>

        <label htmlFor="stock-filter" className="sr-only">
          Filter by stock status
        </label>
        <select
          id="stock-filter"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <option>All Stock</option>
          <option>In Stock</option>
          <option>Low Stock</option>
          <option>Out of Stock</option>
        </select>

        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          {/*I filled it with fill="currentColor" to get closer to the solid funnel icon in the mockup*/}
          <Filter size={16} fill="currentColor" aria-hidden="true" />
          Filter
        </button>
      </div>
    </div>
  );
}
