"use client";

export default function AdminOrderDetails({ order, items }) {
  const placeholder = !order;

  return (
    <section className="mx-5 lg:mx-10 mb-10">
      {placeholder ? (
        <div className="flex flex-col items-center justify-center text-center py-20">
          <p className="w-full bg-white rounded-xl border border-gray-200 py-20 text-center text-gray-500 text-2xl">Select an order to see details</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-stretch justify-stretch">
          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto relative p-10">
            {/* Order Metadata */}
            <h2 className="text-2xl font-bold mb-4">Order #{order.id}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 text-lg text-wrap mb-5">
              <p><strong>Customer:</strong> {order.customer_name}</p>
              <p><strong>Email:</strong> {order.customer_email}</p>
              <p><strong>Phone:</strong> {order.customer_number}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Payment Method:</strong> {order.payment_option}</p>
              <p><strong>Delivery State:</strong> {order.delivery_state}</p>
              <p><strong>Delivery Price:</strong> ₦ {order.delivery_price.toLocaleString()}</p>
              <p><strong>Order Total:</strong> ₦ {order.order_total.toLocaleString()}</p>
              <p><strong>Date:</strong> {new Date(order.order_date).toLocaleString()}</p>
            </div>
          </div>

          {/* Items */}
          {(!items || items.length === 0) ? (
            <p className="w-full bg-white rounded-xl border border-gray-200 py-20 text-center text-gray-500 text-2xl">No items found for this order</p>
          ) : (
           <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto relative">
             <table className="w-full border-collapse ">
              <thead>
                <tr className="bg-brown border-b border-gray-200 text-xl text-left text-white">
                  <th className="p-5 font-semibold">Image</th>
                  <th className="p-5 font-semibold">Name</th>
                  <th className="p-5 font-semibold">Price</th>
                  <th className="p-5 font-semibold">Qty</th>
                  <th className="p-5 font-semibold">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const price = item.unit_price?.[0] || 0;
                  const qty = item.quantity?.[0] || 1;
                  const subtotal = price * qty;

                  return (
                    <tr key={item.recordId} className="hover:bg-gray-50 transition-colors border-b border-gray-200">
                      <td className="p-5">
                        {item.product_images?.[0]?.url ? (
                          <img
                            src={item.product_images[0].url}
                            alt={item.product_name?.[0]}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="p-5">{item.product_name?.[0] || "—"}</td>
                      <td className="p-5">₦{price.toLocaleString()}</td>
                      <td className="p-5">{qty}</td>
                      <td className="p-5">₦{subtotal.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
           </div>
          )}
        </div>
      )}
    </section>
  );
}
