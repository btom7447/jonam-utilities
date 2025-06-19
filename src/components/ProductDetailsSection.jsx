"use client";

export default function ProductDetailsSection({ product }) {
  if (!product) return <div>Product not found or failed to load.</div>;

  const { name, price, description, caption } = product;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{name}</h1>
      <p className="text-lg font-semibold text-green-700">₦{price}</p>
      {caption && <p className="text-gray-500 italic">{caption}</p>}
      <p className="text-base text-gray-700">{description}</p>
    </div>
  );
}
