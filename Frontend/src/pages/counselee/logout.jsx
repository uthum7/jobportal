"use client"

import { useEffect } from "react"
import { Navigate } from "react-router-dom"

export default function Logout() {
  useEffect(() => {
    // In a real app, you would call an API to log the user out
    // and clear any authentication tokens or cookies
    console.log("Logging out user...")

    // For example:
    // localStorage.removeItem('authToken')
    // sessionStorage.clear()

    // You might also want to dispatch a logout action if using Redux
    // dispatch(logoutUser())
  }, [])

  // Redirect to the login page or home page after logout
  return <Navigate to="/" replace />
}

