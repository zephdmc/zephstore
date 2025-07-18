import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById, updateProduct } from '../../services/productServic';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from '../../firebase/config';

const SKINCARE_CATEGORIES = [
  'Cleansers',
    'Serums',
    'Treatments',
	'Moisturizers',
	'Sunscreens',
	'Body Care',
	'Acne Control',
	'Hyperpigmentation',
	'Bundle Offers',
];

export default function EditProductPage() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        countInStock: '',
        image: '',
        ingredients: '',
        skinType: '',
        size: '',
        benefits: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getProductById(id);
                const product = response.data;
                setFormData({
                    name: product.name || '',
                    price: product.price || '',
                    description: product.description || '',
                    category: product.category || '',
                    countInStock: product.countInStock || '',
                    image: product.image || '',
                    ingredients: product.ingredients || '',
                    skinType: product.skinType || '',
                    size: product.size || '',
                    benefits: product.benefits || ''
                });
            } catch (err) {
                setError('Failed to load product details');
            } finally {
                setFetching(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isNaN(formData.price) || isNaN(formData.countInStock)) {
                throw new Error('Price and stock must be valid numbers');
            }

            const productToUpdate = {
                ...formData,
                price: parseFloat(formData.price),
                countInStock: parseInt(formData.countInStock)
            };

            const response = await updateProduct(id, productToUpdate);
            
            if (response.success) {
                setSuccess(response.message || 'Product updated successfully!');
                setTimeout(() => navigate('/admin/products'), 1500);
            } else {
                throw new Error(response.message || 'Update failed on server');
            }

        } catch (err) {
            const errorMessage = err.response?.message ||
                err.message ||
                'Failed to update product';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setLoading(true);
            const storage = getStorage();
            const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            setFormData(prev => ({ ...prev, image: downloadURL }));
        } catch (err) {
            setError('Failed to upload image');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-4xl">
            <div className="flex items-center mb-4 sm:mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="mr-2 sm:mr-4 p-1 sm:p-2 rounded-full hover:bg-gray-100"
                    aria-label="Go back"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Edit Skincare Product</h2>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 mb-4 sm:mb-6">
                    <p className="text-red-700 text-sm sm:text-base">{error}</p>
                </div>
            )}
            {success && (
                <div className="bg-green-50 border-l-4 border-green-500 p-3 sm:p-4 mb-4 sm:mb-6">
                    <p className="text-green-700 text-sm sm:text-base">{success}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    {/* Product Name */}
                    <div className="col-span-1">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                            Price (₦) *
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₦</span>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                className="w-full pl-8 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            />
                        </div>
                    </div>

                    {/* Stock Quantity */}
                    <div>
                        <label htmlFor="countInStock" className="block text-sm font-medium text-gray-700 mb-1">
                            Stock Quantity *
                        </label>
                        <input
                            type="number"
                            id="countInStock"
                            name="countInStock"
                            min="0"
                            value={formData.countInStock}
                            onChange={handleChange}
                            required
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                            Category *
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                        >
                            <option value="">Select a category</option>
                            {SKINCARE_CATEGORIES.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    {/* Skin Type */}
                    <div>
                        <label htmlFor="skinType" className="block text-sm font-medium text-gray-700 mb-1">
                            Suitable Skin Types
                        </label>
                        <input
                            type="text"
                            id="skinType"
                            name="skinType"
                            value={formData.skinType}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            placeholder="e.g. Dry, Oily, Combination"
                        />
                    </div>

                    {/* Product Size */}
                    <div>
                        <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                            Size/Volume
                        </label>
                        <input
                            type="text"
                            id="size"
                            name="size"
                            value={formData.size}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            placeholder="e.g. 30ml, 50g"
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Image *
                        </label>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            {formData.image ? (
                                <img
                                    src={formData.image}
                                    alt="Product preview"
                                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
                                />
                            ) : (
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-md flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                            <label className="cursor-pointer bg-white py-2 px-3 sm:px-4 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Change Image
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="sr-only"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="col-span-1">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                        />
                    </div>

                    {/* Key Ingredients */}
                    <div className="col-span-1">
                        <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-1">
                            Key Ingredients
                        </label>
                        <textarea
                            id="ingredients"
                            name="ingredients"
                            rows={2}
                            value={formData.ingredients}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            placeholder="List main ingredients (comma separated)"
                        />
                    </div>

                    {/* Benefits */}
                    <div className="col-span-1">
                        <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-1">
                            Key Benefits
                        </label>
                        <textarea
                            id="benefits"
                            name="benefits"
                            rows={2}
                            value={formData.benefits}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            placeholder="List product benefits (comma separated)"
                        />
                    </div>
                </div>

                <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/products')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                            </span>
                        ) : 'Update Product'}
                    </button>
                </div>
            </form>
        </div>
    );
}
