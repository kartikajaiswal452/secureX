import React, { useEffect, useState } from "react";
import FileCard from "../Components/FileCard";
import { useNavigate } from "react-router-dom";

import {
  FaUserCircle,
  FaCloudUploadAlt,
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa";

import { CiFileOn } from "react-icons/ci";

import { MdDashboard, MdOutlineSecurity } from "react-icons/md";

const Dashboard = () => {
  // 🔥 CHANGE THIS PART
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser || storedUser === "undefined") {
        return null;
      }

      return JSON.parse(storedUser);
    } catch (err) {
      console.log("User parse error:", err);

      return null;
    }
  });

  // other states...
  // ================= STATES =================

  const [files, setFiles] = useState([]);

  const [menuOpen, setMenuOpen] = useState(false);

  const [dragactive, setDragactive] = useState(false);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  // ================= TOKEN =================

  const getToken = () => {
    const token = localStorage.getItem("token");

    if (!token || token === "undefined" || token === "null") {
      return null;
    }

    return token;
  };

  // ================= FETCH FILES =================

  const fetchFiles = async () => {
    const token = getToken();

    if (!token) {
      navigate("/Login");
      return;
    }

    try {
      const res = await fetch(
        "https://mern-project-4-ihvs.onrender.com/api/files",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      setFiles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // ================= PROFILE IMAGE =================

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const token = getToken();

    if (!token) return navigate("/Login");

    const formData = new FormData();

    formData.append("image", file);

    try {
      const res = await fetch(
        "https://mern-project-4-ihvs.onrender.com/api/users/upload-profile",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        },
      );
      const data = await res.json();
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      alert("Profile updated ✅");
    } catch (err) {
      console.error(err);
      alert("Upload failed ❌");
    }
  };

  const encryptAndUpload = async (file, password, token) => {
    const formData = new FormData();

    formData.append("file", file);

    formData.append("password", password);

    const res = await fetch(
      "https://mern-project-4-ihvs.onrender.com/api/files/upload",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formData,
      },
    );

    return await res.json();
  };

  const handleupload = async (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    const token = getToken();

    if (!token) return navigate("/Login");

    const password = prompt("Enter encryption password");

    if (!password) return;

    try {
      setUploading(true);

      for (let file of selectedFiles) {
        await encryptAndUpload(file, password, token);
      }

      alert("Files uploaded successfully 🔐");

      fetchFiles();
    } catch (err) {
      console.log(err);

      alert("Upload failed ❌");
    } finally {
      setUploading(false);
    }
  };

  const handledrop = async (e) => {
    e.preventDefault();

    setDragactive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);

    const token = getToken();

    if (!token) return navigate("/Login");

    const password = prompt("Enter encryption password");

    if (!password) return;

    try {
      setUploading(true);

      for (let file of droppedFiles) {
        await encryptAndUpload(file, password, token);
      }

      alert("Files uploaded successfully 🔐");

      fetchFiles();
    } catch (err) {
      console.log(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const token = getToken();

    try {
      await fetch(`https://mern-project-4-ihvs.onrender.com/api/files/${id}`, {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchFiles();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/Login");
  };

  const filteredFiles = files
    .filter((f) => f.fileName?.toLowerCase().includes(search.toLowerCase()))
    .filter((f) => {
      const name = f.fileName || "";

      if (filter === "image") {
        return name.match(/\.(jpg|jpeg|png|gif)$/i);
      }

      if (filter === "pdf") {
        return /\.pdf$/i.test(name);
      }

      return true;
    });

  useEffect(() => {
    const handleClick = () => setMenuOpen(false);

    if (menuOpen) {
      document.addEventListener("click", handleClick);
    }

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [menuOpen]);

  const totalFiles = files.length;

  const totalSize = (
    files.reduce((acc, f) => acc + (f.size || 0), 0) /
    1024 /
    1024
  ).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#050816] to-[#0b1120] text-white p-6">
      {/* PROFILE INPUT */}

      <input
        type="file"
        id="profileUpload"
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
      />

      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
            Secure Storage
          </h1>

          <p className="text-gray-400 mt-1">
            Manage your encrypted cloud files securely
          </p>
        </div>

        <div className="relative">
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              alt="avatar"
              className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500 cursor-pointer hover:scale-105 transition"
              onClick={(e) => {
                e.stopPropagation();

                setMenuOpen(!menuOpen);
              }}
            />
          ) : (
            <FaUserCircle
              className="text-5xl text-indigo-400 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();

                setMenuOpen(!menuOpen);
              }}
            />
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute right-0 top-16 w-72 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl transition-all duration-300 z-50 ${
              menuOpen
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <div className="text-center border-b border-white/10 pb-4 mb-4">
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="profile"
                  className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-indigo-500"
                />
              ) : (
                <FaUserCircle className="text-7xl text-indigo-400 mx-auto" />
              )}

              <h3 className="mt-3 text-xl font-bold">{user?.name || "User"}</h3>

              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>

            <button
              onClick={() => {
                document.getElementById("profileUpload").click();

                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-2xl hover:bg-white/10 transition mb-2"
            >
              📷 Change Profile
            </button>

            <button
              onClick={() => {
                navigate("/profile");

                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-2xl hover:bg-white/10 transition mb-2"
            >
              👤 My Profile
            </button>

            <button
              onClick={() => {
                navigate("/dashboard");

                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-2xl hover:bg-white/10 transition mb-2"
            >
              📁 Dashboard
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-2xl hover:bg-red-500/20 text-red-400 transition"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
          <p className="text-gray-400">Total Files</p>

          <h2 className="text-4xl font-black mt-2">{totalFiles}</h2>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
          <p className="text-gray-400">Storage Used</p>

          <h2 className="text-4xl font-black mt-2 text-indigo-400">
            {totalSize} MB
          </h2>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
          <p className="text-gray-400">Security</p>

          <h2 className="text-2xl font-bold mt-3 flex items-center gap-2 text-green-400">
            <MdOutlineSecurity />
            AES-256
          </h2>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
        <div className="relative w-full md:w-[400px]">
          <FaSearch className="absolute top-4 left-4 text-gray-500" />

          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex gap-3">
          {["all", "pdf", "image"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-5 py-2 rounded-full transition font-semibold ${
                filter === type ? "bg-indigo-600" : "bg-white/10"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div
        onDrop={handledrop}
        onDragOver={(e) => {
          e.preventDefault();

          setDragactive(true);
        }}
        onDragLeave={() => setDragactive(false)}
        className={`relative border-2 border-dashed rounded-3xl p-14 text-center transition-all duration-300 ${
          dragactive
            ? "border-indigo-500 bg-indigo-500/10"
            : "border-white/10 bg-white/5"
        }`}
      >
        <input
          type="file"
          multiple
          onChange={handleupload}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />

        <FaCloudUploadAlt className="text-6xl text-indigo-400 mx-auto mb-5" />

        <h2 className="text-2xl font-bold">Drag & Drop Files</h2>

        <p className="text-gray-400 mt-3">
          or click anywhere to upload encrypted files
        </p>

        {uploading && (
          <p className="mt-5 text-indigo-400 font-bold">Uploading files...</p>
        )}
      </div>

      {/* ================= FILES ================= */}

      <div className="flex items-center gap-3 mt-10 mb-6">
        <h2 className="text-3xl font-black">My Files</h2>

        <CiFileOn className="text-3xl" />
      </div>

      {/* FILE GRID */}

      {filteredFiles.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-20 text-center">
          <MdDashboard className="text-7xl text-gray-600 mx-auto mb-4" />

          <h2 className="text-2xl font-bold">No Files Found</h2>

          <p className="text-gray-400 mt-3">Upload files to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredFiles.map((file) => (
            <FileCard
              key={file._id}
              file={file}
              onDelete={() => handleDelete(file._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
