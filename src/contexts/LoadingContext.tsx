import React, { createContext, useContext, useState, ReactNode } from 'react'

interface LoadingContextType {
    isLoading: boolean
    loadingMessage: string
    showLoading: (message?: string) => void
    hideLoading: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export const useLoading = () => {
    const context = useContext(LoadingContext)
    if (!context) {
        throw new Error('useLoading must be used within LoadingProvider')
    }
    return context
}

interface LoadingProviderProps {
    children: ReactNode
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState('')

    const showLoading = (message = 'Yükleniyor...') => {
        setLoadingMessage(message)
        setIsLoading(true)
    }

    const hideLoading = () => {
        setIsLoading(false)
        setLoadingMessage('')
    }

    return (
        <LoadingContext.Provider value={{ isLoading, loadingMessage, showLoading, hideLoading }}>
            {children}
            {isLoading && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: 'white',
                            padding: '2rem',
                            borderRadius: '8px',
                            textAlign: 'center',
                        }}
                    >
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                border: '4px solid #f3f3f3',
                                borderTop: '4px solid #3498db',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                margin: '0 auto 1rem',
                            }}
                        />
                        <p style={{ margin: 0, color: '#333' }}>{loadingMessage}</p>
                    </div>
                </div>
            )}
            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </LoadingContext.Provider>
    )
}
