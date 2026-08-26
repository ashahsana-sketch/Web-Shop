export interface Category {
  id: number;
  name: string;
}
// in interface all of the interfaces are string type, because the form inputs are strings, and we will convert them to numbers when we send the data to the server.
export interface ProductFormData {
  title: string;
  brand: string;
  price: string;
  stock: string;
  weight: string;
  sku: string;
  imageUrl: string;
  rating: string;
  tags: string;
  warrantyInfo: string;
  categoryId: string;
}