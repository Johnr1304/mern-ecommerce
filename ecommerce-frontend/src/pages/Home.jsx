import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  fetchCategories,
} from "../redux/thunks/productThunks";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const dispatch = useDispatch();

  const {
    items,
    categories,
    loading,
    error,
    page,
    pages,
  } = useSelector((state) => state.products);

  const [filters, setFilters] = useState({
    keyword: "",
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    sort: "newest",
    page: 1,
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== "")
    );

    dispatch(fetchProducts(params));
  }, [dispatch, filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
  };

  const clearFilters = () => {
    setFilters({
      keyword: "",
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sort: "newest",
      page: 1,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Shop Our Products
      </h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">

          {/* Search */}
          <input
            type="text"
            name="keyword"
            placeholder="Search products..."
            value={filters.keyword}
            onChange={handleChange}
            className="border rounded-md px-3 py-2 text-sm lg:col-span-2"
          />

          {/* Category */}
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="">All Categories</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Brand */}
          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={filters.brand}
            onChange={handleChange}
            className="border rounded-md px-3 py-2 text-sm"
          />

          {/* Minimum Price */}
          <input
            type="number"
            name="minPrice"
            placeholder="Min price"
            min="0"
            value={filters.minPrice}
            onChange={handleChange}
            className="border rounded-md px-3 py-2 text-sm"
          />

          {/* Maximum Price */}
          <input
            type="number"
            name="maxPrice"
            placeholder="Max price"
            min="0"
            value={filters.maxPrice}
            onChange={handleChange}
            className="border rounded-md px-3 py-2 text-sm"
          />

          {/* Sorting */}
          <select
            name="sort"
            value={filters.sort}
            onChange={handleChange}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>

          {/* Clear Filters */}
          <button
            type="button"
            onClick={clearFilters}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md px-3 py-2 text-sm"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-gray-500 mb-4">
          Loading products...
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-500 mb-4">
          {error}
        </p>
      )}

      {/* No Products */}
      {!loading && items.length === 0 && (
        <p className="text-gray-500">
          No products match your filters.
        </p>
      )}

      {/* Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
          {Array.from(
            { length: pages },
            (_, index) => index + 1
          ).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: pageNumber,
                }))
              }
              className={`px-3 py-1 rounded-md text-sm ${
                pageNumber === page
                  ? "bg-brand text-white"
                  : "bg-white border text-gray-700"
              }`}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;