import { useState, useEffect } from 'react'
import axios from 'axios'

export const useAuth = () => {
    const [accessToken, setAccessToken] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAccessToken = async () => {
            try {
                const response = await axios.post(
                    'http://localhost:8000/refresh',
                    {},
                    { withCredentials: true }
                )
                if (response.data.accessToken) {
                    setAccessToken(response.data.accessToken)
                }
            } catch (error) {
                console.error('Error refreshing token:', error)
                setAccessToken(null)
            } finally {
                setLoading(false) // Finished loading, update the state
            }
        }

        fetchAccessToken()
    }, [])

    return { accessToken, setAccessToken, loading }
}
