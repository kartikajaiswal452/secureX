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

  const [files, setFiles] = useState([]);

  const [menuOpen, setMenuOpen] = useState(false);

  const [dragactive, setDragactive] = useState(false);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  const getToken = () => {
    const token = localStorage.getItem("token");

    if (!token || token === "undefined" || token === "null") {
      return null;
    }

    return token;
  };

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
    <div className="flex min-h-screen bg-[#050816] text-white relative overflow-hidden">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.15),transparent)] pointer-events-none"></div>

      {/* SIDEBAR */}
      <div className="w-64 bg-white/5 border-r border-white/10 p-6 hidden md:flex flex-col gap-8 backdrop-blur-xl">
        <h2 className="text-2xl font-black text-indigo-400">SecureX</h2>

        <div className="flex flex-col gap-4 text-gray-300">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 hover:text-white transition"
          >
            <MdDashboard /> Dashboard
          </button>

          <button
            onClick={() => navigate("/files")}
            className="flex items-center gap-3 hover:text-white transition"
          >
            <CiFileOn /> My Files
          </button>

          <button
            onClick={() => document.querySelector('input[type="file"]').click()}
            className="flex items-center gap-3 hover:text-white transition"
          >
            <FaCloudUploadAlt /> Upload
          </button>

          <button
            onClick={() => navigate("/security")}
            className="flex items-center gap-3 hover:text-white transition"
          >
            <MdOutlineSecurity /> Security
          </button>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
              Dashboard
            </h1>
            <p className="text-gray-400 mt-1">
              Manage your encrypted cloud files
            </p>
          </div>

          <div className="relative">
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                className="w-14 h-14 rounded-full border-2 border-indigo-500 cursor-pointer hover:scale-105 transition"
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
                    className="w-20 h-20 rounded-full mx-auto border-2 border-indigo-500"
                  />
                ) : (
                  <FaUserCircle className="text-7xl text-indigo-400 mx-auto" />
                )}
                <h3 className="mt-3 text-xl font-bold">{user?.name}</h3>
                <p className="text-gray-400 text-sm">{user?.email}</p>
              </div>

              <button
                onClick={() => document.getElementById("profileUpload").click()}
                className="w-full text-left px-4 py-3 rounded-2xl hover:bg-white/10"
              >
                📷 Change Profile
              </button>

              <button
                onClick={() => navigate("/profile")}
                className="w-full text-left px-4 py-3 rounded-2xl hover:bg-white/10"
              >
                👤 My Profile
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-2xl hover:bg-red-500/20 text-red-400"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="group relative overflow-hidden rounded-3xl p-[1px] bg-gradient-to-br from-indigo-400/30 via-purple-500/20 to-transparent hover:from-indigo-400/60 transition-all duration-300">
            <div className="relative bg-[#0f172a]/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 group-hover:border-indigo-400/30 transition-all">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-sm">Total Files</p>

                <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Active
                </span>
              </div>

              <h2 className="text-4xl font-semibold mt-4 text-white tracking-tight">
                {totalFiles}
              </h2>

              <p className="text-gray-500 text-xs mt-1">
                Files stored in your account
              </p>
            </div>
          </div>

          <div className="relative group rounded-3xl p-[1px] bg-gradient-to-br from-purple-500/40 via-indigo-500/30 to-pink-500/30 hover:scale-[1.03] transition-all duration-300">
            <div className="absolute inset-0 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition bg-gradient-to-br from-purple-600 to-pink-500"></div>

            <div className="relative bg-[#0b0f1a]/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl">
              <p className="text-gray-400 text-sm tracking-wide">
                Storage Used
              </p>

              <h2 className="text-4xl font-extrabold mt-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {totalSize} MB
              </h2>

              <div className="mt-4">
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((totalSize / 1000) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((totalSize / 1000) * 100)}% used
                </p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl p-[1px] bg-gradient-to-br from-green-400/30 via-emerald-500/20 to-transparent hover:from-green-400/60 transition-all duration-300">
            <div className="relative bg-[#0f172a]/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 group-hover:border-green-400/30 transition-all">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                  <MdOutlineSecurity className="text-green-400 text-xl" />
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                  Secure
                </span>
              </div>

              <p className="text-gray-400 text-sm mt-4">Security</p>

              <h2 className="text-2xl font-semibold mt-2 text-white tracking-tight">
                AES-256 Encryption
              </h2>

              <p className="text-gray-500 text-xs mt-1">
                Industry standard data protection
              </p>
            </div>
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
              className="w-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition"
            />
          </div>

          <div className="flex gap-3">
            {["all", "pdf", "image"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-5 py-2 rounded-full font-semibold transition ${
                  filter === type
                    ? "bg-indigo-600 shadow-lg"
                    : "bg-white/10 hover:bg-white/20"
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
          className={`relative border-2 border-dashed rounded-3xl p-16 text-center transition-all duration-300 
        ${
          dragactive
            ? "border-indigo-400 bg-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.4)]"
            : "border-white/10 bg-white/5 hover:border-indigo-400"
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
            or click to upload encrypted files
          </p>

          {uploading && (
            <p className="mt-5 text-indigo-400 font-bold animate-pulse">
              Uploading...
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 mt-10 mb-6">
          <h2 className="text-3xl font-black">My Files</h2>
          <CiFileOn className="text-3xl" />
        </div>

        {filteredFiles.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-20 text-center">
            <MdDashboard className="text-7xl text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">No Files Found</h2>
            <p className="text-gray-400 mt-3">Upload files to get started</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
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
    </div>
  );
};
export default Dashboard;
