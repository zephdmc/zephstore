import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';

// Import Google logo from local assets or use a data URL
const GoogleLogo = () => (
    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const navigate = useNavigate();
    const { setCurrentUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        try {
            setError('');
            setLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            setCurrentUser(userCredential.user);
            navigate('/');
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            setError('');
            setGoogleLoading(true);
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);
            setCurrentUser(userCredential.user);
            navigate('/');
        } catch (err) {
            setError(err.message);
            setGoogleLoading(false);
        }
    };

    useEffect(() => {
        if (setCurrentUser) {
            const from = location.state?.from || (setCurrentUser.isAdmin ? '/admin' : '/');
            navigate(from, { replace: true });
        }
    }, [setCurrentUser, navigate, location.state?.from]);

    return (
        <div className="max-w-md mx-auto mt-2 md:mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
            {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-purpleDark mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-purpleLighter focus:border-purpleLight transition"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-purpleDark mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-purpleLighter focus:border-purpleLighter transition"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-purpleDark mb-2" htmlFor="confirmPassword">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-purpleLighter focus:border-purpleLighter transition"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-purpleDark text-white py-2 px-4 rounded hover:bg-primary-dark transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? (
                        <> 
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Registering...
                        </>
                    ) : 'Register'}
                </button>
            </form>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-purpleDark">Or continue with</span>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3">
                    <button
                        type="button"
                        onClick={handleGoogleSignUp}
                        disabled={googleLoading}
                        className="w-full inline-flex justify-center py-2 px-4 border border-purpleLighter rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        {googleLoading ? (
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <GoogleLogo />
                        )}
                        Sign up with Google
                    </button>
                </div>
            </div>

            <div className="mt-6 text-center text-sm text-purpleDark space-y-2">
                <p>
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-purpleLight hover:text-purpleLighter">
                        Login
                    </Link>
                </p>
                <p>
                    <Link to="/forgotpassword" className="font-medium text-purpleDark hover:text-purpleLighter">
                        Forgot password?
                    </Link>
                </p>
            </div>
        </div>
    );
}
