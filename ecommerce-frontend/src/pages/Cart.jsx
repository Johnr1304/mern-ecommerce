import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectCartItems, selectCartTotal, clearCart } from "../redux/slices/cartSlice";
import CartItem from "../components/CartItem";

const Cart = () => {
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-500">
        <p className="text-lg mb-4">Your cart is empty.</p>
        <button onClick={() => navigate("/")} className="text-brand underline">
          Continue shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Your Cart</h1>

      {items.map((item) => (
        <CartItem key={item.product} item={item} />
      ))}

      <div className="bg-white rounded-lg shadow-sm p-4 mt-4 flex items-center justify-between">
        <button onClick={() => dispatch(clearCart())} className="text-sm text-red-500 hover:underline">
          Clear Cart
        </button>
        <div className="text-right">
          <p className="text-gray-600 text-sm">Subtotal</p>
          <p className="text-xl font-bold text-gray-800">${total.toFixed(2)}</p>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        className="w-full bg-brand text-white py-3 rounded-md mt-4 hover:bg-brand-dark transition font-medium"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default Cart;
