import React from "react"; // React import because we are typescript and using React.FC
import { Category, ProductFormData } from "@/app/types/product";
import { ImagePreview } from "@/app/components/Header/addProduct/ImagePreview";

interface ProductFormInputsProps { //interface uses for that data types are defined for the props that the ProductFormInputs component will receive. It ensures that the component receives the correct types of data and helps with type checking during development.
  formData: ProductFormData;
  categories: Category[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; //e means event, and it represents the event object that is passed to the onChange handler when an input or select element changes. The type React.ChangeEvent<HTMLInputElement | HTMLSelectElement> specifies that the event is a change event that can occur on either an HTML input element or an HTML select element. This allows the onChange function to handle changes for both types of form elements while maintaining type safety.
}

export const ProductFormInputs: React.FC<ProductFormInputsProps> = ({ //React.Fc shows
  formData, 
  categories,
  onChange,
}) => {
  return (
    <>
      <div>
        <label htmlFor="title" className="mb-1 block font-medium text-gray-700">
          Product Title *
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={onChange}
          placeholder="e.g. Eyeshadow Palette with Mirror"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-violet-500"
          required
        />
      </div>

      <div>
        <label htmlFor="brand" className="mb-1 block font-medium text-gray-700">
          Brand
        </label>
        <input
          id="brand"
          type="text"
          value={formData.brand}
          onChange={onChange}
          placeholder="e.g. Glamour Beauty"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="mb-1 block font-medium text-gray-700"> Price (sek) *</label>
          <input id="price" type="number" step="0.01" value={formData.price}onChange={onChange} placeholder="19.99"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-violet-500"
            required />
        </div>

        <div>
          <label htmlFor="stock" className="mb-1 block font-medium text-gray-700">Stock </label>
          <input id="stock" type="number"value={formData.stock}onChange={onChange} placeholder="34"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-violet-500"
            required/>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="weight" className="mb-1 block font-medium text-gray-700">Weight (g)</label>
          <input id="weight"type="number"step="0.1"value={formData.weight}onChange={onChange} placeholder="9"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-violet-500" />
        </div>

        <div>
          <label htmlFor="rating" className="mb-1 block font-medium text-gray-700"> Rating (0-5) </label>
          <input  id="rating" type="number"  step="0.01" min="0" max="5"
            value={formData.rating} onChange={onChange} placeholder="2.86" // on change 
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div>
          <label htmlFor="categoryId" className="mb-1 block font-medium text-gray-700"> Category  </label>
          <select id="categoryId" value={formData.categoryId} onChange={onChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-white focus:ring-2 focus:ring-violet-500" >
            {categories.map((cat) => ( // cat means category, and it represents each individual category object in the categories array. The map function iterates over the categories array and for each category object, it creates an <option> element with the category's id as the value and displays the category's id and name as the option text.
              <option key={cat.id} value={cat.id}> {cat.id} - {cat.name}</option> ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="warrantyInfo" className="mb-1 block font-medium text-gray-700"> Warranty Information  </label>
        <select  id="warrantyInfo"value={formData.warrantyInfo} onChange={onChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-white focus:ring-2 focus:ring-violet-500" >
          <option value="3 days warranty">3 days warranty</option>
          <option value="1 week warranty" >1 week warranty</option>
          <option value="1 month warranty">1 month warranty</option>
          <option value="1 year warranty">1 year warranty</option>
        </select>
      </div>

      <div>
        <label htmlFor="tags" className="mb-1 block font-medium text-gray-700"> Tags (comma-separated)  </label>
        <input id="tags"  type="text" value={formData.tags} onChange={onChange}  placeholder="beauty, eyeshadow"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-violet-500"  />
      </div>

      <div>
        <label htmlFor="imageUrl" className="mb-1 block font-medium text-gray-700"> Image URL </label>
        <input  id="imageUrl"  type="url" value={formData.imageUrl}  onChange={onChange}  placeholder="https://cdn.dummyjson.com/product-images/.../1.webp"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-violet-500" />
        <ImagePreview url={formData.imageUrl} />
      </div>
      <p className="text-xs text-gray-500 mt-1"> shipping information (3-5 business days), return policy (no return policy), and other details will be set to default values.</p>
    </>
  );
};