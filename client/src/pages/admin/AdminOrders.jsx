import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderToDelivered } from '../../services/orderService';
import Loader from '../../components/common/Loader';
import { Link } from 'react-router-dom';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getAllOrders();
                // Ensure we always have an array, even if response.data is undefined
                setOrders(Array.isArray(response?.data) ? response.data : []);
            } catch (err) {
                setError(err.message || 'Failed to load orders');
                setOrders([]); // Set empty array on error
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleMarkAsDelivered = async (orderId) => {
        if (window.confirm('Are you sure you want to mark this order as delivered?')) {
            try {
                await updateOrderToDelivered(orderId);
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.id === orderId ? { ...order, isDelivered: true } : order
                    )
                );
                setSuccess('Order marked as delivered successfully');
                setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
                setError(err.message || 'Failed to update order');
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Manage Orders</h2>

            {/* Success Message */}
            {success && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                    <p className="text-green-700">{success}</p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader />
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {orders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {order.id?.substring(0, 8) || 'N/A'}...
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {order.userId?.substring(0, 8) || 'N/A'}...
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                ₦{order.totalPrice?.toLocaleString() || '0'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.isDelivered
                                                        ? 'bg-green-100 text-green-800'
                                                        : order.isPaid
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                        }`}
                                                >
                                                    {order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Processing'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {!order.isDelivered && (
                                                    <button
                                                        onClick={() => handleMarkAsDelivered(order.id)}
                                                        className="text-primary hover:text-primary-dark mr-3"
                                                    >
                                                        Mark Delivered
                                                    </button>
                                                )}
                                                <Link
                                                    to={`/admin/orders/${order.id}`}
                                                    className="text-primary hover:text-primary-dark">
                                                    Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 mb-4">No orders found</p>
                            <p className="text-sm text-gray-400">
                                When customers place orders, they will appear here
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}