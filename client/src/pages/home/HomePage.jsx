
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../../components/products/ProductCard';
import { getProducts } from '../../services/productServic';
import TestimonialSlider from '../../pages/home/HomePageComponent/TestimonialSlider';
import BlogTeaser from '../home/HomePageComponent/BlogTeaser';
import { FiHeart, FiAward, FiLoader, FiAlertTriangle, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    return (
        <div className="min-h-screen bg-gradient-to-b from-purpleDark to-purpleLight">
            {/* Hero Section */}
            <section className="relative overflow-hidden border-b-2 border-purplegradientr bg-[url(/img/mountains.jpg)] bg-blend-overlay ">
                <div className="container mx-auto px-4 pt-4 pb-20  md:pt-28  md:pb-28 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-purplegradient mb-6">
                            Glow Naturally with <span className="text-purpleDark1">Bellebeau</span> Aesthetics
                        </h1>
                        <p className="text-lg md:text-xl text-white backdrop-invert-65 mb-8 max-w-2xl mx-auto">
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
                                to="/skincare-quiz"
                                className="border-2 border-purplegradient text-purplegradient hover:bg-purplelight py-3 px-8 rounded-full font-medium transition-all duration-300 transform hover:scale-105"
                            >
                                Start Your Skincare Journey
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
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
            className="text-gray-600 text-center max-w-2xl mx-auto mb-12 text-lg"
        >
            Curated selections loved by our community <FiAward className="inline ml-1 text-yellow-500" />
        </motion.p>

        {loading ? (
            <motion.div variants={itemVariants} className="text-center py-12">
                <FiLoader className="inline-block animate-spin text-3xl text-purple-600 mb-3" />
                <p className="text-">Loading featured products...</p>
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
                                w-[calc(50%-12px)] 
                                sm:w-[calc(33%-16px)] 
                                md:w-[calc(25%-18px)] 
                                lg:w-[calc(20%-20px)]
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
                                                <div className="mt-auto flex items-center justify-between">
                                                    <span className="text-4 md:text-xl text-gray-900">
                                                        ₦{product.price.toFixed(2)}
                                                    </span>
                                                    <FiShoppingBag className="text-purpleDark1 group-hover:text-purpleDark transition-colors" />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
                                                <div className="h-5 bg-gray-200 rounded w-1/2 mt-auto animate-pulse"></div>
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
                className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
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
                        <h2 className="text-3xl font-serif font-bold mb-4">Trending Beauty Tips</h2>
                        <p className="text-purpleDark max-w-2xl mx-auto">Expert advice for your skincare journey</p>
                    </motion.div>

                    <BlogTeaser
                        title="Top 5 Ingredients for Glowing Skin in 2025"
                        excerpt="Discover the powerhouse ingredients that will transform your skincare routine this year..."
                        link="/blog/top-5-ingredients-2025"
                        image="/images/blog-teaser.jpg"
                    />
                </div>
            </section>


            {/* Trending Blog Section */}
            <section className="bg-white py-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-serif font-bold mb-4">Trending Beauty Tips</h2>
                        <p className="text-purpleDark max-w-2xl mx-auto">Expert advice for your skincare journey</p>
                    </motion.div>

                    <BlogTeaser
                        title="Top 5 Ingredients for Glowing Skin in 2025"
                        excerpt="Discover the powerhouse ingredients that will transform your skincare routine this year..."
                        link="/blog/top-5-ingredients-2025"
                        image="/images/blog-teaser.jpg"
                    />
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

            {/* TikTok Feed Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-serif font-bold mb-4">Join Our Community</h2>
                        <p className="text-purpleDark max-w-2xl mx-auto">Follow us for daily skincare tips and transformations</p>
                    </motion.div>

                    <div className="max-w-4xl mx-auto">
                        {/* Placeholder for TikTok feed integration */}
                        <div className="bg-purpleLight rounded-xl p-8 text-center">
                            <p className="text-purpleDark mb-4">TikTok Feed Integration</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map((item) => (
                                    <div key={item} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="bg-purpleDark1 text-purpleLight py-16">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl font-serif font-bold mb-4">Stay Connected</h2>
                        <p className="text-purpleLight max-w-2xl mx-auto mb-8">
                            Subscribe to our newsletter for exclusive offers, skincare tips, and new product launches.
                        </p>
                        <div className="max-w-md mx-auto flex">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="flex-grow px-4 py-3 rounded-l-lg focus:outline-none text-purpleDark"
                            />
                            <button className="bg-purplegradient hover:bg-pink-700 px-6 py-3 rounded-r-lg font-medium transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
