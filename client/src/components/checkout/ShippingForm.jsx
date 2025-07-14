import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function ShippingForm({ onSubmit }) {
    const { currentUser } = useAuth();
    const [formData, setFormData] = useState({
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Nigeria',
        phone: '',
        email: currentUser?.email || ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.email) {
            alert('Please enter a valid email address');
            return;
        }
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">Shipping Information</h3>

            <div className="mb-4">
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                    disabled={!!currentUser?.email}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-gray-700 mb-1">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">City</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-gray-700 mb-1">State</label>
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">Postal Code</label>
                    <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-gray-700 mb-1">Country</label>
                    <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="Nigeria">Nigeria</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-primary text-gray-700 py-3 px-4 rounded hover:bg-primary-dark transition font-medium"
            >
                Continue to Payment
            </button>
            <Link
                to="/products"
                className="border border-primary text-gray-700 py-2 px-6 rounded hover:bg-gray-50 transition font-medium"
            >
                Continue Shopping
            </Link>
        </form>

    );
}