export default function Header() {
  return (
    <main>
    {/* Header of the page with the title "Inventory Management" */}
      <div className="bg-white">
      <header className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="mt-2 text-gray-600">Manage and track your global product catalogue across all categories. </p>
        </div>
      <button className="rounded-lg bg-violet-600 px-5 py-2.5 text-white font-medium hover:bg-violet-700 transition"> + Add Product</button>
      </header>
      </div>
      </main>
       );
}