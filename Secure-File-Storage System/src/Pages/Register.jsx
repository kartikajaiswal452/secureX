import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgimage1 from "../assets/Image/zulfugar-karimov-2_rlRMukZO4-unsplash.jpg";
const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleregister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(
        "https://mern-project-4-ihvs.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            username,
            email,
            phone,
            password,
          }),
        },
      );

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
    }
  };
  return (
    <div
      className="h-screen w-full flex items-center justify-center bg-cover bg-no-repeat bg-center"
      style={{
        backgroundImage: `url(${bgimage1})`,
        backgroundAttachment: "fixed",
      }}
    >
      <form
        onSubmit={handleregister}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
      >
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Create SecureX Account
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-3 mb-3 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none"
          required
        />

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-3 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none"
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-3 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none"
          required
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 mb-3 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-3 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none"
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 mb-4 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none"
          required
        />

        <button
          type="submit"
          className="w-full p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:scale-105 transition"
        >
          Create Account
        </button>

        <p className="text-center text-gray-300 mt-4">
          Already have an account?{" "}
          <span
            className="text-indigo-400 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
        <div className="mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-gray-300 hover:bg-white/20 hover:text-white transition-all"
          >
            ← Back to Home
          </button>
        </div>
      </form>
    </div>
  );
};
export default Register;
