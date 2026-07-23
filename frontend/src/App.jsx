import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SidebarLayout from "./components/SidebarLayout";
import EmployeeManagement from "./pages/EmployeeManagement";

// Mock views until pages are created
const ReportsOverview = () => (
  <div className="text-2xl font-bold">
    📊 Reports & Metrics Dashboard Overview
  </div>
);
const Projects = () => (
  <div className="text-2xl font-bold">💼 Project Control Center</div>
);
const Tasks = () => (
  <div className="text-2xl font-bold">✅ Task Assignment Board</div>
);

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <Routes>
      {/* Entry Point Authentication Frameworks */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Shielded Layout Sub-Tree Routing Structures */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <SidebarLayout />
          </ProtectedRoute>
        }
      >
        {/* Default Route: Dashboard Reports Overview[cite: 1] */}
        <Route index element={<ReportsOverview />} />

        {/* Functional Feature-Page Nodes */}
        <Route path="employees" element={<EmployeeManagement />} />
        <Route path="projects" element={<Projects />} />
        <Route path="tasks" element={<Tasks />} />
      </Route>

      {/* Catch-all Routing Strategy */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
