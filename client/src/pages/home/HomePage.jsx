
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../../components/products/ProductCard';
import { getProducts } from '../../services/productServic';
import TestimonialSlider from '../../pages/home/HomePageComponent/TestimonialSlider';
import { FiHeart, FiAward, FiLoader, FiAlertTriangle, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import { getBlogPosts } from '../../services/contentful'; // adjust path if needed
import BlogTeaser from '../../components/blog/BlogTeaser';
// Add this import with your other imports
import SkincareQuizForm from './HomePageComponent/SkincareQuizForm'; // Adjust the path as needed


const SplashScreen = ({ onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 6000); // 6 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
   <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 bg-purpleLight/30 backdrop-invert backdrop-opacity-20 flex items-center justify-center p-2 sm:p-4"
    >
      <div className="w-full max-w-sm sm:max-w-6xl">
        <div className="flex flex-col items-center gap-4 sm:gap-8 sm:flex-row sm:gap-12">
          {/* First Offer */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-full bg-purplegradient p-4 sm:p-8 rounded-xl shadow-lg border border-purple-200"
          >
            <h3 className="text-base sm:text-xl font-medium text-white mb-1 sm:mb-2">FIRST ORDER</h3>
            <h2 className="text-2xl sm:text-6xl font-bold text-purpleLight mb-1 sm:mb-2">10% OFF</h2>
            <h4 className="text-lg sm:text-3xl font-semibold text-white mb-2 sm:mb-4">HELLOGLOW10</h4>
            <p className="text-sm sm:text-lg text-white mb-4 sm:mb-6">
              Enjoy 10% off your purchase with code HELLOGLOW10
            </p>
          </motion.div>

          {/* Second Offer - Now visible on mobile */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-full bg-purplegradient p-4 sm:p-8 rounded-xl shadow-lg border border-purple-300"
          >
            <h3 className="text-base sm:text-xl font-medium text-white mb-1 sm:mb-2">RETURNING</h3>
            <h2 className="text-2xl sm:text-6xl font-bold text-purpleLight mb-1 sm:mb-2">15% OFF</h2>
            <h4 className="text-lg sm:text-3xl font-semibold text-white mb-2 sm:mb-4">GLOWBACK15</h4>
            <p className="text-sm sm:text-lg text-white mb-4 sm:mb-6">
              Welcome back! Get 15% off your next order with code GLOWBACK15
            </p>
          </motion.div>
        </div>

        {/* Shop Now Button */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-6 sm:mt-10"
        >
          <Link
            to="/products"
            onClick={onClose}
            className="inline-block bg-purplegradient hover:purplegradientv text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full text-base sm:text-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            SHOP NOW
          </Link>
        </motion.div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 sm:top-4 right-2 sm:right-4 text-purple-500 hover:text-purple-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};





export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
      const [showSplash, setShowSplash] = useState(true);
    const [error, setError] = useState('');
  // Add this state to your HomePage component
const [showQuizForm, setShowQuizForm] = useState(false);

  const { currentUser } = useAuth(); // Get current user from auth context
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts();
                setProducts(response.data?.slice(0, 8) || []);
            } catch (err) {
                setError(err.message || 'Failed to load featured products');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

useEffect(() => {
  const fetchBlogs = async () => {
    try {
      const posts = await getBlogPosts();
      setBlogs(posts.slice(0, 3)); // Limit to 3 teasers
    } catch (err) {
      console.error("Failed to fetch blog posts:", err);
    }
  };
  fetchBlogs();
}, []);
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };
  // Check if user is admin
    const isAdmin = currentUser?.isAdmin;

    return (
        <div className="min-h-screen bg-gradient-to-b from-purpleDark to-purpleLight">
                  {showSplash && <SplashScreen onClose={() => setShowSplash(false)} />}
           {isAdmin && (
                <div className="fixed top-4 right-4 z-50">
                    <Link
                        to="https://www.bellebeauaesthetics.ng/admin"
                        className="bg-purplegradient hover:bg-purplegradientv text-white py-2 px-4 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                    >
                        1
                        <FiArrowRight className="ml-1" />
                    </Link>
                </div>
            )}

{/* Hero Section */}
<section className="relative overflow-hidden border-b-2 border-purplegradientr">
    {/* Background Image with Opacity */}
    <div className="absolute inset-0 z-0">
        <img 
            src="/images/hero1.jpeg" // Replace with your image path
            alt="Beauty Products Background"
            className="w-full h-full object-cover opacity-20" // Adjust opacity as needed (0.2 = 20%)
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purpleDark to-purpleLight mix-blend-multiply"></div>
    </div>
    
    {/* Content Container (unchanged) */}
    <div className="container mx-auto px-4 pt-4 pb-20 md:pt-28 md:pb-28 flex flex-col items-center text-center relative z-10">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
        >
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
                Glow Naturally with <span className="text-purpleDark1">Bellebeau</span> Aesthetics
            </h1>
            <p className="text-lg md:text-xl text-white mb-8 max-w-2xl mx-auto">
                Discover skincare made for you — Shop clean beauty, get expert recommendations, and follow the latest trends.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                    to="/products"
                    className="bg-purplegradient hover:bg-purplegradientv text-white py-3 px-8 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                    Shop Now
                </Link>
             <Link
  to="#"
  onClick={(e) => {
    e.preventDefault();
    setShowQuizForm(true);
  }}
  className="border-2 border-purplegradient text-purplegradient hover:bg-purplelight py-3 px-8 rounded-full font-medium transition-all duration-300 transform hover:scale-105"
>
  Start Your Skincare Journey
</Link>
            </div>
        </motion.div>
    </div>

    {/* Decorative elements (unchanged) */}
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
        <div className="absolute top-20 left-10 w-16 h-16 rounded-full bg-purpleLight opacity-30 animate-float"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 rounded-full bg-purpleLight opacity-30 animate-float animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 rounded-full bg-purpleLight opacity-30 animate-float animation-delay-4000"></div>
    </div>
</section>

            {/* Featured Products Section */}
            {/* Featured Products Section */}
         <section className="container mx-auto px-4 py-16">
    <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={containerVariants}
    >
        <motion.h2 
            variants={itemVariants} 
            className="text-4xl md:text-5xl font-bold text-center mb-4 font-sans"
        >
            Customer Favorites
            <FiHeart className="inline-block ml-3 text-red-500 animate-pulse" />
        </motion.h2>
        <motion.p 
            variants={itemVariants} 
            className="text-white text-center max-w-2xl mx-auto mb-12 text-lg"
        >
            Curated selections loved by our community <FiAward className="inline ml-1 text-yellow-500" />
        </motion.p>

        {loading ? (
            <motion.div variants={itemVariants} className="text-center py-12">
                <FiLoader className="inline-block animate-spin text-3xl text-purple-600 mb-3" />
                <p className="text-white">Loading featured products...</p>
            </motion.div>
        ) : error ? (
            <motion.div variants={itemVariants} className="text-white bg-gradient-to-r from-red-400 to-red-600 p-4 rounded-lg text-center shadow-lg">
                <FiAlertTriangle className="inline-block mr-2" />
                {error} (Showing placeholder products)
            </motion.div>
        ) : null}

        <div className="relative">
            <div className="overflow-x-auto pb-6 scrollbar-hide">
                <div className="inline-flex space-x-6 px-2">
                   {(products.length > 0 ? products : Array.from({ length: 7 })).map((product, index) => (
    <motion.div 
        key={product?.id || index}
        variants={itemVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className={`
            w-[180px]  // Fixed base width for mobile
            sm:w-[220px] 
            md:w-[240px] 
            lg:w-[280px]
            flex-shrink-0
            relative
            group
        `}
        whileHover={{ 
            y: -8,
            transition: { duration: 0.3 }
        }}
    >
        <Link 
            to={product ? `/products/${product.id}` : '#'}
            className="block"
        >
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-purplelight hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <div className="relative pt-[100%] bg-gray-50 overflow-hidden">
                    {product ? (
                        <>
                            {/* Discount Badge */}
                            {product.discountPercentage > 0 && (
                                <div className="absolute top-2 left-2 bg-white text-purpleDark1 text-xs font-bold px-2 py-1 rounded-full z-10 transform -rotate-12 shadow-md">
                                    {product.discountPercentage}% OFF
                                </div>
                            )}
                            <img 
                                src={product.image} 
                                alt={product.name}
                                className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                        </>
                    ) : (
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
                    )}
                </div>
                <div className="p-4 flex-grow flex flex-col bg-purpleLight">
                    {product ? (
                        <>
                            <h3 className="font-semibold text-purpleDark1 text-sm md:text-lg mb-1 line-clamp-2">
                                {product.name}
                            </h3>
                            <div className="mt-auto">
                                {/* Price Display */}
                                {product.discountPercentage > 0 ? (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[14px] md:text-lg text-white line-through">
                                                ₦{(product.price + (product.price * (product.discountPercentage / 100))).toLocaleString()}
                                            </span>
                                            <span className="text-[14px] md:text-lg text-purpleDark1 font-bold">
                                                ₦{product.price.toLocaleString()}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <span className="text-[14px] md:text-xl text-white">
                                        ₦{product.price.toLocaleString()}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <FiShoppingBag className="text-white group-hover:text-purpleDark transition-colors" />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="h-5 bg-purpleLighter1 rounded w-3/4 mb-3 animate-pulse"></div>
                            <div className="h-5 bg-purpleLighter rounded w-1/2 mt-auto animate-pulse"></div>
                        </>
                    )}
                </div>
            </div>
        </Link>
    </motion.div>
))}
                  
                </div>
            </div>
        </div>

        <motion.div 
            variants={itemVariants} 
            className="text-center mt-16"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <Link
                to="/products"
                className="inline-flex items-center justify-center bg-gradient-to-r from-purpleDark to-purpleLight hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
            >
                View All Products
                <FiArrowRight className="ml-2" />
            </Link>
        </motion.div>
    </motion.div>
</section>

            {/* Trending Blog Section */}
         <section className="bg-purpleLight py-16">
  <div className="container mx-auto px-4">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      <h2 className="text-3xl font-serif font-bold mb-4">From Our Blog</h2>
      <p className="text-purpleDark max-w-2xl mx-auto">
        Skincare insights, tips & beauty trends from the experts
      </p>
    </motion.div>

    {blogs && blogs.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {blogs.map((post) => (
          <BlogTeaser key={post.sys.id} post={post} />
        ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <p className="text-purpleDark">No blog posts available at the moment.</p>
      </div>
    )}
  </div>
</section>



         

            {/* Testimonials Section */}
            <section className="bg-pink-50 py-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-serif font-bold mb-4">What Our Customers Say</h2>
                        <p className="text-purpleDark max-w-2xl mx-auto">Real results from real people</p>
                    </motion.div>

                    <TestimonialSlider />
                </div>
            </section>

           
            {/* Floating WhatsApp Button */}
<motion.div
    drag
    dragConstraints={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="fixed bottom-10 right-6 z-50 cursor-grab active:cursor-grabbing"
>
    <a 
        href="https://wa.me/+2349014727839" // Replace PHONE_NUMBER with your actual WhatsApp number in international format (e.g., 2348000000000)
        target="_blank"
        rel="noopener noreferrer"
        className="bg-purpleDark hover:bg-green-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-colors duration-300"
    >
        <FaWhatsapp size={32} />
    </a>
</motion.div>

          {showQuizForm && <SkincareQuizForm onClose={() => setShowQuizForm(false)} />}

        </div>
    );
}
