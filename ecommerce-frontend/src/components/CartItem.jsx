import { useDispatch } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { updateQuantity, removeFromCart } from "../redux/slices/cartSlice";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  return (
    <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4 mb-3">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
          {item.image ? (
            <img src={item.image} alt={item.name} className="object-cover h-full w-full" />
          ) : (
            <span className="text-gray-400 text-xs">No Image</span>
          )}
        </div>
        <div>
          <h4 className="font-medium text-gray-800">{item.name}</h4>
          <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="number"
          min="1"
          max={item.stock || 99}
          value={item.quantity}
          onChange={(e) =>
            dispatch(updateQuantity({ product: item.product, quantity: Number(e.target.value) }))
          }
          className="w-16 border rounded-md px-2 py-1 text-center"
        />
        <span className="font-semibold text-gray-800 w-16 text-right">
          ${(item.price * item.quantity).toFixed(2)}
        </span>
        <button
          onClick={() => dispatch(removeFromCart(item.product))}
          className="text-red-500 hover:text-red-700 transition"
          aria-label="Remove item"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
