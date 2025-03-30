import React, { useState, useEffect } from 'react';
import {
  Server,
  Shield,
  Cloud,
  Rocket,
  Check,
  ChevronRight,
  AlignCenter
} from 'lucide-react';
import axios from 'axios';

const ProductShow = (props) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/product/', {headers: {'X-Requested': import.meta.env.VITE_API_KEY}});
                // Parse the spek JSON string into an actual array for each item
                const parsedData = response.data.map(item => ({
                    ...item,
                    spek: parseSpekData(item.spek)
                }));
                setData(parsedData);
                setLoading(false);
            } catch (err) {
                setError('Gagal mengambil data');
                setLoading(false);
                console.error('Error:', err);
            }
        };

        fetchData();
    }, []);

    // Function to parse the spek data from the database format to a usable array
    const parseSpekData = (spekData) => {
        try {
            // If it's already a string, parse it
            if (typeof spekData === 'string') {
                spekData = JSON.parse(spekData);
            }

            // Handle the specific format from your database
            if (Array.isArray(spekData) && spekData.length > 0 && typeof spekData[0] === 'object') {
                // Convert the object with numeric keys to an array of values
                return Object.values(spekData[0]);
            }

            // If it's already an array, return it
            if (Array.isArray(spekData)) {
                return spekData;
            }

            // Fallback to empty array if format is unexpected
            return [];
        } catch (error) {
            console.error('Error parsing spek data:', error);
            return [];
        }
    };

    // Add this function to your ProductShow component

    const addCart = async (productId, quantity = 1) => {
        try {
            let baru = false;
        // First check if the product is already in the cart
            const userSession = sessionStorage.getItem('user');
            const Userdata = JSON.parse(userSession);
            if (!userSession) {
                window.location.href = '/login';
                return false;
            }
            const response = await axios.get(`/api/cart/${Userdata.id}/`, {
                headers: {
                'X-Requested': import.meta.env.VITE_API_KEY
                }
            });

            if (response.data == 0) {
                baru = true;
            }

            let currentCart = response.data.cart || [];

            if (typeof currentCart === 'string') {
                try {
                    currentCart = JSON.parse(currentCart);
                } catch (e) {
                    currentCart = [];
                }
            }

            if (!Array.isArray(currentCart)) {
                currentCart = [];
            }

            // Check if product is already in cart
            const existingProductIndex = currentCart.findIndex(item => item.product_id === productId);

            if (existingProductIndex >= 0) {
                // Product exists, update quantity
                currentCart[existingProductIndex].qty += quantity;
            } else {
                // Product doesn't exist, add new item
                currentCart.push({
                    "qty": quantity,
                    "product_id": productId
                });
            }

            // Update the cart on the server
            if (baru) {
                const updateResponse = await axios.post('/api/cart', {
                    user_id: Userdata.id,
                    cart: JSON.stringify(currentCart),
                    count: currentCart.length
                }, {
                    headers: {
                        'X-Requested': import.meta.env.VITE_API_KEY
                    }
                });

                if (updateResponse.status === 201) {
                    setNotificationMessage('Produk berhasil ditambahkan ke keranjang');
                    // setCartCount(currentCart.length);
                    setShowNotification(true);
                    setTimeout(() => setShowNotification(false), 3000); // Hide after 3 seconds
                    return true;
                } else {
                    throw new Error('Failed to update cart');
                }
            } else {
                const updateResponse = await axios.patch('/api/cart/'+Userdata.id, {
                    cart: JSON.stringify(currentCart),
                    count: currentCart.length
                }, {
                    headers: {
                        'X-Requested': import.meta.env.VITE_API_KEY
                    }
                });

                if (updateResponse.status === 200) {
                    setNotificationMessage('Produk berhasil ditambahkan ke keranjang');
                    setShowNotification(true);
                    // setCartCount(currentCart.length);
                    setTimeout(() => setShowNotification(false), 3000); // Hide after 3 seconds
                    return true;
                } else {
                    throw new Error('Failed to update cart');
                }
            }


            // Handle success
        } catch (error) {
            console.error('Error adding product to cart:', error);
            setNotificationMessage('Gagal menambahkan produk ke keranjang');
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000); // Hide after 3 seconds
            return false;
        }
    };

    if (loading) return <div className="text-center">
        <div role="status">
            <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span className="sr-only">Loading...</span>
        </div>
    </div>;
    if (error) return <div>{error}</div>;

    const filteredProducts = props.activeCategory === 'all'
    ? data.filter(product => product.category !== "shared" && product.show === 1)
    : data.filter(product => product.category === props.activeCategory && product.show === 1);

    if (filteredProducts.length === 0) {
        return <div style={{textAlign: "center"}}>Tidak ada produk dalam kategori ini</div>;
    }

    return (

        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {showNotification && (
                <div className="fixed bottom-5 right-5 bg-gray-800 text-white px-6 py-3 rounded-md shadow-lg flex items-center z-20">
                    {notificationMessage.includes('berhasil') ? (
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    ) : (
                    <AlignCenter className="h-5 w-5 mr-2 text-red-500" />
                    )}
                    {notificationMessage}
                </div>
            )}
            {filteredProducts.map((product) => (
                <div key={product.id} className="relative bg-gray-800 rounded-lg overflow-hidden border border-gray-700 group transform transition duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-blue-900/20">
                {product.recommended
                    ? <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                    Rekomendasi
                    </div>
                    : <div></div>
                }
                <div className="relative overflow-hidden">
                    <img
                    src={product.image? import.meta.env.VITE_URL + '/storage/' + product.image : 'https://placehold.co/600x400'}
                    alt={product.name}
                    className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-white">{product.label}</h3>
                    <p className="text-gray-400 mb-4 h-12 overflow-hidden">{product.spek}</p>
                    <div className="mt-4 mb-4">
                    <span className="text-2xl font-bold text-blue-400">Rp{product.price.toLocaleString()}</span>
                    </div>
                    <div className="flex space-x-2">
                    <button
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300 flex items-center justify-center group-hover:bg-blue-500"
                        onClick={() => addCart(product.id, 1)}
                    >
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Tambah ke Keranjang
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md transition duration-300">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                    </div>
                </div>
                </div>
            ))}
        </div>
    );
};

export default ProductShow;