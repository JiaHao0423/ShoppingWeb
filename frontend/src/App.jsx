import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import React, {Suspense, lazy} from 'react';
import {AuthProvider} from './contexts/AuthContext.jsx';
import {CartProvider} from './contexts/CartContext.jsx';
import {ProtectedRoute} from "./components/protectedRoute/ProtectedRoute.jsx";

const HomePage = lazy(() => import("./pages/Home/HomePage.jsx"));
const SearchPage = lazy(() => import("./pages/Search/SearchPage.jsx"));
const CartPage = lazy(() => import("./pages/Cart/CartPage.jsx"));
const CheckoutPage = lazy(() => import("./pages/Checkout/CheckoutPage.jsx"));
const OrderCompletePage = lazy(() => import("./pages/OrderCompletePage/OrderCompletePage.jsx"));
const MemberPage = lazy(() => import("./pages/MemberPage/MemberPage.jsx"));
const OrderListPage = lazy(() => import("./pages/OrderList/OrderListPage.jsx"));
const AuthPage = lazy(() => import("./pages/AuthPage/AuthPage.jsx"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetail/ProductDetailPage.jsx"));

function App() {


    return (
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <Suspense fallback={<div>載入中...</div>}>
                        <Routes>
                            <Route path="/" element={<Navigate to="/home"/>}/>
                            <Route path="/home" element={<HomePage/>}/>
                            <Route path="/search" element={<SearchPage/>}/>
                            <Route path="/product/:id" element={<ProductDetailPage/>}/>
                            <Route path="/checkout" element={<CheckoutPage/>}/>
                            <Route path="/order-complete" element={<OrderCompletePage/>}/>
                            <Route path="/member" element={<MemberPage/>}/>
                            <Route path="/register" element={<AuthPage variant="register"/>}/>
                            <Route path="/login" element={<AuthPage variant="login"/>}/>
                            <Route path="/simple-login" element={<AuthPage variant="simple-login"/>}/>

                            {/*保護路由*/}
                            <Route path="/cart" element={
                                <ProtectedRoute>
                                    <CartPage/>
                                </ProtectedRoute>
                            }/>
                            <Route path="/orders" element={
                                <ProtectedRoute>
                                    <OrderListPage/>
                                </ProtectedRoute>
                            }/>
                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>

    )
}

export default App
