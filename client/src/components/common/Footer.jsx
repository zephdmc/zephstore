export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">Zeph Store</h3>
                        <p className="text-gray-400">
                            Your one-stop shop for all your needs. Quality products at affordable prices.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><a href="/" className="text-gray-400 hover:text-white transition">Home</a></li>
                            <li><a href="/products" className="text-gray-400 hover:text-white transition">Products</a></li>
                            <li><a href="/cart" className="text-gray-400 hover:text-white transition">Cart</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                        <address className="text-gray-400 not-italic">
                            123 Store Street<br />
                            E-commerce City<br />
                            Nigeria<br />
                            Email: info@zephstore.com<br />
                            Phone: +234 800 000 0000
                        </address>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Zeph Store. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}