import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getProductById } from '../../services/productServic';
import { useEffect } from 'react';

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getProductById(id);
                setProduct(response.data);
            } catch (err) {
                setError(err.message || 'Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        navigate('/cart');
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-4 rounded-lg shadow">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-96 object-contain"
                    />
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                    <div className="mb-4">
                        <span className="text-primary text-xl font-bold">
                            ₦{product.price.toLocaleString()}
                        </span>
                        {product.countInStock > 0 ? (
                            <span className="ml-2 text-green-600">In Stock</span>
                        ) : (
                            <span className="ml-2 text-red-600">Out of Stock</span>
                        )}
                    </div>
                    <p className="text-gray-700 mb-6">{product.description}</p>

                    {product.countInStock > 0 && (
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2">Quantity</label>
                            <select
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                className="border rounded p-2"
                            >
                                {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                                    <option key={x + 1} value={x + 1}>
                                        {x + 1}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <button
                        onClick={handleAddToCart}
                        disabled={product.countInStock === 0}
                        className={`w-full py-3 px-4 rounded ${product.countInStock === 0
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-primary text-gray hover:bg-primary-dark'
                            } transition`}
                    >
                        {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
}