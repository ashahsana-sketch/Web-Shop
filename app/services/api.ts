import { ProductFormData } from "@/app/types/product";
import { isValidUrl } from "../components/utils/catogaries";

const API_BASE_URL = "http://localhost:4000"; //backend server  API ha

export async function fetchNextProductId(): Promise<number> {
  try {
    const res = await fetch(`${API_BASE_URL}/products`); // Fetch all products from the backend server and store the response in the res variable. The fetch function is used to make an HTTP GET request to the specified URL, which is constructed by appending "/products" to the base URL of the API. This request is intended to retrieve a list of all products available in the backend server's database.
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json(); //take the data and store into "data" variable. The res.json() method is called to parse the response body as JSON, which converts the raw response data into a JavaScript object or array that can be easily manipulated and accessed in the code. This parsed data is then stored in the data variable for further processing.
    
    let productsList: any[] = [];
    if (Array.isArray(data)) productsList = data;
    else if (Array.isArray(data.data)) productsList = data.data;
    else if (typeof data === "object" && data !== null) {
      const possibleArray = Object.values(data).find((val) => Array.isArray(val));
      if (possibleArray) productsList = possibleArray as any[];
    }

    if (productsList.length > 0) {
      const numericIds = productsList
        .map((p) => parseInt(String(p.id), 10))
        .filter((id) => !isNaN(id));
      const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
      return maxId + 1;
    }
    return 1;
  } catch (error) {
    console.error("Failed to fetch next ID:", error);
    throw error;
  }
}

export async function createProduct(formData: ProductFormData) {
  const parsedTags = formData.tags // formData.tags is a string that contains tags separated by commas. The code splits this string into an array of individual tags, trims any whitespace from each tag, and filters out any empty strings. This results in an array of clean, non-empty tags that can be used in the product creation process.
    .split(",") // split(",") is used to split the string into an array of substrings based on the comma delimiter. Each substring represents a tag that was separated by a comma in the original string.
    .map((t) => t.trim()) // this command remove begining and the last whitespace from each tag. This ensures that the tags are clean and do not contain any unnecessary spaces, which could cause issues when storing or displaying them.
    .filter(Boolean); //it filter out any empty strings from the array. The Boolean function returns false for empty strings, so this filter step removes any tags that are empty after trimming. This ensures that the final array of tags only contains valid, non-empty tag values.

  const trimmedUrl = formData.imageUrl.trim();
  const validImageUrl = isValidUrl(trimmedUrl)
    ? trimmedUrl
    : "https://picsum.photos/seed/picsum/200/300";

  const payload = { // creating a payload object mrans we are telling the type of data that sends to the server
    title: formData.title.trim(),
    brand: formData.brand.trim() || "Generic",
    price: parseFloat(formData.price) || 0,
    stock: parseInt(formData.stock, 10) || 0,// parse integer:10 shows that we are using decimal system. parseInt is used to convert string to integer
    weight: parseFloat(formData.weight) || 0,//weight showsthe weight of the product
    sku: formData.sku.trim() || `SKU-${Date.now()}`, //Sku is unique identifier. date.now() gives the current timestamp in milliseconds since January 1, 1970. This ensures that each SKU is unique based on the time of creation.
    rating: parseFloat(formData.rating) || 0,
    tags: parsedTags.length > 0 ? parsedTags : [""],// if there is no tag we are sending an empty string to the server
    warrantyInformation: formData.warrantyInfo,
    categoryId: parseInt(formData.categoryId, 10) || 1,
    description: "New product description",
    discountPercentage: 0,
    dimensions: { width: 0, height: 0, depth: 0 },
    shippingInformation: "Ships in 3-5 business days",
    availabilityStatus: (parseInt(formData.stock, 10) || 0) > 0 ? "In Stock" : "Out of Stock",
    reviews: [],
    returnPolicy: "No return policy",
    minimumOrderQuantity: 1,
    meta: { // meta is used to store additional information about the product that may not fit into the main product schema. It can include various attributes or properties that provide more context or details about the product.
      createdAt: new Date().toISOString(), //createdAt is used to store the date and time when the product was created. new Date().toISOString() generates a string representation of the current date and time in ISO 8601 format, which is a widely accepted standard for representing dates and times in a machine-readable format.
      updatedAt: new Date().toISOString(),
      barcode: String(Math.floor(Math.random() * 10000000000000)),
      qrCode: "https://cdn.dummyjson.com/public/qr-code.png",
    },
    images: [validImageUrl],
    thumbnail: validImageUrl, //validImageUrl is used to store the URL of the product's thumbnail image. A thumbnail is a smaller version of the main product image, often used for previews or listings. By using the validImageUrl, we ensure that the thumbnail is a valid and accessible image URL.
  };
// making data to json and sending to the server
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: "POST", // to tell server that we are sending data to create a new product. we insert data by POSt method 
    headers: { "Content-Type": "application/json" },//headers shows an extra informationabout the request. here we are telling the server that we are sending data in json format
    body: JSON.stringify(payload),
  });

  if (!response.ok) { // if the response is not ok we are throwing an error
    const errorText = await response.text();//response.text() is used to read the response body as plain text. This is useful for error handling, as it allows us to capture any error messages or details returned by the server in the response body.
    throw new Error(`HTTP ${response.status}: ${errorText}`);  
  }

  return response.json(); // 
}