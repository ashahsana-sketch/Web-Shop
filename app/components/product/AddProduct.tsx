"use client";

import { useState } from "react";
export default function AddProduct() {
   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const newFiles = Array.from(event.target.files || []);

  const combinedFiles = [...selectedFiles, ...newFiles];

  if (combinedFiles.length > 5) {
    alert("You can select a maximum of 5 files.");
    return;
  }

  setSelectedFiles(combinedFiles);

  // Allows the same file to be selected again if needed
  event.target.value = "";
};
  return (
    <div className="p-6">

      <div className="flex flex-col items-left mb-8 space-y-6 border-2 border-gray-800 p-6 rounded-lg shadow-md bg-slate-200 max-w-lg">
        <h1 className="text-4xl font-bold "> Enter Product Details</h1>
        <h2 className="text-xl font-semibold">Inventory</h2>
      </div>

      <form className="max-w-lg space-y-6 border-2 border-gray-800 p-6 rounded-lg shadow-md bg-slate-200 items-center">
        {/* Product Title */}
      <div>
          <label className="block mb-2">Product Title</label>
          <input type="text" className="w-full border rounded-lg p-3"/>
      </div>
        {/* Product Image */}
    <div>
      <label className="block mb-2">Product Image</label>

      <div className="w-full border rounded-lg p-2 flex items-center justify-between">
        <label className="bg-violet-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-violet-700">
          Choose Files

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <span className="text-gray-500">
          {selectedFiles.length === 0
            ? "No files chosen"
            : `${selectedFiles.length} file${
                selectedFiles.length > 1 ? "s" : ""
              } selected`}
        </span>
      </div>
    </div>
        {/* Product Description */}
        <div>
          <label className="block mb-2">Price</label>
          <input type="number"className="w-full border rounded-lg p-3" />
        </div>
        {/* Stock */}
        <div>
          <label className="block mb-2"> Stock</label>
          <input type="number" className="w-full border rounded-lg p-3"/>
        </div>
         {/* Brand */}
        <div>
          <label className="block mb-2">Brand</label>
          <input type="text" className="w-full border rounded-lg p-3"/>
        </div>
        {/* Category */}
        <div>
          <label className="block mb-2">Category</label>
          <input type="text" className="w-full border rounded-lg p-3"/>
        </div>
    
        {/* Tags */}
        <div>
          <label className="block mb-2">Tags</label>
          <input type="text" placeholder="e.g. electronics, new, popular" className="w-full border rounded-lg p-3" />
        </div>
        {/* Description */}
        <div>
          <label className="block mb-2">Description</label>
          <textarea className="w-full border rounded-lg p-3" rows={4}></textarea>
        </div>
        <button type="submit" className="bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-700" > Add Product</button>

      </form>
    </div>
  );
}