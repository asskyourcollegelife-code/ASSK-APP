import { signup } from '../actions'

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
    const params = await searchParams;
    return (
        <div className="flex min-h-screen items-center justify-center bg-primary-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-primary-600 p-8 text-white text-center">
                    <h1 className="text-3xl font-bold mb-2">Join ASSK</h1>
                    <p className="text-primary-100">Get started with your student portal.</p>
                </div>

                <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Create an account</h2>

                    {params?.error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
                            {params.error}
                        </div>
                    )}

                    <form className="space-y-5" action={signup}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="full_name">Full Name</label>
                            <input
                                id="full_name"
                                name="full_name"
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                                placeholder="Alex Johnson"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                                placeholder="alex@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                                placeholder="••••••••"
                            />
                            <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters.</p>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm mt-2"
                        >
                            Crate Account
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-600">
                        Already have an account? <a href="/login" className="text-primary-600 font-medium hover:text-primary-700">Sign in</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
