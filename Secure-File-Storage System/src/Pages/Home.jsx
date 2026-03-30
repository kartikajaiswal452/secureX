import React from "react";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import bgImage5 from "../assets/Image/adrien-olichon-RCAhiGJsUUE-unsplash.jpg";
const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    console.log("loading");
  }, []);
  return (
    <div
      className="bg-cover bg-no-repeat bg-center min-h-screen w-full relative"
      style={{
        backgroundImage: `url(${bgImage5})`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="flex justify-between items-center p-4 absolute top-0 left-0 w-full h-16">
        <h1 className="text-white text-2xl font-bold">
          Secure File Storage System
        </h1>

        <div className="flex gap-4">
          <button
            className="text-white px-4 py-2 rounded-xl border border-gray-400 hover:border-indigo-400 "
            onClick={() => {
              navigate("/Login");
            }}
          >
            Login
          </button>
          <button
            className="border border-gray-400 px-4 py-2 rounded-xl hover:border-indigo-400 text-white"
            onClick={() => {
              navigate("/Register");
            }}
          >
            Signup
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center min-h-screen">
        <span className="text-orange-500 text-center text-2xl">
          We ensure your file security
        </span>
        <h1 className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mt-2 ">
          Secure File Storage System{" "}
        </h1>
        <span className=" block text-2xl sm:text-3xl mt-2 text-center text-white">
          <span className=" bg-orange-500/20 rounded">
            Store. Protect. Share
          </span>{" "}
          — All in One Place
        </span>
        <p className="text-sm sm:text-base md:text-lg p-4 sm:p-6 md:p-10 mt-3 text-center text-gray-200 max-w-3xl">
          Welcome to a modern and secure file management system designed to keep
          your data safe while making sharing effortless. This platform allows
          users to upload, manage, encrypt, and share files with complete
          control and privacy.
        </p>
      </div>
      <div className="bg-black rounded max-w-5xl mx-auto p-4 hover:border border-blue-300">
        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-[#111] rounded-2xl p-6 border border-gray-800 hover:border-indigo-500 transition">
            <h3 className="text-xl font-semibold mb-2 text-white">
              🔹 Secure File Upload
            </h3>
            <p className="text-gray-400">
              Upload your files with ease and store them safely in the cloud.
            </p>
          </div>

          <div className="bg-[#111] rounded-2xl p-6 border border-gray-800 hover:border-indigo-500 transition">
            <h3 className="text-xl font-semibold mb-2 text-white">
              🔹 File Encryption
            </h3>
            <p className="text-gray-400">
              Your files are encrypted to ensure maximum security and data
              protection.
            </p>
          </div>

          <div className="md:row-span-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 flex flex-col justify-between border border-gray-800">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-white">
                Why Choose This Platform?
              </h2>
              <ul className="text-gray-400 space-y-2">
                <li>✔ Protects sensitive data with strong security measures</li>
                <li>✔ Simple and user-friendly interface</li>
                <li>✔ Fast and reliable file access</li>
                <li>✔ Built with modern web technologies</li>
              </ul>
            </div>
          </div>

          <div className="bg-[#111] rounded-2xl p-6 border border-gray-800 hover:border-indigo-500 transition">
            <h3 className="text-xl font-semibold mb-2 text-white">
              🔹 Easy File Management
            </h3>
            <p className="text-gray-400">
              View, organize, and delete your files anytime.
            </p>
          </div>

          <div className="bg-[#111] rounded-2xl p-6 border border-gray-800 hover:border-indigo-500 transition">
            <h3 className="text-xl font-semibold mb-2 text-white">
              🔹 Secure Sharing
            </h3>
            <p className="text-gray-400">
              Generate shareable links to send files to others instantly.
            </p>
          </div>

          <div className="bg-[#111] rounded-2xl p-6 border border-gray-800 hover:border-indigo-500 transition">
            <h3 className="text-xl font-semibold mb-2 text-white">
              🔹 Access Control
            </h3>
            <p className="text-gray-400">
              Only authorized users can access shared files.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center text-center py-20 px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-white hover:text-blue-300">
          Get Started
        </h2>

        <p className="text-gray-300 mt-4 text-lg max-w-2xl">
          Upload your first file and experience secure file sharing like never
          before.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center text-center py-10 px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-white hover:text-blue-300">
          Our Mission
        </h2>

        <p className="text-gray-300 mt-4 text-lg max-w-2xl">
          To provide a secure, simple, and efficient way to store and share
          files without compromising privacy.
        </p>
      </div>
    </div>
  );
};
export default Home;
