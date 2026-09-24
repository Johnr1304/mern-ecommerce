import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const statuses = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axiosInstance.get("/orders");

      setOrders(data.orders || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      setError("");
      setMessage("");

      const { data } = await axiosInstance.put(
        `/orders/${orderId}/status`,
        { status }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? data.order : order
        )
      );

      setMessage("Order status updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Export order data for RapidMiner
  const exportForRapidMiner = async () => {
    try {
      setExporting(true);
      setError("");
      setMessage("");

      const response = await axiosInstance.get(
        "/analytics/export-orders",
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "text/csv",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "orders_for_rapidminer.csv";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      setMessage(
        "Order data exported successfully for RapidMiner."
      );
    } catch (err) {
      // Blob responses may contain JSON error messages,
      // so use the normal fallback message here.
      setError(
        err.response?.data?.message ||
          "Unable to export order data."
      );
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-gray-500">
          Loading orders...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* Page Header */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Admin Order Management
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            View and manage customer orders.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">

          {/* Refresh */}

          <button
            onClick={fetchOrders}
            className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 transition"
          >
            Refresh Orders
          </button>

          {/* RapidMiner Export */}

          <button
            onClick={exportForRapidMiner}
            disabled={exporting}
            className="bg-brand text-white px-4 py-2 rounded-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting
              ? "Exporting..."
              : "Export for RapidMiner"}
          </button>

        </div>

      </div>

      {/* Success Message */}

      {message && (
        <div className="bg-green-100 text-green-800 rounded-md p-3 mb-4">
          {message}
        </div>
      )}

      {/* Error Message */}

      {error && (
        <div className="bg-red-100 text-red-700 rounded-md p-3 mb-4">
          {error}
        </div>
      )}

      {/* Orders */}

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500">
            No orders found.
          </p>
        </div>
      ) : (
        <div className="space-y-5">

          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-sm border p-5"
            >

              {/* Header */}

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b pb-4 mb-4">

                <div>
                  <p className="text-sm text-gray-500">
                    Order ID
                  </p>

                  <p className="font-semibold text-gray-800 break-all">
                    {order._id}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Order Date
                  </p>

                  <p className="font-medium">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Status
                  </p>

                  <select
                    value={order.status}
                    disabled={updatingId === order._id}
                    onChange={(e) =>
                      updateStatus(
                        order._id,
                        e.target.value
                      )
                    }
                    className="border rounded-md px-3 py-2 text-sm"
                  >
                    {statuses.map((status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status.charAt(0).toUpperCase() +
                          status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Customer */}

              <div className="mb-4">

                <h2 className="font-semibold text-gray-800 mb-2">
                  Customer
                </h2>

                <p className="text-sm text-gray-600">
                  <span className="font-medium">
                    Name:
                  </span>{" "}
                  {order.user?.name || "N/A"}
                </p>

                <p className="text-sm text-gray-600">
                  <span className="font-medium">
                    Email:
                  </span>{" "}
                  {order.user?.email || "N/A"}
                </p>

              </div>

              {/* Products */}

              <div className="mb-4">

                <h2 className="font-semibold text-gray-800 mb-2">
                  Products
                </h2>

                <div className="space-y-2">

                  {order.items?.map((item, index) => (
                    <div
                      key={`${order._id}-${index}`}
                      className="flex flex-col sm:flex-row sm:justify-between gap-1 bg-gray-50 rounded-md p-3"
                    >

                      <div>
                        <p className="font-medium">
                          {item.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="font-medium">
                        ₹
                        {(
                          Number(item.price) *
                          Number(item.quantity)
                        ).toFixed(2)}
                      </p>

                    </div>
                  ))}

                </div>

              </div>

              {/* Shipping */}

              {order.shippingAddress && (
                <div className="mb-4">

                  <h2 className="font-semibold text-gray-800 mb-2">
                    Shipping Address
                  </h2>

                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.line1}
                  </p>

                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>

                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.country}
                  </p>

                </div>
              )}

              {/* Total */}

              <div className="border-t pt-4">

                <div className="flex justify-between text-sm mb-1">
                  <span>Items Price</span>

                  <span>
                    ₹{Number(order.itemsPrice).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm mb-2">
                  <span>Shipping</span>

                  <span>
                    ₹{Number(order.shippingPrice).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>

                  <span>
                    ₹{Number(order.totalPrice).toFixed(2)}
                  </span>
                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default AdminOrders;