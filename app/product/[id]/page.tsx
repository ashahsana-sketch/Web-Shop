import { notFound } from "next/navigation";
import type { Product } from "@/app/types";
import ProductDetail from "@/app/components/ProductDetail/ProductDetail";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    notFound();
  }

  const response = await fetch(
    `http://localhost:4000/products/${productId}?_expand=category`,
    {
      cache: "no-store",
    },
  );

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error(`Unable to load product ${productId}`);
  }

  const product = (await response.json()) as Product;

  return <ProductDetail product={product} />;
}