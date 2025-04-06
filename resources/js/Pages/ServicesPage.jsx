import React, { useState, useEffect } from 'react';
import { Settings, Code, Database, Globe, Server, ShieldCheck, Clock, ChevronRight, AlertCircle, Search } from 'lucide-react';
import axios from 'axios';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Check if user is logged in
        const userSession = sessionStorage.getItem('user');
        if (!userSession) {
          window.location.href = '/login';
          return;
        }

        // Fetch services
        const userObj = JSON.parse(userSession);
        const servicesResponse = await axios.get(`/api/services/${userObj.id}`, {
          headers: {'X-Requested': import.meta.env.VITE_API_KEY}
        });

        setServices(servicesResponse.data);

        // Fetch or create categories from services
        const categoriesSet = new Set();
        servicesResponse.data.forEach(service => {
          if (service.type) {
            categoriesSet.add(service.type);
          }
        });

        setCategories(['all', ...Array.from(categoriesSet)]);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter services based on selected category and search query
  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.type === selectedCategory;
    const matchesSearch = service.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.domain?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get icon based on category
  const getCategoryIcon = (category) => {
    switch(category?.toLowerCase()) {
      case 'web development':
        return <Code size={24} />;
      case 'hosting':
        return <Server size={24} />;
      case 'database':
        return <Database size={24} />;
      case 'domain':
        return <Globe size={24} />;
      case 'security':
        return <ShieldCheck size={24} />;
      case 'maintenance':
        return <Clock size={24} />;
      default:
        return <Settings size={24} />;
    }
  };

  // Skeleton components
  const ServiceCardSkeleton = () => (
    <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/80 shadow-xl shadow-blue-900/20 animate-pulse">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-lg bg-gray-800 mr-4"></div>
        <div>
          <div className="h-5 bg-gray-800 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-800 rounded w-24"></div>
        </div>
      </div>
      <div className="h-16 bg-gray-800 rounded mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-800 rounded w-20"></div>
        <div className="h-10 w-10 bg-gray-800 rounded-full"></div>
      </div>
    </div>
  );

  const CategoryTabSkeleton = () => (
    <div className="h-10 bg-gray-800 rounded-full px-6 animate-pulse"></div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-center relative overflow-hidden pt-20 pb-12">
      {/* Enhanced Background Gradient - Same as CartCheckoutPage */}
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

      {error && (
        <div className="fixed bottom-5 right-5 bg-gray-800 text-white px-6 py-3 rounded-md shadow-lg flex items-center z-20">
          <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Area */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-400 to-indigo-500">
              Your Services
            </h1>
            <p className="text-gray-300 mt-2">
              Control Service mu dari panel ini.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-900/60 backdrop-blur-xl w-full py-3 pl-10 pr-4 border border-gray-800/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white"
              />
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {isLoading ? (
              Array(5).fill(0).map((_, index) => (
                <CategoryTabSkeleton key={index} />
              ))
            ) : (
              categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-full transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg shadow-blue-700/30'
                      : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))
            )}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array(6).fill(0).map((_, index) => (
                <ServiceCardSkeleton key={index} />
              ))
            ) : filteredServices.length === 0 ? (
              <div className="col-span-3 bg-gray-900/60 backdrop-blur-xl rounded-2xl p-10 border border-gray-800/80 shadow-xl shadow-blue-900/20 text-center">
                <Settings className="mx-auto text-gray-500 mb-4" size={48} />
                <p className="text-gray-300 text-xl mb-2">No services found</p>
                <p className="text-gray-400">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/80 shadow-xl shadow-blue-900/20 transition-all hover:shadow-2xl hover:shadow-blue-900/30 flex flex-col h-full"
                >
                  {/* Header dengan Icon dan Nama */}
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-700/30 mr-4">
                      {getCategoryIcon(service.type)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">{service.name}</h3>
                      <p className="text-blue-400">{service.type?.toUpperCase()}</p>
                    </div>
                  </div>

                  {/* Content - menggunakan flex-grow untuk mengisi ruang */}
                  <div className="flex-grow">
                    <p className="text-gray-300 line-clamp-3"><b>Order ID:</b> #{service.order_id}</p>
                    <p className="text-gray-300"><b>Domain:</b> {service.domain}</p>
                    <p className="text-gray-300 mb-4 line-clamp-3"><b>Expired:</b> {service.renewal_date}</p>

                    {service.status === "active" && service.type === "hosting" && (
                      <div>
                        <p className="text-gray-300 mb-4 line-clamp-3"><b>IP:</b> {service.ip}</p>
                        <p className="text-gray-300 mb-4 line-clamp-3"><b>Nameserver:</b><br/>srv1.vector-hosting.com<br/>srv2.vector-hosting.com</p>
                        <p className="text-gray-300 mb-4"><b>cPanel Login Information:</b><br/><b>Username:</b> {service.panel_username}<br/><b>Password:</b> {service.panel_password}</p>
                      </div>
                    )}

                    {service.status === "active" && service.type === "domain" && (
                      <div>
                        <p className="text-gray-300 mb-4"><b>Login Information:</b><br/><b>Email:</b> {service.panel_username}<br/><b>Password:</b> {service.panel_password}</p>
                      </div>
                    )}
                  </div>

                  {/* Footer dengan Status dan Button - selalu di bawah */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-800">
                    <div className="flex items-center h-10">
                      <span className={`font-semibold px-3 py-2 rounded ${
                        service.status === "active" ? 'text-green-600 bg-green-600/10' : 'text-yellow-500 bg-yellow-500/10'
                      }`}>
                        {service.status?.toUpperCase()}
                      </span>
                    </div>

                    {service.status === "active" && service.type === "hosting" && (
                      <button
                        onClick={() => window.location.href = 'https://panel.vector-hosting.com'}
                        className="h-10 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300 flex items-center justify-center"
                      >
                        Login cPanel
                      </button>
                    )}

                    {service.status === "active" && service.type === "domain" && (
                      <button
                        onClick={() => window.location.href = 'https://my.ionos.com/domains'}
                        className="h-10 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300 flex items-center justify-center"
                      >
                        Login Domain
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom CTA */}
          {!isLoading && filteredServices.length > 0 && (
            <div className="mt-12 text-center">
              <p className="text-gray-300 mb-4">Need a custom solution for your business?</p>
              <a
                href="/contact"
                className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 py-3 px-8 rounded-lg text-white font-medium inline-flex items-center hover:from-blue-700 hover:to-indigo-700 transition transform hover:scale-[1.02] shadow-lg shadow-blue-700/30"
              >
                Contact Our Team
                <ChevronRight className="ml-2" size={18} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;