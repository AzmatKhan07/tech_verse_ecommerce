import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import OrderDetails from "./pages/OrderDetails";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ProductDetails from "./pages/ProductDetails";
import ScrollToTop from "./components/common/ScrollToTop";
import ScrollRestoration from "./components/common/ScrollRestoration";
import { CartProvider } from "./context/CartContext";
import { AdminProvider } from "./context/AdminContext";
import { WishlistProvider } from "./context/WishlistContext";
import AdminCategory from "./pages/AdminCategory";
import { Toaster } from "./components/ui/toaster";
import Brand from "./pages/Brand";
import AdminColor from "./pages/AdminColor";
import AdminSize from "./pages/AdminSize";
import AdminTaxes from "./pages/AdminTaxes";
import AdminHomeBanner from "./pages/AdminHomeBanner";
import AdminOrderStatus from "./pages/AdminOrderStatus";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <AdminProvider>
          <ScrollToTop />
          <ScrollRestoration />
          <Routes>
            {/* Auth routes without navbar/footer */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />

            {/* Admin routes without navbar/footer - Protected for admin users only */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <AdminProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <AdminCategory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/add-product"
              element={
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <AddProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/edit-product/:slug"
              element={
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <EditProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <AdminOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders/:orderId"
              element={
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/brands"
              element={
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <Brand />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/colors"
              element={
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <AdminColor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/sizes"
              element={
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <AdminSize />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/taxes"
              element={
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <AdminTaxes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/home-banner"
              element={
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <AdminHomeBanner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/order-status"
              element={
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <AdminOrderStatus />
                </ProtectedRoute>
              }
            />

            {/* Main app routes with navbar/footer */}
            <Route
              path="/*"
              element={
                <>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/product-details/:slug"
                      element={<ProductDetails />}
                    />
                  </Routes>
                  <Footer />
                </>
              }
            />
          </Routes>
          <Toaster />
        </AdminProvider>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
