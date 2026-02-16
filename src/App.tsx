import { LoadingProvider } from './contexts/LoadingContext'
import { NotificationProvider } from './contexts/NotificationContext'
import AppRoutes from './routes'

function App() {
    return (
        <LoadingProvider>
            <NotificationProvider>
                <AppRoutes />
            </NotificationProvider>
        </LoadingProvider>
    )
}

export default App
