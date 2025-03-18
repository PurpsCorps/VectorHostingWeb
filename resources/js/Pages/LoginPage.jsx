import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import axios from 'axios';
import bcrypt from 'bcryptjs'; // You'll need to install this package

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    var rand = function() {
        return Math.random().toString(36).substr(2); // remove `0.`
    };

    var token = function() {
        return rand() + rand(); // to make it longer
    };

    // Fetch users data on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://VectorHosting.test/api/user/', {headers: {'X-Requested': import.meta.env.VITE_API_KEY}});
                setUsers(response.data);
            } catch (err) {
                console.error('Error fetching user data:', err);
            }
        };

        fetchUsers();
    }, []);

    const toggleForm = () => {
        setIsLogin(!isLogin);
        // Clear form fields and errors when switching forms
        setEmail('');
        setPassword('');
        setUsername('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
        if (isLogin) {
            // Find user by email or username
            const user = users.find(user =>
                (user.email).toLowerCase() === username.toLowerCase() || (user.name).toLowerCase() === username.toLowerCase()
            );

            if (!user) {
                setError('User not found. Please check your credentials.');
                setIsLoading(false);
                return;
            }

            // For direct hash comparison (since we don't have access to the original password)
            // This is a simplified approach - in a real-world scenario, you would use bcrypt.compare
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                // Successful login
                let tokens = token();
                await axios.patch('http://VectorHosting.test/api/user/'+ user.id, {token: tokens}, {headers: {'X-Requested': import.meta.env.VITE_API_KEY}});
                if(sessionStorage.getItem('user')) {
                    sessionStorage.removeItem('user');
                }
                // Store user info in sessionStorage or context/redux
                sessionStorage.setItem('user', JSON.stringify({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    loginToken: tokens,
                }));

                // Redirect to dashboard or home
                window.location.href = '/';
            } else {
                setError('Invalid password. Please try again.');
            }
        } else {
            // Registration logic
            // Check if username/email already exists
            const existingUser = users.find(user =>
                (user.email).toLowerCase() === username.toLowerCase() || (user.name) === username.toLowerCase()
            );

            if (existingUser) {
                setError('Username or email already exists');
            } else {
                // In a real implementation, you would hash the password before sending
                const hashedPassword = await bcrypt.hash(password, 10);

                // Create a new user object matching the API structure
                const newUser = {
                    name: username,
                    email: email,
                    password: hashedPassword, // In production, use hashedPassword
                    email_verified_at: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };

                // Here you would make a POST request to register
                // await axios.post('APITEST', newUser);

                console.log('Registration data:', newUser);
                alert('Registration successful! Please login.');
                setIsLogin(true);
            }
        }
        } catch (err) {
            console.error('Authentication error:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-center relative overflow-hidden pt-20">
        {/* Enhanced Background Gradient */}
        <div className="absolute inset-0">
            {/* Primary gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/15 to-indigo-900/20"></div>

            {/* Animated glow spots */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl"></div>

            {/* Subtle grid overlay */}
            <div className="absolute inset-0 opacity-20"
                style={{
                backgroundImage: 'linear-gradient(to right, #132f4c 1px, transparent 1px), linear-gradient(to bottom, #132f4c 1px, transparent 1px)',
                backgroundSize: '20px 20px'
                }}>
            </div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-md mx-auto">
            {/* Logo/Branding Area */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-400 to-indigo-500">
                {isLogin ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className="text-gray-300 mt-2">
                {isLogin
                    ? 'Sign in to access your hosting dashboard'
                    : 'Join us and experience premium hosting services'}
                </p>
            </div>

            {/* Login/Register Form */}
            <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/80 shadow-xl shadow-blue-900/20">
                {/* Form Header/Tabs */}
                <div className="flex mb-6">
                <button
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-3 text-center font-medium rounded-l-lg transition ${
                    isLogin
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-700/30'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                >
                    Login
                </button>
                <button
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-3 text-center font-medium rounded-r-lg transition ${
                    !isLogin
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-700/30'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                >
                    Register
                </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-start">
                        <AlertCircle className="text-red-400 mr-2 flex-shrink-0 mt-0.5" size={18} />
                        <p className="text-red-200 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                {/* Email Field (Only for Register) */}
                {!isLogin && (
                    <div className="mb-4">
                        <div className="flex items-center bg-gray-800/80 rounded-lg p-3 mb-1 border border-gray-700/50 focus-within:border-blue-500/50 transition">
                        <Mail className="text-blue-400 mr-2" size={20} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="bg-transparent border-none outline-none w-full text-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        </div>
                    </div>
                )}

                {/* Username Field */}
                    <div className="mb-4">
                        <div className="flex items-center bg-gray-800/80 rounded-lg p-3 mb-1 border border-gray-700/50 focus-within:border-blue-500/50 transition">
                        <User className="text-blue-400 mr-2" size={20} />
                        <input
                            type="text"
                            placeholder="Username"
                            className="bg-transparent border-none outline-none w-full text-white"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required={!isLogin}
                        />
                        </div>
                    </div>

                {/* Password Field */}
                <div className="mb-6">
                    <div className="flex items-center bg-gray-800/80 rounded-lg p-3 mb-1 border border-gray-700/50 focus-within:border-blue-500/50 transition">
                    <Lock className="text-blue-400 mr-2" size={20} />
                    <input
                        type="password"
                        placeholder="Password"
                        className="bg-transparent border-none outline-none w-full text-white"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    </div>
                    {isLogin && (
                    <div className="text-right">
                        <a href="#forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
                        Forgot password?
                        </a>
                    </div>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center hover:from-blue-700 hover:to-indigo-700 transition transform hover:scale-[1.02] shadow-lg shadow-blue-700/30"
                >
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="ml-2" size={18} />
                </button>

                </form>
            </div>

            {/* Form Footer */}
            <div className="text-center mt-6 text-gray-300">
                {isLogin ? (
                <p>
                    Don't have an account?{' '}
                    <button onClick={toggleForm} className="text-blue-400 hover:text-blue-300 font-medium">
                    Sign up
                    </button>
                </p>
                ) : (
                <p>
                    Already have an account?{' '}
                    <button onClick={toggleForm} className="text-blue-400 hover:text-blue-300 font-medium">
                    Sign in
                    </button>
                </p>
                )}
            </div>
            </div>
        </div>
        </div>
    );
};

export default LoginPage;