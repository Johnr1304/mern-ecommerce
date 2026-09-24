import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaStar } from "react-icons/fa";
import {
  fetchProductById,
  fetchRecommendations,
} from "../redux/thunks/productThunks";
import { clearSelectedProduct } from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import ProductCard from "../components/ProductCard";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    selectedProduct: product,
    recommendations,
    loading,
  } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductById(id));
    dispatch(fetchRecommendations(id));

    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, id]);

  if (loading || !product) {
    return (
      <p className="text-center py-10 text-gray-500">
        Loading product...
      </p>
    );
  }

  const handleAddToCart = () => {
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
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-sm p-6">

        {/* Product Image */}
       <div className="bg-gray-100 rounded-md flex items-center justify-center p-4">
         {product.imageUrl ? (
          <img
           src={product.imageUrl}
           alt={product.name}
           className="w-full h-auto max-h-[500px] object-contain rounded-md"
          />
       ) : (
       <div className="h-80 w-full flex items-center justify-center">
      <span className="text-gray-400">No Image</span>
    </div>
  )}
</div>

        {/* Product Information */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {product.name}
          </h1>

          <p className="text-sm text-gray-500 mb-2">
            {product.category}
            {product.brand ? ` • ${product.brand}` : ""}
          </p>

          <div className="flex items-center gap-1 text-yellow-500 mb-4">
            <FaStar />

            {product.ratings?.toFixed(1)}

            <span className="text-gray-400">
              ({product.numReviews} reviews)
            </span>
          </div>

          <p className="text-gray-700 mb-4">
            {product.description}
          </p>

          <p className="text-2xl font-bold text-brand mb-4">
            ${product.price?.toFixed(2)}
          </p>

          <p
            className={`text-sm mb-4 ${
              product.stock > 0
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {product.stock > 0
              ? `${product.stock} in stock`
              : "Out of stock"}
          </p>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-brand text-white px-6 py-2 rounded-md hover:bg-brand-dark transition disabled:bg-gray-300"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* RapidMiner Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="mt-10">

          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                You Might Also Like
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Recommended based on product relationships and shopping
                patterns.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {recommendations.map((rec) => (
              <div key={rec._id} className="bg-white rounded-lg shadow-sm">
                <ProductCard product={rec} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Recommendations */}
      {recommendations &&
        recommendations.length === 0 && (
          <div className="mt-10 text-center text-gray-500">
            No recommendations available for this product.
          </div>
        )}

      {/* Back to Products */}
      <div className="mt-8">
        <Link
          to="/"
          className="text-brand hover:underline"
        >
          ← Back to Products
        </Link>
      </div>
    </div>
  );
};

export default ProductDetail;