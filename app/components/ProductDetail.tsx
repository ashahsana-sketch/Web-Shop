"use client";

import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { Product } from "@/app/types";

interface ProductDetailProps {
  product: Product;
  onBack?: () => void;
  onEdit?: (product: Product) => void;
  onStockUpdate?: (product: Product, newStock: number) => void;
}

type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

function getStockStatus(stock: number): {
  status: StockStatus;
  label: string;
} {
  if (stock === 0) {
    return {
      status: "out-of-stock",
      label: "Out of Stock",
    };
  }

  if (stock <= 10) {
    return {
      status: "low-stock",
      label: "Low Stock",
    };
  }

  return {
    status: "in-stock",
    label: "In Stock",
  };
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function formatDate(date?: string) {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
}

function formatDateOnly(date?: string) {
  if (!date) {
    return "—";
  }

  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);

  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;

    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
    }).format(new Date(Number(year), Number(month) - 1, Number(day)));
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(parsedDate);
}

function getDiscountPercentage(discountPercentage?: number) {
  return Math.min(Math.max(discountPercentage ?? 0, 0), 100);
}

function getDiscountedPrice(price: number, discountPercentage = 0) {
  const discount = getDiscountPercentage(discountPercentage);

  return Math.max(0, price - (price * discount) / 100);
}

export default function ProductDetail({
  product,
  onBack,
  onEdit,
  onStockUpdate,
}: ProductDetailProps) {
  const images = useMemo(() => {
    const allImages = [product.thumbnail, ...(product.images ?? [])].filter(
      (image): image is string =>
        typeof image === "string" && image.trim().length > 0,
    );

    return [...new Set(allImages)];
  }, [product.thumbnail, product.images]);

  const [selectedImage, setSelectedImage] = useState(() => images[0] ?? "");

  const [showStockEditor, setShowStockEditor] = useState(false);

  const [stockValue, setStockValue] = useState(() => product.stock ?? 0);

  const activeImage = images.includes(selectedImage)
    ? selectedImage
    : images[0] ?? "";

  const stock = Math.max(0, product.stock ?? 0);

  const stockStatus = getStockStatus(stock);

  const discountPercentage = getDiscountPercentage(product.discountPercentage);

  const discountedPrice = getDiscountedPrice(product.price, discountPercentage);

  const hasDiscount = discountPercentage > 0;

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      if (showStockEditor) {
        setShowStockEditor(false);
        return;
      }

      onBack?.();
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onBack, showStockEditor]);

  const handleStockSave = () => {
    const newStock = Math.max(0, Math.floor(Number(stockValue) || 0));

    onStockUpdate?.(product, newStock);

    setShowStockEditor(false);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close product details"
        onClick={onBack}
        className="absolute inset-0 h-full w-full cursor-default bg-slate-950/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative z-10 flex h-full items-start justify-center overflow-y-auto p-3 sm:p-5 lg:p-8">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-detail-title"
          className="relative w-full max-w-7xl overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-2xl"
        >
          {/* Header */}
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="hidden text-xs font-semibold uppercase tracking-wider text-violet-600 sm:inline">
                    Product Details
                  </span>

                  <span className="hidden text-slate-300 sm:inline">/</span>

                  <span className="truncate text-xs text-slate-500">
                    {product.sku ? `SKU ${product.sku}` : "Inventory"}
                  </span>
                </div>

                <h1
                  id="product-detail-title"
                  className="mt-1 truncate text-lg font-bold text-slate-950 sm:text-xl"
                >
                  {product.title}
                </h1>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => onEdit?.(product)}
                  className="min-h-10 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
                >
                  Edit Product
                </button>

                <button
                  type="button"
                  onClick={onBack}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-xl text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
                  aria-label="Close product details"
                >
                  ×
                </button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="max-h-[calc(100vh-80px)] overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Product overview */}
              <section
                aria-labelledby="overview-heading"
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <h2 id="overview-heading" className="sr-only">
                  Product overview
                </h2>

                <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
                  {/* Gallery */}
                  <div className="border-b border-slate-200 p-4 sm:p-6 lg:border-b-0 lg:border-r lg:p-8">
                    <div className="grid gap-4 sm:grid-cols-[76px_minmax(0,1fr)]">
                      {images.length > 1 && (
                        <div
                          className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:flex-col"
                          aria-label="Product images"
                        >
                          {images.map((image, index) => {
                            const selected = activeImage === image;

                            return (
                              <button
                                key={`${image}-${index}`}
                                type="button"
                                onClick={() => setSelectedImage(image)}
                                aria-label={`View product image ${index + 1}`}
                                aria-pressed={selected}
                                className={[
                                  "h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-slate-50 transition sm:h-17 sm:w-17",
                                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2",
                                  selected
                                    ? "border-violet-600 shadow-sm"
                                    : "border-slate-200 hover:border-slate-400",
                                ].join(" ")}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={image}
                                  alt=""
                                  aria-hidden="true"
                                  onError={(event) => {
                                    event.currentTarget.style.display = "none";
                                  }}
                                  className="h-full w-full object-contain p-2"
                                />
                              </button>
                            );
                          })}
                        </div>
                      )}

                      <div className="order-1 flex aspect-square min-h-70 items-center justify-center overflow-hidden rounded-2xl bg-slate-50 sm:order-2 lg:min-h-105">
                        {activeImage ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={activeImage}
                              alt={product.title}
                              onError={() => setSelectedImage("")}
                              className="h-full w-full object-contain p-8 sm:p-12"
                            />
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-2 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl text-slate-300 shadow-sm">
                              ?
                            </div>

                            <p className="text-sm font-medium text-slate-400">
                              No image available
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="flex flex-col p-5 sm:p-7 lg:p-8">
                    <div className="flex flex-wrap items-center gap-2">
                      <StockBadge
                        status={stockStatus.status}
                        label={stockStatus.label}
                      />

                      {product.category?.name && (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          {product.category.name}
                        </span>
                      )}
                    </div>

                    <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
                      {product.title}
                    </h2>

                    {product.brand && (
                      <p className="mt-2 text-sm text-slate-500">
                        Brand{" "}
                        <span className="font-semibold text-slate-700">
                          {product.brand}
                        </span>
                      </p>
                    )}

                    {/* Price */}
                    <div className="mt-7">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Current Price
                      </p>

                      <div className="mt-1 flex flex-wrap items-baseline gap-3">
                        <span className="text-3xl font-bold tracking-tight text-slate-950">
                          {formatPrice(discountedPrice)}
                        </span>

                        {hasDiscount && (
                          <span className="text-base text-slate-400 line-through">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>

                      {hasDiscount && (
                        <p className="mt-1 text-sm font-semibold text-emerald-600">
                          {discountPercentage.toFixed(0)}% discount
                        </p>
                      )}
                    </div>

                    {/* Inventory */}
                    <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-slate-500">
                            Current stock
                          </p>

                          <p className="mt-1 text-3xl font-bold text-slate-950">
                            {stock}
                          </p>
                        </div>

                        <StockIcon status={stockStatus.status} />
                      </div>

                      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p
                            className={`text-sm font-semibold ${
                              stockStatus.status === "in-stock"
                                ? "text-emerald-600"
                                : stockStatus.status === "low-stock"
                                ? "text-amber-600"
                                : "text-red-600"
                            }`}
                          >
                            {stockStatus.label}
                          </p>

                          {product.minimumOrderQuantity !== undefined && (
                            <p className="mt-1 text-xs text-slate-500">
                              Minimum order quantity:{" "}
                              {product.minimumOrderQuantity}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setStockValue(stock);
                            setShowStockEditor(true);
                          }}
                          disabled={!onStockUpdate}
                          className="min-h-10 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Adjust Stock
                        </button>
                      </div>
                    </div>

                    {/* Rating */}
                    {product.rating !== undefined && (
                      <div className="mt-6 flex items-center justify-between border-b border-slate-200 pb-5">
                        <span className="text-sm font-medium text-slate-500">
                          Customer rating
                        </span>

                        <div className="flex items-center gap-2">
                          <span
                            aria-hidden="true"
                            className="text-lg text-amber-500"
                          >
                            ★
                          </span>

                          <span className="font-semibold text-slate-900">
                            {product.rating.toFixed(1)}
                          </span>

                          {product.reviews && product.reviews.length > 0 && (
                            <span className="text-sm text-slate-500">
                              ({product.reviews.length})
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Quick metadata */}
                    <div className="mt-5 space-y-3">
                      <QuickInfo
                        label="Category"
                        value={product.category?.name}
                      />

                      <QuickInfo label="SKU" value={product.sku} />

                      <QuickInfo
                        label="Availability"
                        value={product.availabilityStatus || stockStatus.label}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Product Information + Inventory */}
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <SectionHeader
                    title="Product Information"
                    description="Core product and catalog information."
                  />

                  <dl className="divide-y divide-slate-100 px-5 sm:px-6">
                    <DetailRow label="Product ID" value={product.id} />

                    <DetailRow label="Title" value={product.title} />

                    <DetailRow label="Brand" value={product.brand} />

                    <DetailRow
                      label="Category"
                      value={product.category?.name}
                    />

                    <DetailRow label="Category ID" value={product.categoryId} />

                    <DetailRow label="SKU" value={product.sku} />

                    <DetailRow
                      label="Price"
                      value={formatPrice(product.price)}
                    />

                    {product.discountPercentage !== undefined && (
                      <DetailRow
                        label="Discount"
                        value={`${discountPercentage}%`}
                      />
                    )}

                    <DetailRow
                      label="Weight"
                      value={
                        product.weight !== undefined
                          ? `${product.weight} g`
                          : undefined
                      }
                    />
                  </dl>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <SectionHeader
                    title="Dimensions & Inventory"
                    description="Physical specifications and stock information."
                  />

                  <dl className="divide-y divide-slate-100 px-5 sm:px-6">
                    <DetailRow label="Stock" value={stock} />

                    <DetailRow label="Stock status" value={stockStatus.label} />

                    <DetailRow
                      label="Width"
                      value={
                        product.dimensions
                          ? `${product.dimensions.width} cm`
                          : undefined
                      }
                    />

                    <DetailRow
                      label="Height"
                      value={
                        product.dimensions
                          ? `${product.dimensions.height} cm`
                          : undefined
                      }
                    />

                    <DetailRow
                      label="Depth"
                      value={
                        product.dimensions
                          ? `${product.dimensions.depth} cm`
                          : undefined
                      }
                    />

                    <DetailRow
                      label="Minimum order"
                      value={
                        product.minimumOrderQuantity !== undefined
                          ? product.minimumOrderQuantity
                          : undefined
                      }
                    />

                    <DetailRow
                      label="Warranty"
                      value={product.warrantyInformation}
                    />
                  </dl>
                </section>
              </div>

              {/* Description */}
              <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <SectionHeader title="Description" />

                <div className="px-5 py-5 sm:px-6">
                  {product.description ? (
                    <p className="max-w-5xl whitespace-pre-line text-sm leading-7 text-slate-600">
                      {product.description}
                    </p>
                  ) : (
                    <p className="text-sm italic text-slate-400">
                      No description available.
                    </p>
                  )}

                  {product.tags && product.tags.length > 0 && (
                    <div className="mt-6">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Tags
                      </p>

                      <ul className="flex flex-wrap gap-2">
                        {product.tags.map((tag) => (
                          <li key={tag}>
                            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                              {tag}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>

              {/* Shipping */}
              <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <SectionHeader title="Shipping & Returns" />

                <div className="grid divide-y divide-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                  <InfoBlock
                    title="Shipping Information"
                    value={product.shippingInformation}
                  />

                  <InfoBlock
                    title="Return Policy"
                    value={product.returnPolicy}
                  />
                </div>
              </section>

              {/* Reviews */}
              <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-950">
                        Customer Reviews
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        {product.reviews?.length ?? 0}{" "}
                        {product.reviews?.length === 1 ? "review" : "reviews"}
                      </p>
                    </div>

                    {product.rating !== undefined && (
                      <div className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="text-lg text-amber-500"
                        >
                          ★
                        </span>

                        <span className="font-semibold text-slate-900">
                          {product.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {product.reviews && product.reviews.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {product.reviews.map((review, index) => (
                      <article
                        key={`${review.reviewerEmail}-${review.date}-${index}`}
                        className="px-5 py-5 sm:px-6"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="font-semibold text-slate-900">
                              {review.reviewerName}
                            </h3>

                            <div
                              className="mt-1 flex items-center gap-1"
                              aria-label={`${review.rating} out of 5 stars`}
                            >
                              {Array.from({
                                length: 5,
                              }).map((_, starIndex) => (
                                <span
                                  key={starIndex}
                                  aria-hidden="true"
                                  className={
                                    starIndex < Math.round(review.rating)
                                      ? "text-amber-500"
                                      : "text-slate-300"
                                  }
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>

                          <time
                            dateTime={review.date}
                            className="text-xs text-slate-500"
                          >
                            {formatDateOnly(review.date)}
                          </time>
                        </div>

                        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">
                          {review.comment}
                        </p>

                        <p className="mt-3 text-xs text-slate-400">
                          {review.reviewerEmail}
                        </p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-10 text-center sm:px-6">
                    <p className="text-sm font-medium text-slate-600">
                      No customer reviews yet.
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Reviews will appear here when customers submit feedback.
                    </p>
                  </div>
                )}
              </section>

              {/* Metadata */}
              <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <SectionHeader
                  title="Metadata"
                  description="System and catalog metadata."
                />

                <div className="grid divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                  <div className="px-5 sm:px-6">
                    <dl>
                      <DetailRow
                        label="Created"
                        value={formatDate(product.meta.createdAt)}
                      />

                      <DetailRow
                        label="Updated"
                        value={formatDate(product.meta.updatedAt)}
                      />

                      <DetailRow label="Product ID" value={product.id} />
                    </dl>
                  </div>

                  <div className="px-5 sm:px-6">
                    <dl>
                      <div className="py-3.5">
                        <dt className="text-sm text-slate-500">Barcode</dt>

                        <dd className="mt-1 break-all text-sm font-medium text-slate-900">
                          {product.meta.barcode || "—"}
                        </dd>
                      </div>

                      <div className="border-t border-slate-100 py-5">
                        <dt className="text-sm font-medium text-slate-500">
                          QR Code
                        </dt>

                        {product.meta.qrCode ? (
                          <dd className="mt-3">
                            <div className="inline-flex rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                              <QRCodeSVG
                                value={product.meta.qrCode}
                                size={180}
                                level="M"
                                includeMargin
                                bgColor="#ffffff"
                                fgColor="#0f172a"
                                aria-label={`QR code for ${product.title}`}
                              />
                            </div>

                            <p className="mt-3 max-w-full break-all text-xs leading-5 text-slate-500">
                              {product.meta.qrCode}
                            </p>
                          </dd>
                        ) : (
                          <dd className="mt-2 text-sm italic text-slate-400">
                            No QR code available.
                          </dd>
                        )}
                      </div>
                    </dl>
                  </div>
                </div>
              </section>

              <div className="h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Stock modal */}
      {showStockEditor && (
        <StockModal
          title="Adjust Stock"
          description={`Update the inventory quantity for ${product.title}.`}
          stockValue={stockValue}
          setStockValue={setStockValue}
          onClose={() => setShowStockEditor(false)}
          onSave={handleStockSave}
        />
      )}
    </div>
  );
}

/* ========================================================================== */
/* Section Header                                                             */
/* ========================================================================== */

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
      <h2 className="text-base font-bold text-slate-950">{title}</h2>

      {description && (
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      )}
    </div>
  );
}

/* ========================================================================== */
/* Stock Badge                                                                */
/* ========================================================================== */

function StockBadge({ status, label }: { status: StockStatus; label: string }) {
  const styles = {
    "in-stock": {
      wrapper: "bg-emerald-50 text-emerald-700",
      dot: "bg-emerald-600",
    },

    "low-stock": {
      wrapper: "bg-amber-50 text-amber-700",
      dot: "bg-amber-500",
    },

    "out-of-stock": {
      wrapper: "bg-red-50 text-red-700",
      dot: "bg-red-600",
    },
  };

  const style = styles[status];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${style.wrapper}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
      />

      {label}
    </span>
  );
}

/* ========================================================================== */
/* Stock Icon                                                                 */
/* ========================================================================== */

function StockIcon({ status }: { status: StockStatus }) {
  const styles = {
    "in-stock": "border-emerald-200 bg-emerald-50 text-emerald-600",

    "low-stock": "border-amber-200 bg-amber-50 text-amber-600",

    "out-of-stock": "border-red-200 bg-red-50 text-red-600",
  };

  return (
    <div
      aria-hidden="true"
      className={`flex h-10 w-10 items-center justify-center rounded-full border text-lg font-bold ${styles[status]}`}
    >
      {status === "in-stock" ? "✓" : status === "low-stock" ? "!" : "×"}
    </div>
  );
}

/* ========================================================================== */
/* Quick Info                                                                 */
/* ========================================================================== */

function QuickInfo({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-slate-500">{label}</span>

      <span className="max-w-[60%] truncate text-right text-sm font-medium text-slate-800">
        {value}
      </span>
    </div>
  );
}

/* ========================================================================== */
/* Detail Row                                                                 */
/* ========================================================================== */

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return (
    <div className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <dt className="text-sm text-slate-500">{label}</dt>

      <dd className="wrap-break-word text-sm font-medium text-slate-900 sm:max-w-[65%] sm:text-right">
        {value}
      </dd>
    </div>
  );
}

/* ========================================================================== */
/* Info Block                                                                 */
/* ========================================================================== */

function InfoBlock({ title, value }: { title: string; value?: string }) {
  return (
    <div className="p-5 sm:p-6">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>

      {value ? (
        <p className="mt-2 text-sm leading-6 text-slate-600">{value}</p>
      ) : (
        <p className="mt-2 text-sm italic text-slate-400">
          No information available.
        </p>
      )}
    </div>
  );
}

/* ========================================================================== */
/* Stock Modal                                                                */
/* ========================================================================== */

function StockModal({
  title,
  description,
  stockValue,
  setStockValue,
  onClose,
  onSave,
}: {
  title: string;
  description: string;
  stockValue: number;
  setStockValue: (value: number) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close stock editor"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="stock-modal-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="stock-modal-title"
              className="text-lg font-bold text-slate-950"
            >
              {title}
            </h2>

            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close stock editor"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
          >
            ×
          </button>
        </div>

        <div className="mt-6">
          <label
            htmlFor="stock-quantity"
            className="block text-sm font-medium text-slate-700"
          >
            Stock quantity
          </label>

          <input
            id="stock-quantity"
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={stockValue}
            onChange={(event) => {
              const rawValue = event.target.value;

              if (rawValue === "") {
                setStockValue(0);
                return;
              }

              const value = Number(rawValue);

              if (Number.isFinite(value)) {
                setStockValue(Math.max(0, Math.floor(value)));
              }
            }}
            className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-violet-600 focus:ring-2 focus:ring-violet-600/20"
          />

          <p className="mt-2 text-xs text-slate-500">
            Set the complete stock quantity. Use 0 to mark this product as out
            of stock.
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            className="min-h-11 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
          >
            Save Stock
          </button>
        </div>
      </div>
    </div>
  );
}
