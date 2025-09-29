import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Signin from "../pages/signin.jsx";
import Reg from "../pages/registration.jsx";
import Details from "../pages/details.jsx";
import Dashboard from "../pages/dashboard.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import AuthRedirectRoute from "../components/AuthRedirect.jsx";
import ApplicationsPage from "../pages/application.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public routes - No authentication required */}
        <Route path="/" element={<App />} />
        
        {/* Auth routes - Redirect logged-in users to appropriate dashboard */}
        <Route 
          path="/signin" 
          element={
            <AuthRedirectRoute>
              <Signin />
            </AuthRedirectRoute>
          } 
        />
        <Route 
          path="/registration" 
          element={
            <AuthRedirectRoute>
              <Reg />
            </AuthRedirectRoute>
          } 
        />
        
        {/* Protected route - Details page (only for users with incomplete profiles) */}
        <Route 
          path="/details" 
          element={
            <ProtectedRoute requiresIncompleteProfile={true}>
              <Details />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected route - Dashboard (only for users with complete profiles) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute requiresCompleteProfile={true}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
             <Route 
          path="/application" 
          element={
            <ProtectedRoute requiresCompleteProfile={true}>
              <ApplicationsPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);