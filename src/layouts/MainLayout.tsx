import { Outlet, Link } from 'react-router-dom'
import { APP_NAME, APP_DESCRIPTION } from '@/constants'

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-slate-800 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{APP_NAME}</h1>
                        <p className="text-sm opacity-80">{APP_DESCRIPTION}</p>
                    </div>
                    <nav className="flex gap-6">
                        <Link to="/" className="text-white hover:text-gray-200 transition-colors">
                            Ana Sayfa
                        </Link>
                        <Link to="/admin" className="text-white hover:text-gray-200 transition-colors">
                            Admin Panel
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-gray-100 border-t">
                <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600">
                    <p>© 2026 {APP_NAME}. Tüm hakları saklıdır.</p>
                </div>
            </footer>
        </div>
    )
}

export default MainLayout
