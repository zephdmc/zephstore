// import { Link, NavLink } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { useCart } from '../../context/CartContext';

// export default function Header() {
//     const { currentUser, loading } = useAuth();
//     const { cartCount } = useCart();

//     return (
//         <header className="bg-white shadow-sm">
//             <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//                 <Link to="/" className="text-2xl font-bold text-primary">
//                     Zeph Store
//                 </Link>

//                 <nav className="hidden md:flex space-x-6">
//                     <NavLink to="/" className="hover:text-primary transition">
//                         Home
//                     </NavLink>
//                     <NavLink to="/products" className="hover:text-primary transition">
//                         Products
//                     </NavLink>
//                     {currentUser && (
//                         <NavLink to="/orders" className="hover:text-primary transition">
//                             Orders
//                         </NavLink>
//                     )}
//                     {currentUser?.role === 'admin' && (
//                         <NavLink to="/admin" className="hover:text-primary transition">
//                             Admin
//                         </NavLink>
//                     )}
//                 </nav>

//                 <div className="flex items-center space-x-4">
//                     <Link to="/cart" className="relative">
//                         <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             className="h-6 w-6"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
//                             />
//                         </svg>
//                         {cartCount > 0 && (
//                             <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                                 {cartCount}
//                             </span>
//                         )}
//                     </Link>

//                     {!loading && (
//                         currentUser ? (
//                             <div className="flex items-center space-x-2">
//                                 <span>{currentUser.email}</span>
//                                 <button
//                                     onClick={() => auth.signOut()}
//                                     className="text-gray-600 hover:text-primary transition"
//                                 >
//                                     Logout
//                                 </button>
//                             </div>
//                         ) : (
//                             <div className="flex space-x-2">
//                                 <Link
//                                     to="/login"
//                                     className="text-gray-600 hover:text-primary transition"
//                                 >
//                                     Login
//                                 </Link>
//                                 <Link
//                                     to="/register"
//                                     className="text-gray-600 hover:text-primary transition"
//                                 >
//                                     Register
//                                 </Link>
//                             </div>
//                         )
//                     )}
//                 </div>
//             </div>
//         </header>
//     );
// }
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { requestNotificationPermission, setupMessageHandler } from '../../firebase/config';
import {
    FiShoppingCart,
    FiUser,
    FiLogOut,
    FiAlertTriangle,
    FiMenu,
    FiX,
    FiSearch,
    FiBell,
    FiChevronDown,
    FiCheck
} from 'react-icons/fi';
import debounce from 'lodash.debounce';
import axios from 'axios';
import {
    getSearchSuggestions,
    searchProducts
} from '../../services/searchService';
import {
    getNotifications,
    markAsRead,
    markAllAsRead
} from '../../services/notificationService';

export default function Header() {
    const {
        currentUser,
        logoutLoading,
        signOut,
        sessionExpiresAt,
        refreshToken
    } = useAuth();

    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const searchRef = useRef(null);
    const userMenuRef = useRef(null);

    // Session timeout warning
    useEffect(() => {
        if (!sessionExpiresAt) return;

        const updateTimeoutWarning = () => {
            const remainingTime = sessionExpiresAt - Date.now();
            setTimeLeft(Math.max(0, remainingTime));
            setShowTimeoutWarning(remainingTime < 5 * 60 * 1000);
        };

        updateTimeoutWarning();
        const interval = setInterval(updateTimeoutWarning, 30000);
        return () => clearInterval(interval);
    }, [sessionExpiresAt]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
                setMobileMenuOpen(false);
            }
            if (showUserDropdown && userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserDropdown(false);
            }
            if (showNotifications && !event.target.closest('.notifications-container')) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [mobileMenuOpen, showUserDropdown, showNotifications]);


    // Add this useEffect in your component
    useEffect(() => {
        if (!currentUser) return;

        const fetchNotifications = async () => {
            try {
                const response = await getNotifications();
                setNotifications(response);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            }
        };

        // Request permission on first load
        requestNotificationPermission(currentUser.uid)
            .catch(error => console.error('Notification permission error:', error));

        // Handle incoming messages
        const unsubscribe = setupMessageHandler((payload) => {
            // Show toast notification
            toast.info(payload.notification?.body || 'New notification');

            // Refresh notifications
            fetchNotifications();

            // Optional: Play sound
            const audio = new Audio('/notification-sound.mp3');
            audio.play().catch(e => console.error('Audio play failed:', e));
        });

        return () => {
            unsubscribe(); // Clean up the message handler
        };
    }, [currentUser]);

    // Search suggestions
    useEffect(() => {
        if (searchQuery.trim().length > 2) {
            const fetchSuggestions = async () => {
                try {
                    const data = await getSearchSuggestions(searchQuery);
                    setSearchSuggestions(data);
                    setShowSuggestions(true);
                } catch (error) {
                    setSearchSuggestions([]);
                }
            };

            const debounceTimer = setTimeout(fetchSuggestions, 300);
            return () => clearTimeout(debounceTimer);
        } else {
            setSearchSuggestions([]);
            setShowSuggestions(false);
        }
    }, [searchQuery]);


    // In your Header component, update the logout handler
    const handleLogout = async () => {
        try {
            await signOut({
                redirectTo: '/login',
                onSuccess: () => {
                    toast.success("Logged out successfully");
                    setMobileMenuOpen(false);
                },
            });
        } catch (error) {
            toast.error(`Logout failed: ${error.message}`);
        }
    };
    const handleSearch = debounce(() => {
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setShowSuggestions(false);
            if (searchRef.current) searchRef.current.blur();
        }
    }, 500);




    // Mark as read functions
    const handleMarkAsRead = async (id) => {
        try {
            await markAsRead(id);
            setNotifications(notifications.map(n =>
                n._id === id ? { ...n, read: true } : n
            ));
        } catch (error) {
            toast.error('Failed to mark as read');
        }
    };


    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (error) {
            toast.error('Failed to mark all as read');
        }
    };


    const unreadNotifications = notifications.filter(n => !n.read).length;

    const formatTime = (ms) => {
        if (!ms) return '0:00';
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            {/* Session Timeout Warning */}
            {showTimeoutWarning && (
                <div className="bg-yellow-100 text-yellow-800 p-2 text-sm flex items-center justify-center gap-2">
                    <FiAlertTriangle className="shrink-0" />
                    <span>Session expires in {formatTime(timeLeft)}. Move your mouse to extend.</span>
                </div>
            )}

            <div className="container mx-auto px-4 py-4">
                {/* Top Bar */}
                <div className="flex justify-between items-center">
                    {/* Logo and Mobile Menu Button */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden text-gray-600 hover:text-primary transition"
                        >
                            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                        <Link to="/" className="text-2xl font-bold text-primary">
                            Bellebeau Aesthetics
                        </Link>
                    </div>

                    {/* Desktop Search Bar with Suggestions */}
                    <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                onFocus={() => searchQuery.length > 2 && setShowSuggestions(true)}
                                ref={searchRef}
                            />
                            <button
                                onClick={handleSearch}
                                className="absolute right-3 top-2.5 text-gray-500 hover:text-primary transition"
                            >
                                <FiSearch size={18} />
                            </button>

                            {/* Search Suggestions */}
                            {showSuggestions && searchSuggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                                    {searchSuggestions.map(item => (
                                        <div
                                            key={item.id}
                                            className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex justify-between items-center"
                                            onClick={() => {
                                                navigate(`/products/${item.id}`);
                                                setShowSuggestions(false);
                                            }}
                                        >
                                            <div>
                                                <div className="font-medium">{item.name}</div>
                                                <div className="text-xs text-gray-500">{item.category}</div>
                                            </div>
                                            <FiChevronDown className="text-gray-400 transform rotate-90" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right-side Icons */}
                    <div className="flex items-center space-x-4">
                        {/* Mobile Search Button */}
                        <button
                            className="md:hidden text-gray-600 hover:text-primary transition"
                            onClick={() => {
                                setMobileMenuOpen(false);
                                searchRef.current?.focus();
                            }}
                        >
                            <FiSearch size={20} />
                        </button>

                        {/* Notifications */}
                        {currentUser && (
                            <div className="relative notifications-container">
                                <button
                                    className="text-gray-600 hover:text-primary transition relative"
                                    onClick={() => setShowNotifications(!showNotifications)}
                                >
                                    <FiBell size={20} />
                                    {unreadNotifications > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                            {unreadNotifications}
                                        </span>
                                    )}
                                </button>
                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                                        <div className="p-3 font-medium border-b flex justify-between items-center">
                                            <span>Notifications</span>
                                            {unreadNotifications > 0 && (
                                                <button
                                                    onClick={handleMarkAllAsRead}
                                                    className="text-xs text-primary hover:underline"
                                                >
                                                    Mark all as read
                                                </button>
                                            )}
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.map(notification => (
                                                    <div
                                                        key={notification.id}
                                                        className={`p-3 border-b flex justify-between items-start ${!notification.read ? 'bg-blue-50' : ''
                                                            }`}
                                                    >
                                                        <div>
                                                            <div className="text-sm">{notification.text}</div>
                                                            <div className="text-xs text-gray-500 mt-1">{notification.date}</div>
                                                        </div>
                                                        {!notification.read && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleMarkAsRead(notification.id);
                                                                }}
                                                                className="text-green-500 hover:text-green-700 ml-2"
                                                                title="Mark as read"
                                                            >
                                                                <FiCheck size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-4 text-gray-500 text-center">No notifications</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Cart */}
                        <Link to="/cart" className="relative group">
                            <FiShoppingCart className="h-6 w-6 text-gray-600 group-hover:text-primary transition" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Auth Section */}
                        {currentUser ? (
                            <div className="hidden md:block relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                                    className="flex items-center space-x-1 text-gray-600 hover:text-primary transition"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                        {currentUser.photoURL ? (
                                            <img
                                                src={currentUser.photoURL}
                                                alt="User"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FiUser className="text-gray-500" />
                                        )}
                                    </div>
                                    <FiChevronDown className={`transition-transform ${showUserDropdown ? 'transform rotate-180' : ''}`} />
                                </button>

                                {/* User Dropdown */}
                                {showUserDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                                        <div className="p-4 border-b">
                                            <div className="font-medium">{currentUser.displayName || currentUser.email.split('@')[0]}</div>
                                            <div className="text-xs text-gray-500">{currentUser.email}</div>
                                        </div>
                                        {/* <NavLink
                                            to="/profile"
                                            onClick={() => setShowUserDropdown(false)}
                                            className="block px-4 py-2 hover:bg-gray-50 text-sm"
                                        >
                                            My Profile
                                        </NavLink> */}
                                        {/* Add this new NavLink for Admin Dashboard */}
                                        {currentUser.isAdmin && (
                                            <NavLink
                                                to="/admin"
                                                onClick={() => setShowUserDropdown(false)}
                                                className="block px-4 py-2 hover:bg-gray-50 text-sm"
                                            >
                                                Dashboard
                                            </NavLink>
                                        )}
                                        <NavLink
                                            to="/about"
                                            onClick={() => setShowUserDropdown(false)}
                                            className="block px-4 py-2 hover:bg-gray-50 text-sm"
                                        >
                                            About
                                        </NavLink> <NavLink
                                            to="/products"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={({ isActive }) =>
                                                `py-2 ${isActive ? 'text-primary text-sm' : 'block px-4 py-2 hover:bg-gray-50 text-sm'}`
                                            }
                                        >
                                            Products
                                        </NavLink>
                                        {currentUser && (
                                            <>
                                                <NavLink
                                                    to="/orders"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={({ isActive }) =>
                                                        `py-2 ${isActive ? 'text-primary text-sm' : 'block px-4 py-2 hover:bg-gray-50 text-sm'}`
                                                    }
                                                >
                                                    Orders
                                                </NavLink>
                                                {/* <NavLink
                                    to="/profile"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `py-2 ${isActive ? 'text-primary font-medium' : 'text-gray-600'}`
                                    }
                                >
                                    Profile
                                </NavLink> */}
                                                {currentUser.isAdmin && (
                                                    <NavLink
                                                        to="/admin"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className={({ isActive }) =>
                                                            `py-2 ${isActive ? 'text-primary font-medium' : 'text-gray-600'}`
                                                        }
                                                    >
                                                        Dashboard
                                                    </NavLink>
                                                )}

                                            </>
                                        )}
                                        {/* <NavLink
                                            to="/settings"
                                            onClick={() => setShowUserDropdown(false)}
                                            className="block px-4 py-2 hover:bg-gray-50 text-sm"
                                        >
                                            Settings
                                        </NavLink> */}
                                        <button
                                            onClick={handleLogout}
                                            disabled={logoutLoading}
                                            className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm ${logoutLoading ? 'opacity-50 cursor-wait' : ''
                                                }`}
                                        >
                                            {logoutLoading ? 'Signing out...' : 'Sign out'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden md:flex space-x-3">
                                <Link
                                    to="/about"
                                    className="text-gray-600 hover:text-primary transition"
                                >
                                    About
                                </Link>
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-primary transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-primary text-gray-600 px-3 py-1 rounded hover:bg-primary-dark transition"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Search Bar (only visible when activated) */}
                {mobileMenuOpen && (
                    <div className="mt-3 md:hidden">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                ref={searchRef}
                            />
                            <button
                                onClick={handleSearch}
                                className="absolute right-3 top-2.5 text-gray-500 hover:text-primary transition"
                            >
                                <FiSearch size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="mobile-menu-container md:hidden bg-white border-t">
                    <nav className="container mx-auto px-4 py-3 flex flex-col space-y-3">
                        <NavLink
                            to="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `py-2 ${isActive ? 'text-primary font-medium' : 'text-gray-600'}`
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/products"
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `py-2 ${isActive ? 'text-primary font-medium' : 'text-gray-600'}`
                            }
                        >
                            Products
                        </NavLink>
                        {currentUser && (
                            <>
                                <NavLink
                                    to="/orders"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `py-2 ${isActive ? 'text-primary font-medium' : 'text-gray-600'}`
                                    }
                                >
                                    Orders
                                </NavLink>
                                {/* <NavLink
                                    to="/profile"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `py-2 ${isActive ? 'text-primary font-medium' : 'text-gray-600'}`
                                    }
                                >
                                    Profile
                                </NavLink> */}
                                {currentUser.isAdmin && (
                                    <NavLink
                                        to="/admin"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={({ isActive }) =>
                                            `py-2 ${isActive ? 'text-primary font-medium' : 'text-gray-600'}`
                                        }
                                    >
                                        Dashboard
                                    </NavLink>
                                )}

                            </>
                        )}
                        {currentUser ? (
                            <>
                                <div className="pt-2 border-t">
                                    <button
                                        onClick={handleLogout}
                                        disabled={logoutLoading}
                                        className={`w-full text-left py-2 flex items-center space-x-2 ${logoutLoading ? 'opacity-50 cursor-wait' : 'text-gray-600 hover:text-primary'
                                            }`}
                                    >
                                        <FiLogOut className="h-5 w-5" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="pt-2 border-t flex flex-col space-y-2">
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="py-2 text-gray-600 hover:text-primary transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="bg-primary text-white px-3 py-2 rounded hover:bg-primary-dark transition text-center"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}