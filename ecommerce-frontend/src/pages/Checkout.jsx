import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  selectCartItems,
  selectCartTotal,
  clearCart,
} from "../redux/slices/cartSlice";

import { placeOrder } from "../redux/thunks/orderThunks";
import { clearOrderStatus } from "../redux/slices/orderSlice";

const Checkout = () => {
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  const { loading, error } = useSelector(
    (state) => state.orders
  );

  const { user } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    line1: user?.address?.line1 || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    postalCode: user?.address?.postalCode || "",
    country: user?.address?.country || "",
  });

  const [paymentMethod, setPaymentMethod] = useState(
    "Cash on Delivery"
  );

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(clearOrderStatus());

    const orderData = {
      items: items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      })),

      shippingAddress: address,

      paymentMethod: paymentMethod,
    };

    try {
      const result = await dispatch(
        placeOrder(orderData)
      );

      if (placeOrder.fulfilled.match(result)) {
        const order =
          result.payload?.order ||
          result.payload;

        const orderId = order?._id;

        // Clear cart after successful order
        dispatch(clearCart());

        // Navigate to order success page
        navigate("/order-success", {
          state: {
            orderId: orderId,
          },
        });
      }
    } catch (err) {
      console.error("Order placement failed:", err);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Your cart is empty
        </h2>

        <button
          onClick={() => navigate("/")}
          className="bg-brand text-white px-6 py-3 rounded-md hover:bg-brand-dark transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Checkout
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm p-6 space-y-4"
      >
        {/* Shipping Address */}
        <h2 className="font-semibold text-gray-700">
          Shipping Address
        </h2>

        <input
          type="text"
          name="line1"
          placeholder="Address line"
          value={address.line1}
          onChange={handleChange}
          required
          className="w-full border rounded-md px-3 py-2 text-sm"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={address.city}
            onChange={handleChange}
            required
            className="border rounded-md px-3 py-2 text-sm"
          />

          <input
            type="text"
            name="state"
            placeholder="State"
            value={address.state}
            onChange={handleChange}
            className="border rounded-md px-3 py-2 text-sm"
          />

          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={address.postalCode}
            onChange={handleChange}
            required
            className="border rounded-md px-3 py-2 text-sm"
          />

          <input
            type="text"
            name="country"
            placeholder="Country"
            value={address.country}
            onChange={handleChange}
            required
            className="border rounded-md px-3 py-2 text-sm"
          />
        </div>

        {/* Payment Method */}
        <h2 className="font-semibold text-gray-700 pt-2">
          Payment Method
        </h2>

        <select
          value={paymentMethod}
          onChange={(e) =>
            setPaymentMethod(e.target.value)
          }
          className="w-full border rounded-md px-3 py-2 text-sm"
        >
          <option value="Cash on Delivery">
            Cash on Delivery
          </option>

          <option value="Credit / Debit Card">
            Credit / Debit Card
          </option>

          <option value="UPI">
            UPI
          </option>
        </select>

        {/* Order Total */}
        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-gray-600">
            Total
          </span>

          <span className="text-xl font-bold text-brand">
            ${total.toFixed(2)}
          </span>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}

        {/* Place Order Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand text-white py-3 rounded-md hover:bg-brand-dark transition font-medium disabled:opacity-60"
        >
          {loading
            ? "Placing order..."
            : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default Checkout;