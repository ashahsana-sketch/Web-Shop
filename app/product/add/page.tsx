// import AddProduct from "../../components/Header/addProduct/AddProduct";

// export default function AddProductPage() {
//   return (
//     <main>
//       <AddProduct />
//     </main>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Category, ProductFormData } from "@/app/types/product";
import { INITIAL_CATEGORIES } from "@/app/components/utils/catogaries";
import { fetchNextProductId, createProduct } from "@/app/services/api";
import { ProductFormInputs } from "@/app/components/Header/addProduct/productFormInputs";

const initialFormState: ProductFormData = {
  title: "",
  brand: "",
  price: "",
  stock: "",
  weight: "",
  sku: "",
  imageUrl: "",
  rating: "",
  tags: "",
  warrantyInfo: "1 week warranty",
  categoryId: "1",
};

export default function AddProductPage() {
  const router = useRouter(); // userouter used to navigate back to the home page after adding a product
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);// usestate used to store the categories for the product form
  const [formData, setFormData] = useState<ProductFormData>(initialFormState);
  const [nextId, setNextId] = useState<number | string>("Loading...");
  const [lastSavedId, setLastSavedId] = useState<number | string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { // use effect used to fetch the next product id from the api when the component mounts
    fetchNextProductId()
      .then(setNextId) // if fetchNextProductId is successful, set the nextId state to the fetched id
      .catch(() => setNextId("Error fetching ID")); // if fetchNextProductId fails, set the nextId state to an error message
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> // this line shows that the handleChange function is used to handle changes in the form inputs, and it takes an event of type React.ChangeEvent<HTMLInputElement | HTMLSelectElement> as an argument
  ) => { //arrow function used to handle changes in the form inputs, and it takes an event of type React.ChangeEvent<HTMLInputElement | HTMLSelectElement> as an argument
    const { id, value } = e.target; // means that the function will extract the id and value properties from the event target, which is the input element that triggered the change event.
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (id === "title" && lastSavedId) setLastSavedId(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter a product title");
      return;
    }

    setLoading(true);
    try {
      const createdProduct = await createProduct(formData);
      setLastSavedId(createdProduct.id);
      setNextId(Number(createdProduct.id) + 1);
      setFormData(initialFormState);
    } catch (error: any) {
      alert(`Could not add product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md border border-gray-100 my-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {lastSavedId && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 font-medium">
            ✅ Product <strong>#{lastSavedId}</strong> was added successfully!
          </div>
        )}

        <div className="p-3 bg-violet-50 border border-violet-200 rounded-lg flex justify-between items-center">
          <span className="font-semibold text-violet-900"> Assigned ID for New Product: </span>
          <span className="font-bold text-violet-700 text-lg">#{nextId}</span>
        </div>

        <ProductFormInputs  formData={formData}  categories={categories}  onChange={handleChange}/>

        <div className="flex gap-4 pt-2">
          <button type="button"onClick={() => router.push("/")} className="w-1/2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-gray-700 hover:bg-gray-50 font-medium transition-colors">
            Cancel / Back</button>
          <button type="submit" disabled={loading}  className="w-1/2 rounded-lg bg-violet-600 px-5 py-2.5 text-white hover:bg-violet-700 disabled:opacity-50 font-medium transition-colors" >
            {loading ? "Saving..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}