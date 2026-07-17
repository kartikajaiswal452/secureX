import React from "react";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Register from "./Pages/Register";
import SharePage from "./Pages/ShareFile";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "./Components/Profile";
import Files from "./pages/Files";
import Security from "./pages/Security";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Share/:ShareId" element={<SharePage />} />
        <Route path="/profile" element={<Profile />} />;{/* Protected Route */}
        <Route path="/files" element={<Files />} />
        <Route path="/security" element={<Security />} />
        <Route
          path="/Dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
