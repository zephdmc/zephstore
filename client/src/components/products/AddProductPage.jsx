import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../services/productServic';
import { auth } from '../../firebase/config';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../../firebase/config';

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

export default function AddProductPage() {
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
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const storage = getStorage(app);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (isNaN(formData.price) || isNaN(formData.countInStock)) {
                throw new Error('Price and stock must be valid numbers');
            }

            if (!auth.currentUser) {
                throw new Error('Please sign in first');
            }

            const productToSubmit = {
                ...formData,
                price: parseFloat(formData.price),
                countInStock: parseInt(formData.countInStock),
            };

            const response = await createProduct(productToSubmit);
            if (response.success) {
                setSuccess('Product created! Redirecting...');
                setTimeout(() => navigate('/admin/products'), 1500);
            } else {
                throw new Error(response.message || 'Creation failed');
            }
        } catch (err) {
            setError(err.message.includes('Network')
                ? 'Network error - please check your connection'
                : err.message
            );
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

        if (!file.type.match('image.*')) {
            setError('Please upload an image file (jpg, png, etc.)');
            return;
        }

        if (file.size > 1 * 1024 * 1024) {
            setError('Image must be smaller than 5MB');
            return;
        }

        try {
            setLoading(true);
		
    // Debug: Verify storage bucket
    console.log("Storage bucket:", storage._host);
            const filename = `products/${Date.now()}-${file.name}`;
            const storageRef = ref(storage, filename);
		
       
        // Force metadata with explicit content type
    await uploadBytes(storageRef, file, {
      contentType: file.type,
      customMetadata: {
        uploadedBy: currentUser?.uid || 'admin'
      }
    });
            const downloadURL = await getDownloadURL(storageRef);
            setFormData(prev => ({ ...prev, image: downloadURL }));
        } catch (err) {
            setError('Failed to upload image');
        } finally {
            setLoading(false);
        }
    };

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
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Add New Skincare Product</h2>
            </div>

            {/* Status Messages */}
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
                            placeholder="e.g. Hydrating Facial Serum"
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
                                placeholder="0.00"
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
                            placeholder="e.g. 50"
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
                                {formData.image ? 'Change Image' : 'Upload Image'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="sr-only"
                                    required={!formData.image}
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
                            placeholder="Detailed product description..."
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
                        className="px-4 py-2 border border-purplegradient rounded-md text-xs sm:text-sm font-medium text-purplegradient hover:bg-purplegradient/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-purplegradient hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </span>
                        ) : 'Save Product'}
                    </button>
                </div>
            </form>
        </div>
    );
}
