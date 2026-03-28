import React from "react";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import register from "./Pages/Register";
import SharePage from "./Pages/ShareFile";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./Pages/Register";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={<Login />}></Route>
        <Route path="/" element={<Home />}></Route>
        <Route path="/Dashboard" element={<Dashboard />}></Route>
        <Route path="/Register" element={<Register />}></Route>
        <Route path="/Share/:ShareId" element={<SharePage />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
