import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import HomePage from "./pages/Home/HomePage.jsx";
import SearchPage from "./pages/Search/SearchPage.jsx";
import CartPage from "./pages/Cart/CartPage.jsx";
import CheckoutPage from "./pages/Checkout/CheckoutPage.jsx";
import OrderCompletePage from "./pages/OrderCompletePage/OrderCompletePage.jsx";
import MemberPage from "./pages/MemberPage/MemberPage.jsx";
import OrderListPage from "./pages/OrderList/OrderList.jsx";
import AuthPage from "./pages/AuthPage/AuthPage.jsx";
import React from 'react';
import {AuthProvider} from './contexts/AuthContext.jsx';
import {CartProvider} from './contexts/CartContext.jsx';


function App() {


    return (
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Navigate to="/home"/>}/>
                        <Route path="/home" element={<HomePage/>}/>
                        <Route path="/search" element={<SearchPage/>}/>
                        {/*<Route path="/product/:id" element={<ProductDetailPage />} />*/}
                        <Route path="/cart" element={<CartPage/>}/>
                        <Route path="/checkout" element={<CheckoutPage/>}/>
                        <Route path="/order-complete" element={<OrderCompletePage/>}/>
                        <Route path="/member" element={<MemberPage/>}/>
                        <Route path="/orders" element={<OrderListPage/>}/>
                        <Route path="/register" element={<AuthPage variant="register"/>}/>
                        <Route path="/login" element={<AuthPage variant="login"/>}/>
                        <Route path="/simple-login" element={<AuthPage variant="simple-login"/>}/>
                    </Routes>
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>

    )
}

export default App
