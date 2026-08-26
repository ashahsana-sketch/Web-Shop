export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url); // Attempt to create a new URL object
    return true;
  } catch {
    return false;
  }
};

export const INITIAL_CATEGORIES = [
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
];