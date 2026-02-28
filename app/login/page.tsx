'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { authenticate, signInWithGitHub } from '@/app/lib/actions';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">JaayNdougou</h1>
                    <p className="text-gray-500 text-sm mt-2">Espace Administration</p>
                </div>

                <form action={dispatch} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                            id="email"
                            type="email"
                            name="email"
                            placeholder="admin@example.com"
                            required
                        />
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Mot de passe</label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                            id="password"
                            type="password"
                            name="password"
                            placeholder="••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="h-4">
                        {errorMessage && (
                            <div className="flex items-center gap-2 text-sm text-red-600 animate-pulse">
                                <AlertCircle className="w-4 h-4" />
                                <p>{errorMessage}</p>
                            </div>
                        )}
                    </div>

                    <LoginButton />
                </form>

                <div className="mt-4 flex items-center gap-3">
                    <div className="flex-1 border-t border-gray-200" />
                    <span className="text-xs text-gray-400">ou</span>
                    <div className="flex-1 border-t border-gray-200" />
                </div>

                <form action={signInWithGitHub} className="mt-4">
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg shadow-md transition-all"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                        Se connecter avec GitHub
                    </button>
                </form>
            </div>
        </div>
    );
}

function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <button
            className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold rounded-lg shadow-md transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={pending}
        >
            {pending ? 'Connexion en cours...' : 'Se connecter'}
        </button>
    );
}
