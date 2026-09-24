import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* ShopEase */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3">
              ShopEase
            </h3>

            <p className="text-sm leading-6 text-gray-400">
              A full-stack MERN e-commerce platform where you can
              browse products, manage your cart, place orders and
              manage your account.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-semibold mb-3">
              Shop
            </h3>

            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-white transition"
                >
                  Products
                </Link>
              </li>

              <li>
                <Link
                  to="/cart"
                  className="hover:text-white transition"
                >
                  Shopping Cart
                </Link>
              </li>

              <li>
                <Link
                  to="/orders"
                  className="hover:text-white transition"
                >
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* My Account */}
          <div>
            <h3 className="text-white font-semibold mb-3">
              My Account
            </h3>

            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/profile"
                  className="hover:text-white transition"
                >
                  My Profile
                </Link>
              </li>

              <li>
                <Link
                  to="/orders"
                  className="hover:text-white transition"
                >
                  Order History
                </Link>
              </li>

              <li>
                <Link
                  to="/cart"
                  className="hover:text-white transition"
                >
                  View Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-3">
              Support
            </h3>

            <p className="text-sm text-gray-400 mb-2">
              Have questions or need help with an order?
            </p>

            <p className="text-sm text-gray-400 mb-3">
              support@shopease.example
            </p>

            <Link
              to="/contact"
              className="text-sm text-white hover:underline transition"
            >
              Contact Support →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} ShopEase. All rights reserved.
          </p>

          <p className="text-xs text-gray-500">
            Built with React • Node.js • Express • MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;