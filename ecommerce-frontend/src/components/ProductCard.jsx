import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaStar } from "react-icons/fa";
import { addToCart } from "../redux/slices/cartSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();

    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.imageUrl,
        quantity: 1,
        stock: product.stock,
      })
    );
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
    >
      {/* Product Image */}
      <div className="bg-gray-100 rounded-md mb-3 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-auto max-h-60 object-contain rounded-md"
          />
        ) : (
          <div className="h-40 w-full flex items-center justify-center">
            <span className="text-gray-400 text-sm">
              No Image
            </span>
          </div>
        )}
      </div>

      {/* Product Name */}
      <h3 className="font-semibold text-gray-800 truncate">
        {product.name}
      </h3>

      {/* Category */}
      <p className="text-xs text-gray-500 mb-1">
        {product.category}
      </p>

      {/* Rating */}
      <div className="flex items-center gap-1 text-yellow-500 text-sm mb-2">
        <FaStar />
        {product.ratings?.toFixed(1) || "0.0"}

        <span className="text-gray-400">
          ({product.numReviews || 0})
        </span>
      </div>

      {/* Price + Cart */}
      <div className="mt-auto flex items-center justify-between">
        <span className="font-bold text-brand">
          ${product.price?.toFixed(2)}
        </span>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="bg-brand text-white text-xs px-3 py-1.5 rounded-md hover:bg-brand-dark transition disabled:bg-gray-300"
        >
          {product.stock === 0
            ? "Out of stock"
            : "Add to Cart"}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;