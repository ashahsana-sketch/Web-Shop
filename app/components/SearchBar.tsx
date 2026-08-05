export default function SearchBar() {
  return (
    <div className="my-4 flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <input
        type="text"
        placeholder="Search products..."
        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-400"
      />

      <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
        <option>All Categories</option>
      </select>

      <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
        <option>All Stock</option>
      </select>

      <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm">
        Filter
      </button>
    </div>
  );
}