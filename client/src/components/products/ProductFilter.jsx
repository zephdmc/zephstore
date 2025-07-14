import { useState } from 'react';

export default function ProductFilter({ categories, onFilter }) {
    const [filters, setFilters] = useState({
        category: '',
        minPrice: '',
        maxPrice: '',
        search: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter(filters);
    };

    const handleReset = () => {
        setFilters({
            category: '',
            minPrice: '',
            maxPrice: '',
            search: '',
        });
        onFilter({});
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label className="block text-gray-700 mb-1">Search</label>
                    <input
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={handleChange}
                        placeholder="Product name"
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">Category</label>
                    <select
                        name="category"
                        value={filters.category}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">Min Price</label>
                    <input
                        type="number"
                        name="minPrice"
                        value={filters.minPrice}
                        onChange={handleChange}
                        placeholder="Min"
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">Max Price</label>
                    <input
                        type="number"
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handleChange}
                        placeholder="Max"
                        className="w-full p-2 border rounded"
                    />
                </div>
            </div>
            <div className="flex justify-end mt-4 space-x-2">
                <button
                    type="button"
                    onClick={handleReset}
                    className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition"
                >
                    Reset
                </button>
                <button
                    type="submit"
                    className="bg-primary text-gray-700 py-2 px-4 rounded hover:bg-primary-dark transition"
                >
                    Filter
                </button>
            </div>
        </form>
    );
}