import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    return (
        <div className="bg-purpleLight rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <Link to={`/products/${product.id}`}>
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                />
            </Link>
            <div className="p-4">
                <Link to={`/products/${product.id}`}>
                    <h3 className="font-semibold text-lg mb-2 hover:text-purpleDark transition">
                        {product.name}
                    </h3>
                </Link>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-purpDark font-bold">₦{product.price.toLocaleString()}</span>
                    {product.countInStock > 0 ? (
                        <span className="text-purpleDark text-sm">In Stock</span>
                    ) : (
                        <span className="text-Danger text-sm">Out of Stock</span>
                    )}
                </div>
                <button
                    onClick={() => addToCart(product)}
                    disabled={product.countInStock === 0}
                    className={`w-full py-2 px-4 rounded ${product.countInStock === 0
                        ? 'bg-purpleDark1 cursor-not-allowed'
                        : 'bg-purpleDark text-purpleLight hover:bg-purpleLight'
                        } transition`}
                >
                    {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div >
        </div >
    );
}
