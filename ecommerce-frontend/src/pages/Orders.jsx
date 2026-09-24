import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders, cancelOrder } from "../redux/thunks/orderThunks";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (loading) return <p className="text-center py-10 text-gray-500">Loading orders...</p>;

  if (orders.length === 0) {
    return <p className="text-center py-10 text-gray-500">You haven't placed any orders yet.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Order #{order._id.slice(-8)}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </div>

            <ul className="text-sm text-gray-700 mb-2 divide-y">
              {order.items.map((item, idx) => (
                <li key={idx} className="flex justify-between py-1">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="flex justify-between items-center pt-2 border-t">
              <span className="font-semibold text-gray-800">Total: ${order.totalPrice.toFixed(2)}</span>
              {["pending", "processing"].includes(order.status) && (
                <button
                  onClick={() => dispatch(cancelOrder(order._id))}
                  className="text-sm text-red-500 hover:underline"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
