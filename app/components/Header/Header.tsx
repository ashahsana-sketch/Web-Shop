export default function Header() {
  return (
    <main>
    {/* Header of the page with the title "Inventory Management" */}
      <div className="bg-white m-4 shadow-md p-4 lg:mx-auto">
      <header className="container md:flex  md:py-5 lg:py-2 lg:p-2 justify-between">
        <div className="flex flex-col justify-center">
          <h1 className="md:text-3xl text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className=" py-4 text-gray-600 wrap-break">Manage and track your global product catalogue across all categories. </p>
        </div>
      <button className="shrink-0 rounded-lg px-4 bg-violet-600 sm:mt-4 text-white font-medium hover:bg-violet-700"> + Add Product</button>
      </header>
      </div>
      </main>
       );
}