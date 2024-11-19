import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ element }) {
  const { accessToken, loading } = useAuth();

  // If loading is true, show a loading spinner or nothing until the token is fetched
  if (loading) {
    return <div>Loading...</div>; // Replace with a loading spinner or blank
  }

  // If the user is not authenticated, redirect to the login page
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated, render the protected element
  return element;
}
