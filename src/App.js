import React from 'react'
import './style/App.css'
import Contacts from './pages/contacts'
import Login from './pages/login'
import Profile from './pages/profile'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Signup from './pages/signup'
import './style/contacts.css'
import { useAuth } from './hooks/useAuth'
import ProtectedRoute from './component/protected-route'

export default function App() {
    const { accessToken, loading, setAccessToken } = useAuth()
    // If still loading, don't render the routes
    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/login"
                    element={
                        accessToken ? (
                            <Navigate to="/" replace />
                        ) : (
                            <Login setAccessToken={setAccessToken} />
                        )
                    }
                />
                <Route
                    path="/signup"
                    element={
                        accessToken ? <Navigate to="/" replace /> : <Signup />
                    }
                />

                {/* Protected Routes */}
                <Route
                    path="/contacts"
                    element={
                        <ProtectedRoute
                            element={
                                <Contacts setAccessToken={setAccessToken} />
                            }
                        />
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute
                            element={
                                <Profile setAccesstoken={setAccessToken} />
                            }
                        />
                    }
                />

                {/* Redirect all other routes */}
                <Route
                    path="*"
                    element={
                        accessToken ? (
                            <Navigate to="/contacts" replace />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}
