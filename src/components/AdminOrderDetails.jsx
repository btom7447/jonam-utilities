"use client";
import Image from "next/image";
import { MoonLoader } from "react-spinners";

export default function AdminOrderDetails({ order, items, itemsLoading }) {
  const placeholder = !order;

  return (
    <section className="mx-5 lg:mx-10 mb-10">
      {placeholder ? (
        <div className="flex flex-col items-center justify-center text-center py-20">
          <p className="w-full bg-white rounded-xl border border-gray-200 py-20 text-center text-gray-500 text-2xl">
            Select an order to see details
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-10">
          {/* Order Metadata */}
          <div className="bg-white rounded-xl border border-gray-200 p-10 relative">
            {itemsLoading ? (
              <div className="flex justify-center items-center py-20">
                <MoonLoader size={40} color="#8b4513" />
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4">Order #{order._id}</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 text-lg mb-5">
                  <p>
                    <strong>Customer:</strong> {order.customer_name}
                  </p>
                  <p>
                    <strong>Email:</strong> {order.customer_email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {order.customer_number}
                  </p>
                  <p>
                    <strong>Status:</strong> {order.status}
                  </p>
                  <p>
                    <strong>Payment Method:</strong> {order.payment_option}
                  </p>
                  <p>
                    <strong>Delivery State:</strong> {order.delivery_state}
                  </p>
                  <p>
                    <strong>Delivery Price:</strong> ₦
                    {order.delivery_price.toLocaleString()}
                  </p>
                  <p>
                    <strong>Order Total:</strong> ₦
                    {order.order_total.toLocaleString()}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(order.order_date).toLocaleString()}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto relative">
            {itemsLoading ? (
              <div className="flex justify-center items-center py-20">
                <MoonLoader size={40} color="#8b4513" />
              </div>
            ) : !items?.length ? (
              <p className="w-full text-center text-gray-500 py-20 text-2xl">
                No items found for this order
              </p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-brown text-left text-white text-xl border-b border-gray-200">
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
      )}
    </section>
  );
}
