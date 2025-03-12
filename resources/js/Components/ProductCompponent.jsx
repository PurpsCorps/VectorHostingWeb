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

    if (loading) return <div>Memuat...</div>;
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