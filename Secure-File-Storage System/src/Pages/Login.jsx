import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import img1 from "../assets/Image/img1.jpg";
import img2 from "../assets/Image/img3.jpg";

const BASE_URL = "https://mern-project-4-ihvs.onrender.com";

const Login = () => {
  const navigate = useNavigate();

  const images = [img1, img2];

  const [currentIndex, setCurrentIndex] = useState(0);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);

  const [otpLoading, setOtpLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const sendOtp = async () => {
    if (!email) {
      alert("Enter email first");
      return;
    }

    try {
      setOtpLoading(true);

      const res = await fetch(`${BASE_URL}/api/auth/sendOtp`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("OTP Sent Successfully ✅");
    } catch (err) {
      console.log(err);

      alert("Failed to send OTP ❌");
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!email || !otp) {
      alert("Enter email and OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/auth/verifyOtp`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem("user", JSON.stringify(data.user));

      alert("OTP Login Successful ✅");

      navigate("/Dashboard");
    } catch (err) {
      console.log(err);

      alert("OTP verification failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Fill details first");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login Successful ✅");

      navigate("/Dashboard");
    } catch (err) {
      console.log(err);

      alert("Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-black overflow-hidden">
      <div className="hidden lg:flex w-1/2 relative items-center justify-center bg-black overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500/20 blur-3xl rounded-full"></div>

        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/20 blur-3xl rounded-full"></div>

        <div className="relative z-10 w-[80%] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
          <img
            src={images[currentIndex]}
            alt="slider"
            className="w-full h-[650px] object-cover transition-all duration-1000"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

          <div className="absolute bottom-10 left-10 text-white">
            <h1 className="text-5xl font-black leading-tight">
              Secure Cloud
              <br />
              Storage Platform
            </h1>

            <p className="mt-4 text-gray-300 text-lg">
              Protect your files with enterprise-grade encryption.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gradient-to-br from-gray-950 via-black to-gray-900">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* HEADER */}

          <div className="text-center mb-8">
            <h2 className="text-4xl font-black bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
              Welcome Back
            </h2>

            <p className="text-gray-400 mt-3">Login to your secure account</p>
          </div>

          <div className="mb-5">
            <label className="text-sm text-gray-400 mb-2 block">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none p-4 rounded-2xl text-white transition"
            />
          </div>

          <div className="mb-5">
            <label className="text-sm text-gray-400 mb-2 block">
              OTP Verification
            </label>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="flex-1 bg-black/40 border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none p-4 rounded-2xl text-white transition"
              />

              <button
                onClick={sendOtp}
                disabled={otpLoading}
                className="bg-indigo-600 hover:bg-indigo-700 px-5 rounded-2xl font-semibold transition disabled:opacity-50"
              >
                {otpLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>

          <button
            onClick={verifyOtp}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 py-4 rounded-2xl font-bold transition duration-300 shadow-lg disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-700"></div>

            <p className="text-gray-500 text-sm">OR</p>

            <div className="flex-1 h-px bg-gray-700"></div>
          </div>

          <div className="mb-5">
            <label className="text-sm text-gray-400 mb-2 block">Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none p-4 rounded-2xl text-white transition"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.01] py-4 rounded-2xl font-bold transition duration-300 shadow-xl disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login with Password"}
          </button>

          <p className="text-center text-gray-400 mt-8">
            Don't have an account?{" "}
            <span
              className="text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
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
