import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { ProtectedRoute } from "./components/protectedRoute/ProtectedRoute";

const HomePage = lazy(() => import("./pages/Home/HomePage"));
const SearchPage = lazy(() => import("./pages/Search/SearchPage"));
const CartPage = lazy(() => import("./pages/Cart/CartPage"));
const CheckoutPage = lazy(() => import("./pages/Checkout/CheckoutPage"));
const OrderCompletePage = lazy(() => import("./pages/OrderCompletePage/OrderCompletePage"));
const MemberPage = lazy(() => import("./pages/MemberPage/MemberPage"));
const OrderListPage = lazy(() => import("./pages/OrderList/OrderListPage"));
const AuthPage = lazy(() => import("./pages/AuthPage/AuthPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetail/ProductDetailPage"));

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 2500,
            }}
          />
          <Suspense fallback={<div>載入中...</div>}>
            <Routes>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-complete" element={<OrderCompletePage />} />
              <Route path="/member" element={<MemberPage />} />
              <Route path="/register" element={<AuthPage variant="register" />} />
              <Route path="/login" element={<AuthPage variant="login" />} />
              <Route path="/simple-login" element={<AuthPage variant="simple-login" />} />

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
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
