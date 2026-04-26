import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import img1 from "../assets/Image/img1.jpg";
import img2 from "../assets/Image/img3.jpg";

const BASE_URL = "https://mern-project-4-ihvs.onrender.com";

const Login = () => {
  const images = [img1, img2];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  // 🔄 Image slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 📩 Send OTP
  const sendOtp = async () => {
    if (!email) {
      alert("Enter email first");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/auth/sendOtp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.log(err);
      alert("Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    if (!email || !otp) {
      alert("Enter email and OTP");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/auth/verifyOtp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        alert("OTP Login successful");
        navigate("/Dashboard");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("OTP verification failed");
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Fill details first");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        alert("Login successful");
        navigate("/Dashboard");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE IMAGE */}
      <div className="w-1/2 flex items-center justify-center bg-white">
        <div className="w-1/2">
          <img
            src={images[currentIndex]}
            alt="slider"
            className="h-full w-full object-cover transition-all duration-1000"
          />
        </div>
      </div>

      <div className="w-1/2 bg-slate-300 flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-98">
          <h2 className="text-2xl font-semibold text-center mb-6 text-blue-500">
            Secure Login
          </h2>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-3 p-3 rounded-lg border text-center"
          />

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="flex-1 p-3 rounded-lg border text-center"
            />
            <button
              onClick={sendOtp}
              className="bg-blue-600 text-white px-4 rounded-lg"
            >
              Send
            </button>
          </div>

          <button
            onClick={verifyOtp}
            className="w-full bg-green-600 text-white p-3 rounded-lg mb-4"
          >
            Verify OTP
          </button>

          <div className="text-center text-gray-400 mb-3 text-sm">OR</div>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-3 p-3 rounded-lg border text-center"
          />

          <button
            onClick={handleClick}
            className="w-full bg-black text-white p-3 rounded-lg"
          >
            Login with Password
          </button>

          <p className="text-center text-blue-700 mt-5 text-sm">
            Don't have an account?{" "}
            <span
              className="underline cursor-pointer"
              onClick={() => navigate("/Register")}
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
