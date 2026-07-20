import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import bgImage5 from "../assets/image/adrien-olichon-RCAhiGJsUUE-unsplash.jpg";
import dashboardImg from "../assets/image/folderimg.jpg";
import sharingImg from "../assets/image/sharingimg.jpg";
import securityImg from "../assets/image/securityimg.jpg";
import logo from "../assets/image/securex.jpg";
const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Home Loaded 🚀");
  }, []);

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage5})`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <div className="absolute w-[500px] h-[500px] bg-indigo-500/30 blur-3xl rounded-full top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-purple-500/20 blur-3xl rounded-full bottom-[-100px] right-[-100px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl"
        >
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="SecureX Logo"
              className="w-12 h-12 rounded-lg bg-white p-1"
            />

            <div>
              <h1 className="text-white text-2xl font-bold">SecureX</h1>
              <p className="text-xs text-gray-400">
                Secure File Storage Platform
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/Login")}
              className="px-4 py-2 rounded-xl border border-white/20 text-white hover:bg-white/10 transition"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/Register")}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:scale-105 transition"
            >
              Signup
            </button>
          </div>
        </motion.div>

        <div className="text-center mt-24">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            Secure File Storage System
          </h1>

          <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
            Store, encrypt, and share your files with complete privacy using
            modern AES-256 encryption.
          </p>

          <button
            onClick={() => navigate("/Register")}
            className="mt-6 px-6 py-3 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition shadow-lg"
          >
            Get Started 🚀
          </button>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-6">
          {[
            "Secure Upload",
            "AES Encryption",
            "File Management",
            "Secure Sharing",
            "Access Control",
          ].map((title, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-400 hover:scale-105 transition"
            >
              <h3 className="text-white text-xl">{title}</h3>
              <p className="text-gray-400 mt-2">
                Experience secure and modern file storage.
              </p>
            </div>
          ))}

          <div className="md:row-span-2 p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10">
            <h2 className="text-2xl text-white font-bold mb-4">
              Why Choose Us?
            </h2>
            <ul className="text-gray-400 space-y-2">
              <li>✔ AES-256 Encryption</li>
              <li>✔ Fast uploads</li>
              <li>✔ Secure sharing</li>
              <li>✔ Clean UI</li>
            </ul>
          </div>
        </div>

        <div className="mt-24 grid md:grid-cols-2 gap-10 items-center">
          <img
            src={dashboardImg}
            className="rounded-2xl shadow-2xl hover:scale-105 transition duration-500"
            alt="dashboard"
          />

          <div>
            <h2 className="text-3xl text-white font-bold mb-4">
              Powerful Dashboard
            </h2>
            <p className="text-gray-400">
              Manage all your files in a clean, modern and secure interface.
            </p>
          </div>
        </div>

        <div className="mt-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl text-white font-bold mb-4">
              Easy File Sharing
            </h2>
            <p className="text-gray-400">
              Share files securely with encrypted access links and permissions.
            </p>
          </div>

          <img
            src={sharingImg}
            className="rounded-2xl shadow-2xl hover:scale-105 transition duration-500"
            alt="sharing"
          />
        </div>

        <div className="mt-24 grid md:grid-cols-2 gap-10 items-center">
          <img
            src={securityImg}
            className="rounded-2xl shadow-2xl hover:scale-105 transition duration-500"
            alt="security"
          />

          <div>
            <h2 className="text-3xl text-white font-bold mb-4">
              Advanced Security
            </h2>
            <p className="text-gray-400">
              AES encryption, secure authentication, and complete access control
              for your data.
            </p>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { num: "10K+", label: "Users" },
            { num: "50K+", label: "Files" },
            { num: "99.9%", label: "Uptime" },
            { num: "256-bit", label: "Encryption" },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 bg-white/5 rounded-xl hover:scale-105 transition"
            >
              <h3 className="text-white text-2xl font-bold">{item.num}</h3>
              <p className="text-gray-400">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <h2 className="text-3xl text-white font-bold mb-10">
            What Users Say
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {["Amazing!", "Very Secure!", "Best UI!"].map((text, i) => (
              <div
                key={i}
                className="p-6 bg-white/5 rounded-xl hover:scale-105 transition"
              >
                <p className="text-gray-300">"{text}"</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 border-t border-white/10 py-10 text-center">
          <div className="flex items-center justify-center gap-2">
            <img
              src={logo}
              alt="logo"
              className="w-8 h-8 bg-white p-1 rounded"
            />
            <h3 className="text-white text-lg font-semibold">SecureX</h3>
          </div>

          <p className="text-gray-400 mt-2">
            Secure File Storage & Sharing Platform
          </p>

          <p className="text-gray-500 text-sm mt-2">
            © 2026 SecureX. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
