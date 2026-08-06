import { Filter } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="my-4 flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <input
        type="text"
        placeholder="Search products..."
        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-400"
      />

      <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
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

      <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
        <option>All Stock</option>
        <option>In Stock</option>
        <option>Low Stock</option>
        <option>Out of Stock</option>
      </select>

      <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm">
        {/*I filled it with fill="currentColor" to get closer to the solid funnel icon in the mockup*/}
        <Filter size={16} fill="currentColor"/>
        Filter
      </button>
    </div>
  );
}