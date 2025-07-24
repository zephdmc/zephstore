import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import ShippingForm from '../../components/checkout/ShippingForm';
import PaymentForm from '../../components/checkout/PaymentForm';
import OrderConfirmation from '../../components/checkout/OrderConfirmation';
import { createOrder } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';

export default function CheckoutPage() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { currentUser } = useAuth();
    const [shippingData, setShippingData] = useState(null);
    const [order, setOrder] = useState(null);
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!currentUser) {
            navigate('/login', { state: { from: '/checkout' } });
        }
    }, [currentUser, navigate]);

    // Return null or loading spinner while checking auth status
    if (!currentUser) {
        return null; // or return a loading spinner
    }

    const handleShippingSubmit = (data) => {
        setShippingData(data);
        setStep(2);
    };

    const handlePaymentSuccess = async (paymentData) => {
        try {
            const {
                payment,
                verification,
                userId,
                cartItems
            } = paymentData;

            if (!userId) throw new Error('User ID not found in payment data');
            if (!shippingData) throw new Error('Shipping data not found');
            if (!cartItems?.length) throw new Error('Cart items not found');

            // Transform items to match backend expectations
            const backendItems = cartItems.map(item => ({
                productId: item.id,  // Changed from 'id' to 'productId'
                name: item.name,
                promocode: item.promocode,
                price: Number(item.price),
                quantity: Number(item.quantity),
                image: item.image
            }));

            const orderData = {
                userId,
                items: backendItems,  // Use transformed items
                shippingAddress: shippingData,
                paymentMethod: 'flutterwave',
                paymentResult: {
                    id: payment.transaction_id || payment.id,
                    status: payment.status,
                    amount: Number(payment.amount),
                    currency: payment.currency || 'NGN',
                    transactionRef: payment.tx_ref,
                    verifiedAt: verification.verifiedAt || new Date().toISOString()
                },
                itemsPrice: Number(cartTotal),
                shippingPrice: 0,
                taxPrice: 0,
                totalPrice: Number(cartTotal)
            };

            const createdOrder = await createOrder(orderData);
            setOrder(createdOrder);
            clearCart();
            setStep(3);
            setTimeout(() => navigate(`/orders/${createdOrder.data.id}`), 5000);

        } catch (error) {
            console.error('Order creation failed:', error);
            console.error('Detailed order creation error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
                config: error.config
            });
            alert(`Order processing failed: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>

            {/* Progress Steps */}
            <div className="flex mb-8">
                {[1, 2, 3].map((stepNumber) => (
                    <div key={stepNumber} className={`flex-1 text-center border-b-2 ${step >= stepNumber ? 'border-primary' : 'border-gray-300'
                        }`}>
                        <span className={`inline-block py-2 px-4 rounded-full ${step >= stepNumber ? 'bg-primary text-white' : 'bg-gray-200'
                            }`}>
                            {stepNumber}
                        </span>
                        <p className="mt-2 text-sm">
                            {['Shipping', 'Payment', 'Confirmation'][stepNumber - 1]}
                        </p>
                    </div>
                ))}
            </div>

            {step === 1 && <ShippingForm onSubmit={handleShippingSubmit} />}
            {step === 2 && (
                <PaymentForm
                    amount={cartTotal}
                    onSuccess={handlePaymentSuccess}
                    onClose={() => setStep(1)}
                    cartItems={cartItems}
                />
            )}
            {step === 3 && order && <OrderConfirmation order={order} />}
        </div>
    );
}
