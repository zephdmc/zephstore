import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartSummary() {
    const { cartTotal, cartCount, clearCart } = useCart();

    return (
        <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Order Summary</h3>
            <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                    <span>Items ({cartCount})</span>
                    <span>₦{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₦0</span>
                </div>
                <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₦0</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>₦{cartTotal.toLocaleString()}</span>
                </div>
            </div>
            <button
                onClick={clearCart}
                className="w-full mb-4 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition"
            >
                Clear Cart
            </button>
            <Link
                to="/checkout"
                className="block w-full bg-primary text-gray-600 py-2 px-4 rounded text-center hover:bg-primary-dark transition"
            >
                Proceed to Checkout
            </Link>
        </div>
    );
}