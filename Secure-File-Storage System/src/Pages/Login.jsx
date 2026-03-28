import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/Image/billy-huynh-W8KTS-mhFUE-unsplash.jpg";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    console.log("loading");
  }, []);
  const handleclick = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("fill details first");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        alert("login successful");
        navigate("/Dashboard");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div
      className="h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundAttachment: "fixed",
      }}
    >
      <form
        onSubmit={handleclick}
        className="bg-white/5 backdrop-blur-xl p-6 rounded-xl shadow-lg w-80 mt-10  border border-white/20"
      >
        <h4 className="text-xl font-bold mb-3 text-center hover:text-black-100">
          Welcome back! Please login to access your files securely.
        </h4>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          className="w-full mb-2 p-2 text-center border-2 rounded-xl hover:border-blue-500"
        />
        <input
          type="password"
          placeholder="enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          className="w-full mb-2 p-2 text-center border-2  rounded-xl hover:border-blue-500"
        />
        <button className="bg-blue-600 w-full text-white p-2 rounded-xl hover:bg-blue-200">
          Login
        </button>
        <p className="text-center mt-3 text-black">
          Don't have an account?{" "}
          <span
            className="underline cursor-pointer hover:text-blue-500"
            onClick={() => navigate("/Register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};
export default Login;
