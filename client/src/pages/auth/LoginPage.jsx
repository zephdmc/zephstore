import Login from '../../components/auth/Login';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-purpleLight flex flex-col justify-center py-2 md:py-12  sm:px-6 lg:px-8">

            <div className="mt-2 md:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-2 md:py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <Login />
                </div>
            </div>
        </div>
    );
}
