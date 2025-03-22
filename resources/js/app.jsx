import './bootstrap';
import '../css/app.css';

import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import LandingPage from './Pages/LandingPage';
import ProductListPage from './Pages/ProductListPage';
import Navbar from './Pages/Navbar';
import LoginPage from './Pages/LoginPage';
import NotFoundPage from './Pages/NotFoundPage';
import CartCheckoutPage from './Pages/CartCheckoutPage';

const rootElement = document.getElementById('root');
if (rootElement) {
    createRoot(rootElement).render(
        // <React.StrictMode>
        //     <LandingPage />
        // </React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navbar />}>
                    <Route index element={<LandingPage />} />
                    <Route path="product" element={<ProductListPage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="cart" element={<CartCheckoutPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}