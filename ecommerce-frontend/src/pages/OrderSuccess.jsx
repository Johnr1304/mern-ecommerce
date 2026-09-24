import { useLocation, useNavigate } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const orderId = location.state?.orderId;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md w-full">

        <div className="text-6xl mb-4">🎉</div>

        <h1 className="text-2xl font-bold text-green-600 mb-3">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-600 mb-4">
          Thank you for shopping with us.
          Your order has been placed successfully.
        </p>

        {orderId && (
          <p className="font-semibold mb-6">
            Order ID: {orderId}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/orders")}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            View My Orders
          </button>

          <button
            onClick={() => navigate("/")}
            className="border border-gray-300 py-2 rounded hover:bg-gray-100"
          >
            Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
}

export default OrderSuccess;