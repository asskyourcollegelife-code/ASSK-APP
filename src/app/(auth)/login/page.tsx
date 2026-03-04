import { login } from '../actions'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; message?: string }> }) {
    const params = await searchParams;
    return (
        <div className="flex min-h-screen items-center justify-center bg-primary-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-primary-600 p-8 text-white text-center">
                    <img
                        src="/sidebarlogo.png"
                        alt="ASSK Logo"
                        className="h-20 w-auto mx-auto mb-4"
                    />
                    <h1 className="text-3xl font-bold mb-2">ASSK</h1>
                    <p className="text-primary-100">Your College Life, Organized.</p>
                </div>

                <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome back</h2>

                    {params?.error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
                            {params.error}
                        </div>
                    )}

                    {params?.message && (
                        <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-6 border border-green-100">
                            {params.message}
                        </div>
                    )}

                    <form className="space-y-5" action={login}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                                placeholder="student@college.edu"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
                                <a href="#" className="text-sm text-primary-600 hover:text-primary-700">Forgot password?</a>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-600">
                        Don't have an account? <a href="/signup" className="text-primary-600 font-medium hover:text-primary-700">Sign up</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
