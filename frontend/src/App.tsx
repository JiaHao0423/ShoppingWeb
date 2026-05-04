import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { ProtectedRoute } from "./components/protectedRoute/ProtectedRoute";
import { AdminRoute } from "./components/protectedRoute/AdminRoute";
import { Toaster } from "./components/ui/toaster";
import { ConfirmModalProvider } from "./components/ui/confirm-modal";

const HomePage = lazy(() => import("./pages/Home/HomePage"));
const SearchPage = lazy(() => import("./pages/Search/SearchPage"));
const CartPage = lazy(() => import("./pages/Cart/CartPage"));
const CheckoutPage = lazy(() => import("./pages/Checkout/CheckoutPage"));
const OrderCompletePage = lazy(() => import("./pages/OrderCompletePage/OrderCompletePage"));
const MemberPage = lazy(() => import("./pages/MemberPage/MemberPage"));
const OrderListPage = lazy(() => import("./pages/OrderList/OrderListPage"));
const AuthPage = lazy(() => import("./pages/AuthPage/AuthPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetail/ProductDetailPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPassword/ForgotPasswordPage"));
const CategoryAdminPage = lazy(() => import("./pages/AdminCategory/CategoryAdminPage"));

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Toaster />
          <ConfirmModalProvider />
          <Suspense fallback={<div>載入中...</div>}>
            <Routes>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/products/:categorySlug" element={<SearchPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-complete" element={<OrderCompletePage />} />
              <Route path="/member" element={<MemberPage />} />
              <Route path="/register" element={<AuthPage variant="register" />} />
              <Route path="/login" element={<AuthPage variant="login" />} />
              <Route path="/simple-login" element={<AuthPage variant="simple-login" />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ForgotPasswordPage />} />

              {/* 保護路由 */}
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <OrderListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <AdminRoute>
                    <CategoryAdminPage />
                  </AdminRoute>
                }
              />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
