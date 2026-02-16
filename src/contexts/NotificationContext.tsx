import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'

type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface Notification {
    id: string
    type: NotificationType
    message: string
}

interface NotificationContextType {
    success: (message: string) => void
    error: (message: string) => void
    warning: (message: string) => void
    info: (message: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotification = () => {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider')
    }
    return context
}

interface NotificationProviderProps {
    children: ReactNode
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([])

    const addNotification = useCallback((type: NotificationType, message: string) => {
        const id = Math.random().toString(36).substring(7)
        setNotifications((prev) => [...prev, { id, type, message }])

        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id))
        }, 3000)
    }, [])

    const success = useCallback((message: string) => addNotification('success', message), [addNotification])
    const error = useCallback((message: string) => addNotification('error', message), [addNotification])
    const warning = useCallback((message: string) => addNotification('warning', message), [addNotification])
    const info = useCallback((message: string) => addNotification('info', message), [addNotification])

    const getBackgroundColor = (type: NotificationType) => {
        switch (type) {
            case 'success': return '#10b981'
            case 'error': return '#ef4444'
            case 'warning': return '#f59e0b'
            case 'info': return '#3b82f6'
        }
    }

    return (
        <NotificationContext.Provider value={{ success, error, warning, info }}>
            {children}
            <div
                style={{
                    position: 'fixed',
                    top: '1rem',
                    right: '1rem',
                    zIndex: 10000,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                }}
            >
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        style={{
                            backgroundColor: getBackgroundColor(notification.type),
                            color: 'white',
                            padding: '1rem 1.5rem',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            minWidth: '300px',
                            animation: 'slideIn 0.3s ease-out',
                        }}
                    >
                        {notification.message}
                    </div>
                ))}
            </div>
            <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
        </NotificationContext.Provider>
    )
}
