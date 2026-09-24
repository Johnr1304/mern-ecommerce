import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { logout } from "../redux/slices/authSlice";
import { selectCartCount } from "../redux/slices/cartSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartCount = useSelector(selectCartCount);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-brand text-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold tracking-tight"
        >
          ShopEase
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-5 text-sm sm:text-base">

          {/* Home */}
          <Link
            to="/"
            className="hover:text-gray-200 transition"
          >
            Home
          </Link>

          {/* Contact */}
          <Link
            to="/contact"
            className="hover:text-gray-200 transition"
          >
            Contact
          </Link>

          {/* Profile - Logged in users */}
          {isAuthenticated && (
            <Link
              to="/profile"
              className="hover:text-gray-200 transition"
            >
              Profile
            </Link>
          )}

          {/* Orders - Logged in users */}
          {isAuthenticated && (
            <Link
              to="/orders"
              className="hover:text-gray-200 transition"
            >
              Orders
            </Link>
          )}

          {/* Admin Products */}
          {isAuthenticated && user?.role === "admin" && (
            <Link
              to="/admin/products"
              className="hover:text-gray-200 transition"
            >
              Admin Products
            </Link>
          )}

          {/* Admin Orders */}
          {isAuthenticated && user?.role === "admin" && (
            <Link
              to="/admin/orders"
              className="hover:text-gray-200 transition"
            >
              Admin Orders
            </Link>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            className="relative hover:text-gray-200 transition"
          >
            <FaShoppingCart size={20} />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-xs rounded-full px-1.5">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Authentication */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">

              {/* User Name */}
              <span className="hidden sm:flex items-center gap-1 text-sm">
                <FaUserCircle />
                {user?.name}
              </span>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="bg-white text-brand px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100 transition"
              >
                Logout
              </button>

            </div>
          ) : (
            /* Login */
            <Link
              to="/login"
              className="bg-white text-brand px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100 transition"
            >
              Login
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;