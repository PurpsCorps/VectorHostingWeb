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

const ProductPage = (props) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://VectorHosting.test/api/product/', {headers: {'X-Requested': import.meta.env.VITE_API_KEY}});
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

    const filteredData = data.filter(item => item.category === props.category && item.show);

    if (filteredData.length === 0) {
        return <div style={{textAlign: "center"}}>Tidak ada produk dalam kategori ini</div>;
    }

    return (
        <div className="grid md:grid-cols-3 gap-8">
            {filteredData.map(item => (
                <div
                key={item.name}
                className={`
                    bg-gray-900 border border-gray-800 rounded-2xl p-6 relative overflow-hidden
                    transform transition duration-300
                    ${item.recommended
                    ? 'scale-105 border-blue-600 shadow-2xl'
                    : 'hover:scale-105 hover:border-gray-600'}
                `}
                >
                {item.recommended
                    ? <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-bl-lg z-10">
                    Recommended
                    </div>
                    : <div></div>
                }
                <h3 className="text-2xl font-bold mb-4 text-blue-500">{item.label}</h3>
                <div className="text-4xl font-extrabold mb-6">
                    Rp{item.price.toLocaleString()}
                    <span className="text-base text-gray-500 ml-2">/bulan</span>
                </div>
                <ul className="space-y-4 mb-8">
                    {Array.isArray(item.spek) ? (
                        item.spek.map((feature, idx) => (
                            <li
                                key={idx}
                                className="flex items-center text-gray-300"
                            >
                                <Check className="text-blue-500 mr-3" size={20} />
                                {feature}
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-300">No specifications available</li>
                    )}
                </ul>
                <button className="w-full bg-blue-600 py-3 rounded-full hover:bg-blue-700 transition">
                    Pilih Paket <ChevronRight className="inline ml-2" size={20} />
                </button>
                </div>
            ))}
        </div>
    );
};

export default ProductPage;