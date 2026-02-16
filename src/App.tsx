import { LoadingProvider } from './contexts/LoadingContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { AuthProvider } from './contexts/AuthContext'
import AppRoutes from './routes'

function App() {
    return (
        <LoadingProvider>
            <NotificationProvider>
                <AuthProvider>
                    <AppRoutes />
                </AuthProvider>
            </NotificationProvider>
        </LoadingProvider>
    )
}

export default App
