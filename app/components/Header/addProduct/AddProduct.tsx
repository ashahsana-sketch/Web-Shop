"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
}

// Helper to check for a valid URL structure
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export default function AddProduct() {
  const router = useRouter();

  // Categories state
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Beauty" },
    { id: 2, name: "Fragrances" },
    { id: 3, name: "Furniture" },
    { id: 4, name: "Groceries" },
    { id: 5, name: "Home Decoration" },
    { id: 6, name: "Kitchen Accessories" },
    { id: 7, name: "Laptops" },
    { id: 8, name: "Men's Shirts" },
    { id: 9, name: "Men's Shoes" },
    { id: 10, name: "Men's Watches" },
    { id: 11, name: "Mobile Accessories" },
    { id: 12, name: "Motorcycle" },
    { id: 13, name: "Skin Care" },
    { id: 14, name: "Smartphones" },
    { id: 15, name: "Sports Accessories" },
    { id: 16, name: "Sunglasses" },
    { id: 17, name: "Tablets" },
    { id: 18, name: "Tops" },
    { id: 19, name: "Vehicle" },
    { id: 20, name: "Women's Bags" },
    { id: 21, name: "Women's Dresses" },
    { id: 22, name: "Women's Jewellery" },
    { id: 23, name: "Women's Shoes" },
    { id: 24, name: "Women's Watches" },
  ]);

  // Form and ID states
  const [nextId, setNextId] = useState<number | string>("Loading...");
  const [lastSavedId, setLastSavedId] = useState<number | string | null>(null);
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [weight, setWeight] = useState("");
  const [sku, setSku] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [rating, setRating] = useState("");
  const [tags, setTags] = useState("");
  const [warrantyInfo, setWarrantyInfo] = useState("1 week warranty");
  const [categoryId, setCategoryId] = useState("1");
  const [loading, setLoading] = useState(false);

  // Fetch current products and derive the upcoming ID
  useEffect(() => {
    async function fetchNextId() {
      try {
        const response = await fetch("http://localhost:4000/products");
        if (!response.ok) {
          throw new Error(`Server returned status: ${response.status}`);
        }

        const data = await response.json();

        let productsList: any[] = [];
        if (Array.isArray(data)) {
          productsList = data;
        } else if (Array.isArray(data.data)) {
          productsList = data.data;
        } else if (typeof data === "object" && data !== null) {
          const possibleArray = Object.values(data).find((val) => Array.isArray(val));
          if (possibleArray) productsList = possibleArray as any[];
        }

        if (productsList.length > 0) {
          const numericIds = productsList
            .map((p) => parseInt(String(p.id), 10))
            .filter((id) => !isNaN(id));

          if (numericIds.length > 0) {
            const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
            setNextId(maxId + 1);
          } else {
            setNextId(productsList.length + 1);
          }
        } else {
          setNextId(1);
        }
      } catch (error) {
        console.error("Failed to fetch last ID:", error);
        setNextId("Error fetching ID");
      }
    }

    fetchNextId();
  }, []);

  // Optionally load updated categories list from API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("http://localhost:4000/categories");
        if (res.ok) {
          const data = await res.json();
          const fetchedCategories = Array.isArray(data) ? data : data.categories || [];
          if (fetchedCategories.length > 0) {
            setCategories(fetchedCategories);
          }
        }
      } catch (err) {
        console.error("Failed to load categories from API, using default list", err);
      }
    }
    fetchCategories();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a product title");
      return;
    }

    setLoading(true);

    try {
      const parsedTags = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // Validate image URL input safely
      const trimmedUrl = imageUrl.trim();
      const defaultImage = "https://picsum.photos/seed/picsum/200/300";
      const validImageUrl = isValidUrl(trimmedUrl) ? trimmedUrl : defaultImage;

      const payload = {
        title: title.trim(),
        brand: brand.trim() || "Generic",
        price: parseFloat(price) || 0,
        stock: parseInt(stock, 10) || 0,
        weight: parseFloat(weight) || 0,
        sku: sku.trim() || `SKU-${Date.now()}`,
        rating: parseFloat(rating) || 0,
        tags: parsedTags.length > 0 ? parsedTags : ["beauty"],
        warrantyInformation: warrantyInfo,
        categoryId: parseInt(categoryId, 10) || 1,
        description: "New product description",
        discountPercentage: 0,
        dimensions: { width: 0, height: 0, depth: 0 },
        shippingInformation: "Ships in 3-5 business days",
        availabilityStatus: (parseInt(stock, 10) || 0) > 0 ? "In Stock" : "Out of Stock",
        reviews: [],
        returnPolicy: "No return policy",
        minimumOrderQuantity: 1,
        meta: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          barcode: String(Math.floor(Math.random() * 10000000000000)),
          qrCode: "https://cdn.dummyjson.com/public/qr-code.png",
        },
        images: [validImageUrl],
        thumbnail: validImageUrl,
      };

      const response = await fetch("http://localhost:4000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const createdProduct = await response.json();

      // Set last saved ID and calculate next ID
      setLastSavedId(createdProduct.id);
      setNextId(Number(createdProduct.id) + 1);

      // Reset form fields
      setTitle("");
      setBrand("");
      setPrice("");
      setStock("");
      setWeight("");
      setSku("");
      setImageUrl("");
      setRating("");
      setTags("");
    } catch (error: any) {
      console.error("Submission failed:", error);
      alert(`Could not add product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md border border-gray-100 my-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Success Banner */}
        {lastSavedId && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 font-medium">
            ✅ Product <strong>#{lastSavedId}</strong> was added successfully!
          </div>
        )}

        {/* Dynamic Display showing upcoming ID */}
        <div className="p-3 bg-violet-50 border border-violet-200 rounded-lg flex justify-between items-center">
          <span className="font-semibold text-violet-900">Assigned ID for New Product:</span>
          <span className="font-bold text-violet-700 text-lg"> #{nextId} </span>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="mb-1 block font-medium text-gray-700">Product Title *</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (lastSavedId) setLastSavedId(null);
            }}
            placeholder="e.g. Eyeshadow Palette with Mirror"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500" 
            required
          />
        </div>

        {/* Brand */}
        <div>
          <label htmlFor="brand" className="mb-1 block font-medium text-gray-700">Brand</label>
          <input
            id="brand"
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="e.g. Glamour Beauty"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Price & Stock Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="mb-1 block font-medium text-gray-700">Price ($) *</label>
            <input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="19.99"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>

          <div>
            <label htmlFor="stock" className="mb-1 block font-medium text-gray-700">Stock *</label>
            <input
              id="stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="34"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>
        </div>

        {/* Weight, Rating & Category Select Row */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="weight" className="mb-1 block font-medium text-gray-700">Weight (g)</label>
            <input
              id="weight"
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="9"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label htmlFor="rating" className="mb-1 block font-medium text-gray-700">Rating (0-5)</label>
            <input
              id="rating"
              type="number"
              step="0.01"
              min="0"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="2.86"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label htmlFor="categoryId" className="mb-1 block font-medium text-gray-700">Category</label>
            <select
              id="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.id} - {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Warranty Information Dropdown */}
        <div>
          <label htmlFor="warrantyInfo" className="mb-1 block font-medium text-gray-700">Warranty Information</label>
          <select
            id="warrantyInfo"
            value={warrantyInfo}
            onChange={(e) => setWarrantyInfo(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="3 days warranty">3 days warranty</option>
            <option value="1 week warranty">1 week warranty</option>
            <option value="1 month warranty">1 month warranty</option>
            <option value="1 year warranty">1 year warranty</option>
          </select>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="mb-1 block font-medium text-gray-700">Tags (comma-separated)</label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="beauty, eyeshadow"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Image URL Input with Decorative Preview */}
        <div>
          <label htmlFor="imageUrl" className="mb-1 block font-medium text-gray-700">Image URL</label>
          <input id="imageUrl" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://cdn.dummyjson.com/product-images/.../1.webp"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          
          {/* Optional visual preview using empty alt="" to avoid redundant text */}
          {isValidUrl(imageUrl.trim()) && (
            <div className="mt-2 flex items-center gap-3 p-2 bg-gray-50 border border-gray-200 rounded-lg">
              <img src={imageUrl.trim()}  alt="Image  preview" className="w-12 h-12 object-cover rounded"/>
              <span className="text-xs text-gray-500">Image preview</span>
            </div>
          )}
        </div>

        {/* Action Buttons Row */}
        <div className="flex gap-4 pt-2">
          <button
          type="button" onClick={() => router.push("/")} className="w-1/2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-gray-700 hover:bg-gray-50 font-medium transition-colors text-center" >
            Cancel / Back
          </button>

          <button type="submit" disabled={loading} className="w-1/2 rounded-lg bg-violet-600 px-5 py-2.5 text-white hover:bg-violet-700 disabled:opacity-50 font-medium transition-colors">
            {loading ? "Saving..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}