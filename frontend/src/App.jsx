import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SidebarLayout from "./components/SidebarLayout";
import EmployeeLayout from "./components/EmployeeLayout";
import EmployeeManagement from "./pages/EmployeeManagement";
import ProjectManagement from "./pages/ProjectManagement";
import TaskManagement from "./pages/TaskManagement";
import ReportsDashboard from "./pages/ReportsDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Profile from "./pages/Profile";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to={user.role === "ADMIN" ? "/dashboard" : "/employeeDashboard"}
        replace
      />
    );
  }
  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <SidebarLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ReportsDashboard />} />
        <Route path="employees" element={<EmployeeManagement />} />
        <Route path="projects" element={<ProjectManagement />} />
        <Route path="tasks" element={<TaskManagement />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Employee Top Nav Layout */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/employeeDashboard" element={<EmployeeDashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

