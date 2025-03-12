import './bootstrap';
import '../css/app.css';

import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import LandingPage from './Pages/LandingPage';
import ProductListPage from './Pages/ProductListPage';
import Navbar from './Pages/Navbar';

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
                </Route>
            </Routes>
        </BrowserRouter>
    );
}