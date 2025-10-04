"use client";

export default function UserOrderDetails({ order, items }) {
  return (
    <div className="bg-white border border-gray-200 p-8 shadow-sm">
      {/* Order Metadata */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-gray-100 pb-6 mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Order #{order?.id || order?.recordId || "N/A"}
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
                <th className="p-4 font-semibold">Image</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Qty</th>
                <th className="p-4 font-semibold">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const price = item.unit_price?.[0] || 0;
                const qty = item.quantity?.[0] || 1;
                const subtotal = price * qty;

                return (
                  <tr
                    key={item.recordId}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4">
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
                    <td className="p-4">{item.product_name?.[0] || "—"}</td>
                    <td className="p-4">₦{price.toLocaleString()}</td>
                    <td className="p-4">{qty}</td>
                    <td className="p-4">₦{subtotal.toLocaleString()}</td>
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
