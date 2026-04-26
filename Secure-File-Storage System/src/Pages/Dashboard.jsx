import React, { useEffect, useState } from "react";
import FileCard from "../Components/FileCard";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { CiFileOn } from "react-icons/ci";
import bgimage2 from "../assets/Image/dashboard.jpg";

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dragactive, setDragactive] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined" || token === "null") return null;
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
          headers: { Authorization: `Bearer ${token}` },
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

  const encryptAndUpload = async (file, password, token) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("password", password);

    const res = await fetch(
      "https://mern-project-4-ihvs.onrender.com/api/files/upload",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      },
    );

    return await res.json();
  };

  const handleupload = async (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const token = getToken();

    if (!token) return navigate("/Login");

    const password = prompt("Enter password");
    if (!password) return;

    for (let file of selectedFiles) {
      await encryptAndUpload(file, password, token);
    }

    alert("Upload complete 🔐");
    fetchFiles();
  };

  const handledrop = async (e) => {
    e.preventDefault();
    setDragactive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const token = getToken();

    if (!token) return navigate("/Login");

    const password = prompt("Enter password");
    if (!password) return;

    for (let file of droppedFiles) {
      await encryptAndUpload(file, password, token);
    }

    alert("Upload complete 🔐");
    fetchFiles();
  };

  const handleDelete = async (id) => {
    const token = getToken();

    await fetch(`https://mern-project-4-ihvs.onrender.com/api/files/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchFiles();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/Login");
  };

  const filteredFiles = files
    .filter((f) => f.fileName?.toLowerCase().includes(search.toLowerCase()))
    .filter((f) => {
      const name = f.fileName || "";
      if (filter === "image") return name.match(/\.(jpg|jpeg|png|gif)$/i);
      if (filter === "pdf") return name.endsWith(".pdf");
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

  return (
    <div
      className="min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: `url(${bgimage2})` }}
    >
      <div className="absolute top-5 right-5 z-50">
        <FaUserCircle
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className="text-white text-3xl cursor-pointer hover:scale-110 transition"
        />

        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute right-0 mt-3 w-56 bg-black/90 backdrop-blur-md 
          rounded-xl shadow-2xl border border-gray-700 p-4
          transition-all duration-200 origin-top-right
          ${
            menuOpen
              ? "scale-100 opacity-100"
              : "scale-95 opacity-0 pointer-events-none"
          }`}
        >
          <div className="border-b border-gray-700 pb-3 mb-3">
            <p className="text-white font-semibold">{user?.name || "User"}</p>
            <p className="text-gray-400 text-sm">
              {user?.email || "email@example.com"}
            </p>
          </div>

          <p
            onClick={() => {
              navigate("/profile");
              setMenuOpen(false);
            }}
            className="cursor-pointer hover:bg-gray-800 px-3 py-2 rounded"
          >
            👤 Profile
          </p>

          <p
            onClick={() => {
              navigate("/dashboard");
              setMenuOpen(false);
            }}
            className="cursor-pointer hover:bg-gray-800 px-3 py-2 rounded"
          >
            📁 Dashboard
          </p>

          <p
            onClick={handleLogout}
            className="cursor-pointer text-red-400 hover:bg-gray-800 px-3 py-2 rounded"
          >
            🚪 Logout
          </p>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto mb-6">
        <input
          type="text"
          placeholder="Search files..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-black/60 text-white px-5 py-3 rounded-2xl border border-gray-700"
        />
      </div>

      <div className="flex gap-3 mb-6 justify-center">
        {["all", "pdf", "image"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-5 py-2 rounded-full ${
              filter === type
                ? "bg-indigo-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div
        onDrop={handledrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragactive(true);
        }}
        onDragLeave={() => setDragactive(false)}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center ${
          dragactive ? "border-indigo-500" : "border-gray-700"
        }`}
      >
        <input
          type="file"
          multiple
          onChange={handleupload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <p className="text-white">Drag & drop or click to upload 🔐</p>
      </div>

      <div className="flex items-center gap-3 mt-6 mb-4">
        <h2 className="text-2xl text-white">My Files</h2>
        <CiFileOn className="text-white" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredFiles.map((file) => (
          <FileCard
            key={file._id}
            file={file}
            onDelete={() => handleDelete(file._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
