import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/thunks/productThunks";
import axiosInstance from "../api/axiosInstance";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  brand: "",
  imageUrl: "",
  stock: "",
  ratings: "",
  numReviews: "",
  tags: "",
};

const AdminProducts = () => {
  const dispatch = useDispatch();

  const { items, loading } = useSelector((state) => state.products);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProducts = () => {
    dispatch(
      fetchProducts({
        page: 1,
        limit: 100,
        sort: "newest",
      })
    );
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const productData = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category.trim(),
        brand: form.brand.trim(),
        imageUrl: form.imageUrl.trim(),
        stock: Number(form.stock),
        ratings: form.ratings === "" ? 0 : Number(form.ratings),
        numReviews: form.numReviews === "" ? 0 : Number(form.numReviews),
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean),
      };

      if (editingId) {
        await axiosInstance.put(
          `/products/${editingId}`,
          productData
        );

        setMessage("Product updated successfully.");
      } else {
        await axiosInstance.post(
          "/products",
          productData
        );

        setMessage("Product added successfully.");
      }

      resetForm();
      loadProducts();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      category: product.category || "",
      brand: product.brand || "",
      imageUrl: product.imageUrl || "",
      stock: product.stock ?? "",
      ratings: product.ratings ?? "",
      numReviews: product.numReviews ?? "",
      tags: (product.tags || []).join(", "),
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setMessage("");
      setError("");

      await axiosInstance.delete(
        `/products/${productId}`
      );

      setMessage("Product deleted successfully.");

      if (editingId === productId) {
        resetForm();
      }

      loadProducts();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete product."
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Admin Product Management
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          Add, edit and delete products from the store.
        </p>
      </div>

      {/* Messages */}

      {message && (
        <div className="bg-green-100 text-green-800 rounded-md p-3 mb-4">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 rounded-md p-3 mb-4">
          {error}
        </div>
      )}

      {/* Product Form */}

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">

        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          {editingId ? "Edit Product" : "Add New Product"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2"
              placeholder="Product name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Category
            </label>

            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2"
              placeholder="Electronics"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Brand
            </label>

            <input
              type="text"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Brand name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Price
            </label>

            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full border rounded-md px-3 py-2"
              placeholder="99.99"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Stock
            </label>

            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full border rounded-md px-3 py-2"
              placeholder="50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Image URL
            </label>

            <input
              type="text"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Ratings
            </label>

            <input
              type="number"
              name="ratings"
              value={form.ratings}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
              className="w-full border rounded-md px-3 py-2"
              placeholder="4.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Number of Reviews
            </label>

            <input
              type="number"
              name="numReviews"
              value={form.numReviews}
              onChange={handleChange}
              min="0"
              className="w-full border rounded-md px-3 py-2"
              placeholder="10"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Tags
            </label>

            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              placeholder="electronics, wireless, audio"
            />

            <p className="text-xs text-gray-400 mt-1">
              Separate tags with commas.
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full border rounded-md px-3 py-2"
              placeholder="Product description"
            />
          </div>

          <div className="md:col-span-2 flex gap-3">

            <button
              type="submit"
              disabled={saving}
              className="bg-brand text-white px-5 py-2.5 rounded-md hover:bg-brand-dark transition disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Product"
                : "Add Product"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="border border-gray-300 px-5 py-2.5 rounded-md hover:bg-gray-100"
              >
                Cancel Edit
              </button>
            )}

          </div>

        </form>
      </div>

      {/* Product List */}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">

        <div className="p-5 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Existing Products
          </h2>
        </div>

        {loading ? (
          <p className="p-5 text-gray-500">
            Loading products...
          </p>
        ) : items.length === 0 ? (
          <p className="p-5 text-gray-500">
            No products found.
          </p>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3">Product</th>
                  <th className="text-left p-3">Category</th>
                  <th className="text-left p-3">Price</th>
                  <th className="text-left p-3">Stock</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>

              <tbody>

                {items.map((product) => (
                  <tr
                    key={product._id}
                    className="border-t"
                  >

                    <td className="p-3">
                      <div className="font-medium">
                        {product.name}
                      </div>

                      {product.brand && (
                        <div className="text-xs text-gray-400">
                          {product.brand}
                        </div>
                      )}
                    </td>

                    <td className="p-3">
                      {product.category}
                    </td>

                    <td className="p-3">
                      ${Number(product.price).toFixed(2)}
                    </td>

                    <td className="p-3">
                      {product.stock}
                    </td>

                    <td className="p-3">

                      <div className="flex gap-2">

                        <button
                          onClick={() => handleEdit(product)}
                          className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(product._id)}
                          className="bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
};

export default AdminProducts;