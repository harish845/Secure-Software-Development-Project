import React from "react";
import { Route, Routes } from "react-router-dom";
import ProfileHome from "../components/User_components/ProfileHome";
import Login from "../components/User_components/Login";
import Register from "../components/User_components/Register";
import UserProfile from "../components/User_components/UserProfile";
import UpdateUser from "../components/User_components/UpdateUser";
import AdminDashBoard from "../components/User_components/AdminDashBoard";
import OAuthCallback from "../components/User_components/OAuthCallback";
import ProtectedRoute from "./ProtectedRoute";

export default function User_routes() {
  return (
    <Routes>
      <Route>
        <Route path="/" element={<ProfileHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute requiredRole="user">
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update"
          element={
            <ProtectedRoute requiredRole="user">
              <UpdateUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashBoard />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
