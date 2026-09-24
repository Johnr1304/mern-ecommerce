import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderSuccess from "./pages/OrderSuccess";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import Profile from "./pages/Profile";

// Redux
import { fetchCurrentUser } from "./redux/thunks/authThunks";

function App() {
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);

  // Validate stored token when the application loads
  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token]);

  return (
    <div className="min-h-screen flex flex-col">

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        <Routes>

          {/* ==================== PUBLIC ROUTES ==================== */}

          {/* Opening the website redirects to Login */}
          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />

          {/* Product details are publicly accessible */}
          <Route
            path="/products/:id"
            element={<ProductDetail />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />


          {/* ==================== PROTECTED ROUTES ==================== */}

          <Route element={<ProtectedRoute />}>

            {/* Cart requires login */}
            <Route
              path="/cart"
              element={<Cart />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/checkout"
              element={<Checkout />}
            />

            <Route
              path="/orders"
              element={<Orders />}
            />

            <Route
              path="/order-success"
              element={<OrderSuccess />}
            />

          </Route>


          {/* ==================== ADMIN ROUTES ==================== */}

          <Route
            element={<ProtectedRoute requireAdmin={true} />}
          >

            <Route
              path="/admin/products"
              element={<AdminProducts />}
            />

            <Route
              path="/admin/orders"
              element={<AdminOrders />}
            />

          </Route>


          {/* ==================== FALLBACK ROUTE ==================== */}

          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />

        </Routes>
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default App;