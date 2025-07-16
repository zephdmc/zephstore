
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../../components/products/ProductCard';
import { getProducts } from '../../services/productServic';
import TestimonialSlider from '../../pages/home/HomePageComponent/TestimonialSlider';
import BlogTeaser from '../home/HomePageComponent/BlogTeaser';

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
                        <p className="text-lg md:text-xl text-purpleDark mb-8 max-w-2xl mx-auto">
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
                    <motion.h2 variants={itemVariants} className="text-3xl font-serif font-bold text-center mb-4">
                        Customer Favorites
                    </motion.h2>
                    <motion.p variants={itemVariants} className="text-purpleDark text-center max-w-2xl mx-auto mb-12">
                        Products loved by our community
                    </motion.p>

                    {loading ? (
                        <motion.div variants={itemVariants} className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purplegradientv mb-4"></div>
                            <p>Loading featured products...</p>
                        </motion.div>
                    ) : error ? (
                        <motion.div variants={itemVariants} className="text-purplegradientv bg-red-50 p-4 rounded-lg text-center">
                            {error} (Showing placeholder products)
                        </motion.div>
                    ) : null}

                    {products.length > 0 ? (

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: false, amount: 0.2 }} // 👈 triggers animation more reliably
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                        >
                            {products.map((product) => (
                                <motion.div key={product.id} variants={itemVariants} whileHover={{ y: -5 }}>
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </motion.div>

                    ) : (
                        Array.from({ length: 4 }).map((_, index) => (
                            <motion.div key={index} variants={itemVariants}>
                                <div className="border rounded-lg p-4 bg-purpleLight shadow-sm hover:shadow-md transition-shadow">
                                    <div className="bg-purpleLight h-64 mb-4 rounded animate-pulse"></div>
                                    <div className="h-4 bg-purpleLight rounded w-3/4 mb-3 animate-pulse"></div>
                                    <div className="h-4 bg-purpleLight rounded w-1/2 animate-pulse"></div>
                                </div>
                            </motion.div>
                        ))
                    )}

                    <motion.div variants={itemVariants} className="text-center mt-12">
                        <Link
                            to="/products"
                            className="inline-block border-2 border-purpleDark text-purpleDark hover:bg-purpleDark hover:text-purplelight py-3 px-8 rounded-full font-medium transition-all duration-300"
                        >
                            View All Products
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
