import Register from '../../components/auth/Register';

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create a new account
                </h2> */}
            </div>
            <div className="mt-2 md:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-2 md:py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <Register />
                </div>
            </div>
        </div>
    );
}