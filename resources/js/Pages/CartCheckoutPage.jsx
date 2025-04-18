import React, { useState, useEffect } from 'react';
import { ShoppingCart, ChevronRight, AlertCircle, Check, Trash, Plus, Minus, Upload, Search } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../Pages/CartContext';

const CartCheckoutPage = () => {
    const { updateCartCount } = useCart();
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [sukses, setSukses] = useState('');
    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [orderid, setOrderID] = useState('');
    const [saldo, setSaldo] = useState();
    const [paymentProof, setPaymentProof] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [paymentProofURL, setPaymentProofURL] = useState('');
    const [cartItemDomains, setCartItemDomains] = useState({});
    const [checkingDomain, setCheckingDomain] = useState({});
    const [domainStatus, setDomainStatus] = useState({});
    const [domainError, setDomainError] = useState(0);

    const generateorderid = function() {
        return "Vector-" + Math.floor(100000 + Math.random() * 900000);
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const fileType = file.type;
        if (!fileType.match(/image\/(jpeg|jpg|png)/)) {
            setError('Please upload only JPG or PNG images');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setError('File size should be less than 2MB');
            return;
        }

        setPaymentProof(file);

        const reader = new FileReader();
        reader.onload = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);

        setUploadStatus('ready');
    };

    const handleDomainChange = (productId, domain) => {
        setCartItemDomains(prev => ({
            ...prev,
            [productId]: domain
        }));

        setDomainStatus(prev => ({
            ...prev,
            [productId]: null
        }));

        setDomainError(0);
    };

    const checkDomainAvailability = async (productId) => {
        const domain = cartItemDomains[productId];

        if (!domain) {
            setError('Please enter a domain name first');
            return;
        }

        try {
            setCheckingDomain(prev => ({
                ...prev,
                [productId]: true
            }));

            const response = await axios.get(`https://domain-availability.whoisxmlapi.com/api/v1?apiKey=at_MR3M6e05rCgzwppHzULZ4NaD4ltT6&domainName=${domain}&credits=DA`);

            response.data.DomainInfo.domainAvailability === "AVAILABLE" ? setDomainError(0) : setDomainError(1);

            setDomainStatus(prev => ({
                ...prev,
                [productId]: response.data.DomainInfo
            }));
        } catch (err) {
            console.error('Error checking domain availability:', err);
            setError('Failed to check domain availability. Please try again.');
        } finally {
            setCheckingDomain(prev => ({
                ...prev,
                [productId]: false
            }));
        }
    };

    const handleUpload = async () => {
        if (!paymentProof) {
            setError('Please select a file first');
            return;
        }

        setUploadStatus('uploading');

        let oid = generateorderid();

        orderid?  '' : setOrderID(oid);

        try {
            const userSession = sessionStorage.getItem('user');
            if (!userSession) return;

            const user = JSON.parse(userSession);

            console.log(paymentProof);

            const formData = new FormData();
            formData.append('payment_proof', paymentProof, encodeURIComponent(paymentProof.name));

            const sanitizedFilename = paymentProof.name.replace(/[^\x00-\x7F]/g, "");
            formData.append('payment_proof', paymentProof, sanitizedFilename);
            formData.append('order_id', orderid? orderid : oid);
            formData.append('user_id', user.id);

            console.log(formData.getAll('payment_proof'));

            const response = await axios.post('/api/payment/proof', formData, {
                headers: {
                    'X-Requested': import.meta.env.VITE_API_KEY,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.status === 'success') {
                setPaymentProofURL(response.data.filename);
                setUploadStatus('success');
                setSukses('Payment proof uploaded successfully! You can proceed to checkout.');
            } else {
                throw new Error(response.data.message || 'Upload failed');
            }
        } catch (err) {
            console.error('Error uploading payment proof:', err);
            setError('Failed to upload payment proof. Please try again. Please check your internet connection or the file type and size.');

            setUploadStatus('failed');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
        try {
            const userSession = sessionStorage.getItem('user');
            if (!userSession) {
                window.location.href = '/login';
                return;
            }

            const user = JSON.parse(userSession);
            const response = await axios.get(`/api/user/${user.id}/`, {
                headers: {'X-Requested': import.meta.env.VITE_API_KEY}
            });
            setSaldo(response.data.saldo);
            setIsLoading(true);

            const cartResponse = await axios.get(`/api/cart/${user.id}/`, {
                headers: {'X-Requested': import.meta.env.VITE_API_KEY}
            });

            let cartData = cartResponse.data;
            cartData = JSON.parse(cartData.cart);


            const productIds = cartData.map(item => item.product_id);
            const uniqueProductIds = [...new Set(productIds)];

            const productPromises = uniqueProductIds.map(id =>
            axios.get(`/api/product/${id}/`, {
                headers: {'X-Requested': import.meta.env.VITE_API_KEY}
            })
            );

            const productResponses = await Promise.all(productPromises);
            const productData = {};

            productResponses.forEach(response => {
                const product = response.data;
                productData[product.id] = product;
            });

            setProducts(productData);
            setCartItems(cartData);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load your cart. Please try again.');
        } finally {
            setIsLoading(false);
        }
        };

        fetchData();
    }, []);

    const updateQuantity = async (productId, newQuantity) => {
        console.log(newQuantity);
        if (newQuantity < 1) return;

        try {
            const userSession = sessionStorage.getItem('user');
            if (!userSession) return;

            const user = JSON.parse(userSession);

            setCartItems(prevItems => {
                const updatedItems = prevItems.map(item =>
                    item.product_id === productId ? {...item, qty: newQuantity} : item
                );

                setTimeout(async function() {
                await axios.patch(`/api/cart/${user.id}`, {
                    cart: JSON.stringify(updatedItems),
                }, {
                    headers: {'X-Requested': import.meta.env.VITE_API_KEY}
                });
                }, 1000);

                return updatedItems;
            });
        } catch (err) {
            console.error('Error updating quantity:', err);
            setError('Failed to update quantity. Please try again.');
        }
    };

    const removeItem = async (productId) => {
        try {
        const userSession = sessionStorage.getItem('user');
        if (!userSession) return;

        const user = JSON.parse(userSession);
        setIsLoading(true);

        setCartItems(prevItems => prevItems.filter(item => item.product_id !== productId));

        await axios.delete(`/api/cart/${user.id}/remove/${productId}/`, {
            headers: {'X-Requested': import.meta.env.VITE_API_KEY}
        });

        setSukses('Item removed from cart');
        setTimeout(() => setSukses(''), 3000);
        } catch (err) {
            console.error('Error removing item:', err);
        } finally {
        setIsLoading(false);
        }
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((sum, item) => {
        const product = products[item.product_id];
        return sum + (product?.price || 0) * item.qty;
        }, 0);
    };

    const calculateTotal = () => {
        return calculateSubtotal();
    };

    const handleNextStep = () => {
        if(domainError){
            setError('Domain sudah digunakan!');
            return
        } else {
            setError('');
        }
        if (step < 3) {
            setStep(step + 1);
            window.scrollTo(0, 0);
        }
    };

    const handlePrevStep = () => {
        if (step > 1) {
        setStep(step - 1);
        window.scrollTo(0, 0);
        }
    };

    const handleCheckout = async () => {
        try {
            setIsLoading(true);
            const userSession = sessionStorage.getItem('user');
            if (!userSession) {
                window.location.href = '/login';
                return;
            }

            const user = JSON.parse(userSession);
            const response = await axios.get('/api/user/'+user.id, {
                headers: {'X-Requested': import.meta.env.VITE_API_KEY}
            });
            setSaldo(response.data.saldo);

            const orderItems = cartItems.map(item => ({
                product_id: item.product_id,
                quantity: item.qty,
                price: products[item.product_id]?.price || 0,
                name: products[item.product_id]?.name || 'Product',
                label: products[item.product_id]?.label || 'Product',
                category: products[item.product_id]?.category || 'Product',
                domain: cartItemDomains[item.product_id] || '-'
            }));

            let oid = generateorderid();

            orderid?  '' : setOrderID(oid);

            let proofuri = paymentProofURL;
            let upstat = uploadStatus;

            if (paymentMethod === 'saldo'){
                if (saldo >= calculateSubtotal()) {
                    proofuri = 'user.png';
                    upstat = 'success';
                } else {
                    setError('Saldo Tidak Cukup.');
                    return;
                }
            }

            const order = {
                order_id: orderid? orderid : oid,
                user_id: user.id,
                items: JSON.stringify(orderItems),
                payment_method: paymentMethod,
                subtotal: calculateSubtotal(),
                total: calculateTotal(),
                status: upstat === 'success' ? 'Waiting for Payment' : 'pending',
                payment_proof: proofuri,
                user_phone: user.phone
            };
            var today = new Date();
            var year = today.getFullYear();
            var mes = today.getMonth()+2;
            var dia = today.getDate();
            var fecha =year+"-"+mes+"-"+dia;

            orderItems? orderItems.map(async (item, index) => {
                const service = {
                    order_id: orderid? orderid : oid,
                    user_id: user.id,
                    name: item.label,
                    type: item.category,
                    domain: item.domain,
                    ip: '-',
                    plan: item.label,
                    status: 'pending',
                    renewal_date: fecha,
                    server_id: 1,
                };

                await axios.post('/api/services', service, {
                    headers: {'X-Requested': import.meta.env.VITE_API_KEY}
                });
            }) : '';

            await axios.post('/api/order', order, {
                headers: {'X-Requested': import.meta.env.VITE_API_KEY}
            });

            await axios.patch(`/api/cart/${user.id}`, {order: 1, cart: '[]'}, {
                headers: {'X-Requested': import.meta.env.VITE_API_KEY}
            });

            paymentMethod === 'saldo'? '' : await axios.patch('/api/payment/proof/1', {order_id: order.order_id, temp_filename: paymentProofURL}, {
                headers: {'X-Requested': import.meta.env.VITE_API_KEY}
            });

            setSukses('Order placed successfully!');
            updateCartCount(0);
            setStep(3);
        } catch (err) {
            console.error('Checkout error:', err);
            setError('An error occurred during checkout. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const CartItemSkeleton = () => (
        <div className="flex items-center justify-between py-4 border-b border-gray-800 animate-pulse">
        <div className="flex items-center">
            <div className="bg-gray-700 w-16 h-16 rounded-lg mr-4"></div>
            <div>
            <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-20"></div>
            </div>
        </div>
        <div className="flex items-center">
            <div className="bg-gray-700 h-8 w-24 rounded-lg mr-4"></div>
            <div className="bg-gray-700 h-6 w-6 rounded"></div>
        </div>
        </div>
    );

    const SummarySkeleton = () => (
        <div className="space-y-2 mb-4 animate-pulse">
        <div className="flex justify-between">
            <div className="h-4 bg-gray-700 rounded w-24"></div>
            <div className="h-4 bg-gray-700 rounded w-20"></div>
        </div>
        <div className="border-t border-gray-800 pt-2 mt-2 flex justify-between">
            <div className="h-5 bg-gray-700 rounded w-16"></div>
            <div className="h-5 bg-gray-600 rounded w-24"></div>
        </div>
        </div>
    );

    const PaymentMethodSkeleton = () => (
        <div className="space-y-4 animate-pulse">
        <div className="p-4 rounded-lg border border-gray-700 bg-gray-800/50">
            <div className="flex items-center">
            <div className="bg-gray-700 h-6 w-6 rounded mr-3"></div>
            <div>
                <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-48"></div>
            </div>
            </div>
        </div>
        <div className="p-4 rounded-lg border border-gray-700 bg-gray-800/50">
            <div className="flex items-center">
            <div className="bg-gray-700 h-6 w-6 rounded mr-3"></div>
            <div>
                <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-48"></div>
            </div>
            </div>
        </div>
        <div className="p-4 rounded-lg border border-gray-700 bg-gray-800/50">
            <div className="flex items-center">
            <div className="bg-gray-700 h-6 w-6 rounded mr-3"></div>
            <div>
                <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-48"></div>
            </div>
            </div>
        </div>
        </div>
    );

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= num
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-700/30'
                : 'bg-gray-800 text-gray-400'
            }`}>
                {num}
            </div>
            {num < 3 && (
                <div className={`w-16 h-1 ${
                step > num ? 'bg-blue-600' : 'bg-gray-700'
                }`}></div>
            )}
            </div>
        ))}
        </div>
    );

    const renderCartReview = () => (
        <div>
        <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
        {isLoading ? (
            <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/80 shadow-xl shadow-blue-900/20 mb-6">
            <CartItemSkeleton />
            <CartItemSkeleton />
            <CartItemSkeleton />
            </div>
        ) : cartItems.length === 0 ? (
            <div className="bg-gray-800/80 rounded-lg p-8 text-center">
            <ShoppingCart className="mx-auto text-gray-500 mb-4" size={48} />
            <p className="text-gray-300">Your cart is empty</p>
            <button
                onClick={() => window.location.href = '/product'}
                className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 py-2 px-4 rounded-lg text-white font-medium hover:from-blue-700 hover:to-indigo-700 transition"
            >
                Continue Shopping
            </button>
            </div>
        ) : (
            <>
            <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/80 shadow-xl shadow-blue-900/20 mb-6">
            {cartItems.map((item, index) => {
                const product = products[item.product_id] || {};
                return (
                    <div key={index} className="flex flex-col py-4 border-b border-gray-800 last:border-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                        <div className="bg-gray-800 w-16 h-16 rounded-lg mr-4 flex items-center justify-center overflow-hidden">
                            {product.image ? (
                            <img src={import.meta.env.VITE_URL + '/storage/' + product.image} alt={product.name} className="object-cover w-full h-full" />
                            ) : (
                            <ShoppingCart className="text-gray-600" size={24} />
                            )}
                        </div>
                        <div>
                            <h3 className="font-medium text-white">{product.label || `Product #${item.product_id}`}</h3>
                            <p className="text-gray-400 text-sm">Rp {product.price?.toLocaleString() || '0.00'}</p>
                        </div>
                        </div>
                        <div className="flex items-center">
                        <div className="flex items-center bg-gray-800 rounded-lg mr-4">
                            <button
                            onClick={() => updateQuantity(item.product_id, item.qty - 1)}
                            className="p-1 text-gray-400 hover:text-white"
                            >
                            <Minus size={16} />
                            </button>
                            <span className="px-3 text-white">{item.qty}</span>
                            <button
                            onClick={() => updateQuantity(item.product_id, item.qty + 1)}
                            className="p-1 text-gray-400 hover:text-white"
                            >
                            <Plus size={16} />
                            </button>
                        </div>
                        <button
                            onClick={() => removeItem(item.product_id)}
                            className="text-red-400 hover:text-red-300"
                        >
                            <Trash size={18} />
                        </button>
                        </div>
                    </div>

                    {product.category === "hosting" && (
                        <div className="mt-3 pl-20">
                            <div className="flex flex-col">
                            <label htmlFor={`domain-${item.product_id}`} className="text-sm text-gray-400 mb-1">
                                Enter Domain
                            </label>
                            <input
                                id={`domain-${item.product_id}`}
                                type="text"
                                placeholder="example.com"
                                value={cartItemDomains[item.product_id] || ''}
                                onChange={(e) => handleDomainChange(item.product_id, e.target.value)}
                                className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-white text-sm focus:border-blue-500 focus:outline-none"
                                required
                            />
                            </div>
                        </div>
                    )}

                    {product.category === "domain" && (
                        <div className="mt-3 pl-20">
                            <div className="flex flex-col">
                                <label htmlFor={`domain-${item.product_id}`} className="text-sm text-gray-400 mb-1">
                                    Enter Domain Name
                                </label>
                                <div className="flex">
                                    <input
                                        id={`domain-${item.product_id}`}
                                        type="text"
                                        placeholder="example.com"
                                        value={cartItemDomains[item.product_id] || ''}
                                        onChange={(e) => handleDomainChange(item.product_id, e.target.value)}
                                        className="flex-grow bg-gray-800 border border-gray-700 rounded-l-lg p-2 text-white text-sm focus:border-blue-500 focus:outline-none"
                                        required
                                    />
                                    <button
                                        onClick={() => checkDomainAvailability(item.product_id)}
                                        disabled={checkingDomain[item.product_id]}
                                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg px-4 flex items-center"
                                    >
                                        {checkingDomain[item.product_id] ? (
                                            <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                                        ) : (
                                            <Search size={16} />
                                        )}
                                    </button>
                                </div>

                                {domainStatus[item.product_id] && (
                                    <div className={`mt-2 py-2 px-3 rounded ${
                                        domainStatus[item.product_id].domainAvailability === "AVAILABLE"
                                        ? "bg-green-900/30 border border-green-800/50 text-green-400"
                                        : "bg-red-900/30 border border-red-800/50 text-red-400"
                                    }`}>
                                        <div className="flex items-center">
                                            {domainStatus[item.product_id].domainAvailability === "AVAILABLE" ? (
                                                <Check size={16} className="mr-2 text-green-400" />
                                            ) : (
                                                <AlertCircle size={16} className="mr-2 text-red-400" />
                                            )}
                                            <span>
                                                {domainStatus[item.product_id].domainName} is {" "}
                                                {domainStatus[item.product_id].domainAvailability === "AVAILABLE"
                                                    ? "available for registration"
                                                    : "already taken"}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    </div>
                );
                })}
            </div>

            <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/80 shadow-xl shadow-blue-900/20 mb-6">
                <h3 className="font-bold mb-4">Order Summary</h3>
                <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                    <span className="text-gray-300">Subtotal</span>
                    <span className="font-medium">Rp {calculateSubtotal().toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-800 pt-2 mt-2 flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-blue-400">Rp {calculateTotal().toLocaleString()}</span>
                </div>
                </div>
            </div>

            <div className="flex justify-between mt-8">
                <button
                onClick={() => window.location.href = '/product'}
                className="py-2 px-4 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700 transition"
                >
                Continue Shopping
                </button>
                <button
                onClick={handleNextStep}
                className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 py-3 px-6 rounded-lg text-white font-medium flex items-center hover:from-blue-700 hover:to-indigo-700 transition transform hover:scale-[1.02] shadow-lg shadow-blue-700/30"
                >
                Payment Method
                <ChevronRight className="ml-2" size={18} />
                </button>
            </div>
            </>
        )}
        </div>
    );

    const renderPaymentForm = () => (
        <div>
        <h2 className="text-xl font-bold mb-4">Payment Method</h2>
        {isLoading ? (
            <>
            <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/80 shadow-xl shadow-blue-900/20 mb-6">
                <PaymentMethodSkeleton />
            </div>
            <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/80 shadow-xl shadow-blue-900/20 mb-6">
                <h3 className="font-bold mb-4">Order Summary</h3>
                <SummarySkeleton />
            </div>
            </>
        ) : (
            <>
            <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/80 shadow-xl shadow-blue-900/20 mb-6">
                <div className="space-y-4">
                <div
                    className={`p-4 rounded-lg border ${
                    paymentMethod === 'qris'
                        ? 'border-blue-500 bg-blue-900/20'
                        : 'border-gray-700 bg-gray-800/50'
                    } cursor-pointer`}
                    onClick={() => setPaymentMethod('qris')}
                >
                    <div className="flex items-center">
                    <div className="text-blue-400 mr-3 font-bold text-xl">QR</div>
                    <div>
                        <h3 className="font-medium">QRIS</h3>
                        <p className="text-sm text-gray-400">Pay with QRIS Code</p>
                    </div>
                    </div>
                </div>

                <div
                    className={`p-4 rounded-lg border ${
                    paymentMethod === 'bank_transfer'
                        ? 'border-blue-500 bg-blue-900/20'
                        : 'border-gray-700 bg-gray-800/50'
                    } cursor-pointer`}
                    onClick={() => setPaymentMethod('bank_transfer')}
                >
                    <div className="flex items-center">
                    <div className="text-blue-400 mr-3 font-bold text-xl">BT</div>
                    <div>
                        <h3 className="font-medium">Bank Transfer</h3>
                        <p className="text-sm text-gray-400">Pay directly from your bank account</p>
                    </div>
                    </div>
                </div>

                <div
                    className={`p-4 rounded-lg border ${
                    paymentMethod === 'saldo'
                        ? 'border-blue-500 bg-blue-900/20'
                        : 'border-gray-700 bg-gray-800/50'
                    } cursor-pointer`}
                    onClick={() => setPaymentMethod('saldo')}
                >
                    <div className="flex items-center">
                    <div className="text-blue-400 mr-3 font-bold text-xl">Rp</div>
                    <div>
                        <h3 className="font-medium">Saldo (Rp. {saldo.toLocaleString()})</h3>
                        <p className="text-sm text-gray-400">Pay directly from your saldo</p>
                    </div>
                    </div>
                </div>
                {paymentMethod === 'qris' && (
                    <div className="mt-6 space-y-4">
                    <div className="flex flex-col items-center bg-gray-800/80 rounded-lg p-6 border border-gray-700/50">
                        <h3 className="font-medium text-center mb-4">Scan QR Code to Pay</h3>
                        <div className="bg-white p-4 rounded-lg mb-4 w-64 h-64 flex items-center justify-center">
                        <img
                            src={import.meta.env.VITE_URL + '/storage/qris.png'}
                            alt="QRIS Payment Code"
                            className="max-w-full max-h-full object-contain"
                        />
                        </div>
                        <p className="text-sm text-gray-400 text-center">
                        Open your bank or e-wallet app and scan this code to complete payment
                        </p>
                    </div>
                    </div>
                )}
                {paymentMethod === 'bank_transfer' && (
                    <div className="mt-6 space-y-4">
                    <div className="flex flex-col items-center bg-gray-800/80 rounded-lg p-6 border border-gray-700/50">
                        <h3 className="font-medium text-center mb-4">Bank Transfer Information</h3>
                        <div className="bg-gray-900/50 p-4 rounded-lg mb-6">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-gray-400">Bank Name:</div>
                                <div className="font-medium">Bank Jago</div>

                                <div className="text-gray-400">Account Number:</div>
                                <div className="font-medium">101940192191</div>

                                <div className="text-gray-400">Account Holder:</div>
                                <div className="font-medium">M FAHRI RAMADHAN</div>
                            </div>
                        </div>
                    </div>
                    </div>
                )}
                {paymentMethod && paymentMethod !== 'saldo' && (
                    <div>
                    <h4 className="font-medium mb-2">Upload Payment Proof</h4>
                    <p className="text-sm text-gray-400 mb-4">
                        Please upload a screenshot or photo of your payment receipt
                    </p>


                    <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                        previewUrl ? 'border-blue-500' : 'border-gray-600'
                    } transition-all duration-200 hover:border-blue-400 relative`}>

                        {!previewUrl ? (
                            <>
                                <div className="flex flex-col items-center justify-center">
                                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                                    <p className="text-gray-300 mb-2">Drag and drop your file here, or click to browse</p>
                                    <p className="text-xs text-gray-500">JPG or PNG, max 2MB</p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/jpeg, image/png"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleFileChange}
                                />
                            </>
                        ) : (
                            <div className="relative">
                                <img
                                    src={previewUrl}
                                    alt="Payment proof preview"
                                    className="max-h-64 max-w-full mx-auto rounded-lg"
                                />
                                <button
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                                    onClick={() => {
                                        setPaymentProof(null);
                                        setPreviewUrl('');
                                        setUploadStatus('');
                                    }}
                                >
                                    <Trash size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    {previewUrl && (
                        <div className="mt-4">
                            <button
                                onClick={handleUpload}
                                disabled={uploadStatus === 'uploading' || uploadStatus === 'success'}
                                className={`w-full py-2 px-4 rounded-lg flex items-center justify-center ${
                                    uploadStatus === 'success'
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : uploadStatus === 'uploading'
                                            ? 'bg-gray-600 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                } transition-colors duration-200`}
                            >
                                {uploadStatus === 'uploading' ? (
                                    <>
                                        <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                                        Uploading...
                                    </>
                                ) : uploadStatus === 'success' ? (
                                    <>
                                        <Check size={18} className="mr-2" />
                                        Uploaded Successfully
                                    </>
                                ) : (
                                    <>
                                        <Upload size={18} className="mr-2" />
                                        Upload Payment Proof
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                    </div>
                    )}
                    </div>
            </div>

            <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/80 shadow-xl shadow-blue-900/20 mb-6">
                <h3 className="font-bold mb-4">Order Summary</h3>
                <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                    <span className="text-gray-300">Subtotal</span>
                    <span className="font-medium">Rp {calculateSubtotal().toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-800 pt-2 mt-2 flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-blue-400">Rp {calculateTotal().toLocaleString()}</span>
                </div>
                </div>
            </div>

            <div className="flex justify-between mt-8">
                <button
                onClick={handlePrevStep}
                className="py-2 px-4 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700 transition"
                >
                Back to Cart
                </button>
                <button
                onClick={handleCheckout}
                disabled={isLoading}
                className={`bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 py-3 px-6 rounded-lg text-white font-medium flex items-center hover:from-blue-700 hover:to-indigo-700 transition transform hover:scale-[1.02] shadow-lg shadow-blue-700/30 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                {isLoading ? 'Processing...' : 'Place Order'}
                <ChevronRight className="ml-2" size={18} />
                </button>
            </div>
            </>
        )}
        </div>
    );

    const renderOrderConfirmation = () => (
        <div>
        <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/80 shadow-xl shadow-blue-900/20 mb-6 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <Check className="text-green-400" size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
            <p className="text-gray-300 mb-6">Your order has been placed successfully.</p>
            <div className="inline-block bg-gray-800/80 rounded-lg py-2 px-4 mb-6">
            <p className="text-gray-400 text-sm">Order ID</p>
            <p className="font-medium">{orderid}</p>
            </div>
            <p className="text-gray-300 mb-8">
            We have sent an order confirmation to your Whatsapp.
            You can check the status of your order in your account dashboard.
            </p>
            <div className="flex justify-center gap-4">
            <button
                onClick={() => window.location.href = '/'}
                className="py-3 px-6 bg-gray-800 rounded-lg text-white hover:bg-gray-700 transition"
            >
                Back to Home
            </button>
            <button
                onClick={() => window.location.href = '/client'}
                className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 py-3 px-6 rounded-lg text-white font-medium hover:from-blue-700 hover:to-indigo-700 transition"
            >
                Track Order
            </button>
            </div>
        </div>
        </div>
    );

    const FullPageSkeleton = () => (
        <div className="max-w-4xl mx-auto animate-pulse">
        <div className="text-center mb-8">
            <div className="h-8 bg-gray-700 rounded w-48 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-64 mx-auto"></div>
        </div>

        <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                {num < 3 && <div className="w-16 h-1 bg-gray-700"></div>}
            </div>
            ))}
        </div>

        <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/80 shadow-xl shadow-blue-900/20">
            <div className="h-6 bg-gray-700 rounded w-36 mb-6"></div>
            <div className="space-y-6">
            <CartItemSkeleton />
            <CartItemSkeleton />
            <CartItemSkeleton />
            </div>
            <div className="mt-8 bg-gray-800 rounded-lg p-4">
            <div className="h-5 bg-gray-700 rounded w-32 mb-4"></div>
            <SummarySkeleton />
            </div>
            <div className="flex justify-between mt-8">
            <div className="h-10 bg-gray-700 rounded w-32"></div>
            <div className="h-10 bg-gray-700 rounded w-40"></div>
            </div>
        </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-center relative overflow-hidden pt-20 pb-12">
        <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/15 to-indigo-900/20"></div>

            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl"></div>

            <div className="absolute inset-0 opacity-20"
            style={{
                backgroundImage: 'linear-gradient(to right, #132f4c 1px, transparent 1px), linear-gradient(to bottom, #132f4c 1px, transparent 1px)',
                backgroundSize: '20px 20px'
            }}>
            </div>
        </div>

        {sukses && (
            <div className="fixed bottom-5 right-5 bg-gray-800 text-white px-6 py-3 rounded-md shadow-lg flex items-center z-20">
            <Check className="h-5 w-5 mr-2 text-green-500" />
            <span dangerouslySetInnerHTML={{ __html: sukses }}></span>
            </div>
        )}

        {error && (
            <div className="fixed bottom-5 right-5 bg-gray-800 text-white px-6 py-3 rounded-md shadow-lg flex items-center z-20">
            <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
            <span dangerouslySetInnerHTML={{ __html: error }}></span>
            </div>
        )}

        <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-400 to-indigo-500">
                Checkout
                </h1>
                <p className="text-gray-300 mt-2">
                Complete your purchase with our secure checkout process
                </p>
            </div>

            {renderStepIndicator()}

            <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/80 shadow-xl shadow-blue-900/20">
                {step === 1 && renderCartReview()}
                {step === 2 && renderPaymentForm()}
                {step === 3 && renderOrderConfirmation()}
            </div>
            </div>
        </div>
        </div>
    );
};

export default CartCheckoutPage;
