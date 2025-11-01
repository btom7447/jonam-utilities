"use client";

import Image from "next/image";

export default function UserOrderDetails({ order, items }) {
  return (
    <div className="bg-white border border-gray-200 p-8 shadow-sm">
      {/* Order Metadata */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-gray-100 pb-6 mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Order #{order?._id || "N/A"}
          </h2>
          <p className="text-gray-600">
            Placed on {new Date(order?.order_date).toLocaleDateString()}
          </p>
        </div>

        <div className="mt-4 lg:mt-0">
          <span
            className={`px-4 py-2 text-sm rounded-full capitalize ${
              order?.status === "completed"
                ? "bg-green-100 text-green-700"
                : order?.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : order?.status === "cancelled"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {order?.status}
          </span>
        </div>
      </div>

      {/* Order Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 text-lg mb-8">
        <p>
          <strong>Name:</strong> {order?.customer_name}
        </p>
        <p>
          <strong>Phone:</strong> {order?.customer_number}
        </p>
        <p>
          <strong>Email:</strong> {order?.customer_email}
        </p>
        <p>
          <strong>Delivery State:</strong> {order?.delivery_state}
        </p>
        <p>
          <strong>Delivery Fee:</strong> ₦
          {order?.delivery_price?.toLocaleString()}
        </p>
        <p>
          <strong>Total:</strong> ₦{order?.order_total?.toLocaleString()}
        </p>
        <p>
          <strong>Payment:</strong> {order?.payment_option}
        </p>
      </div>

      {/* Order Items */}
      <div className="overflow-x-auto border-t border-gray-100 pt-6">
        {!items || items.length === 0 ? (
          <p className="text-gray-500 text-center py-10 text-xl">
            No items found for this order
          </p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700 text-lg border-b">
                <th className="p-5 font-semibold">#</th>
                <th className="p-5 font-semibold">Image</th>
                <th className="p-5 font-semibold">Product</th>
                <th className="p-5 font-semibold">Price</th>
                <th className="p-5 font-semibold">Qty</th>
                <th className="p-5 font-semibold">Subtotal</th>
              </tr>
            </thead>
            <tbody>
               {items.map((item, idx) => {
                  // ✅ Use actual values
                  const price = Number(item.price) || 0;
                  const discount = Number(item.discount) || 0;
                  const quantity = Number(item.quantity) || 1;

                  // const singleDiscountedPrice = discount
                  //   ? Math.round(item.unit_price * (1 - discount / 100))
                  //   : unit_price;

                  // ✅ Calculate discounted price
                  const discountedPrice = discount
                    ? Math.round(item.unit_price * (1 - discount / 100))
                    : item.unit_price;

                  // ✅ Calculate subtotal
                  const subtotal = discountedPrice * quantity;

                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50 transition-colors border-b border-gray-200"
                    >
                      {/* Auto numbering */}
                      <td className="p-5 border-b border-gray-200 text-left">
                        {(idx + 1).toString().padStart(2, "0")}
                      </td>

                      {/* Product Image */}
                      <td className="p-5 border-b border-gray-200 text-left">
                        {item.product_images?.[0]?.url ? (
                          <Image
                            src={item.product_images[0].url}
                            alt={item.product_name}
                            width={48}
                            height={48}
                            unoptimized
                            className="w-12 h-12 rounded-full object-cover border"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center border text-gray-500">
                            N/A
                          </div>
                        )}
                      </td>

                      {/* Product Info */}
                      <td className="p-5">
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-gray-500">
                            Category: {item.category || "-"}
                          </p>
                          <p className="text-sm text-gray-500">
                            Brand: {item.brand || "-"}
                          </p>
                          <p className="text-sm text-gray-500">
                            UID: {item.product_number || "-"}
                          </p>
                        </div>
                      </td>

                      {/* Discounted Price */}
                      <td className="p-5">
                        <div>
                          <p className="font-medium">
                            ₦ {discountedPrice.toLocaleString() || "-"}
                          </p>
                          <p className="text-sm text-gray-500 line-through">
                            ₦ {item.unit_price.toLocaleString()}
                          </p>
                        </div>
                      </td>

                      {/* Quantity */}
                      <td className="p-5">{quantity}</td>

                      {/* Subtotal */}
                      <td className="p-5">₦ {subtotal.toLocaleString()}</td>
                    </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
