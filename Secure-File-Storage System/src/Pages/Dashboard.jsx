import React, { useEffect, useState } from "react";
import FileCard from "../Components/FileCard";
import { useNavigate } from "react-router-dom";
import { CiFileOn } from "react-icons/ci";
import bgimage2 from "../assets/Image/dashboard.jpg";
const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [dragactive, setDragactive] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const fetchFiles = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      "https://mern-project-4-ihvs.onrender.com/api/files",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await res.json();
    console.log("Fetched files:", data);
    if (Array.isArray(data)) {
      setFiles(data);
    } else {
      console.error(data);
      setFiles([]);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      fetchFiles();
    }
  }, [navigate]);
  const handleupload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    const token = localStorage.getItem("token");
    try {
      for (let file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        await fetch(
          "https://mern-project-4-ihvs.onrender.com/api/files/upload",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          },
        );
      }
      alert("Files uploaded");
      fetchFiles();
    } catch (err) {
      console.error(err);
    }
  };
  const handleover = (e) => {
    e.preventDefault();
    setDragactive(true);
  };
  const handleDragleave = () => {
    setDragactive(false);
  };
  const handledrop = async (e) => {
    e.preventDefault();
    setDragactive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    const token = localStorage.getItem("token");
    try {
      for (let file of droppedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        await fetch(
          "https://mern-project-4-ihvs.onrender.com/api/files/upload",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          },
        );
      }
      fetchFiles();
    } catch (err) {
      console.error(err);
    }
  };
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`https://mern-project-4-ihvs.onrender.com/api/files/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchFiles();
    } catch (err) {
      console.error(err);
    }
  };
  const filteredFiles = files
    .filter((file) =>
      file.filename.toLowerCase().includes(search.toLowerCase()),
    )
    .filter((file) => {
      if (filter === "image") {
        return file.filename.match(/\.(jpg|jpeg|png|gif)$/);
      }
      if (filter === "pdf") {
        return file.filename.endsWith(".pdf");
      }
      return true;
    });
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat  p-6"
      style={{
        backgroundImage: `url(${bgimage2})`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-full max-w-md mx-auto mb-6 relative">
        <input
          type="text"
          placeholder="Search files..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-black/60 backdrop-blur-md text-white placeholder-gray-400 px-5 py-3 rounded-2xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />

        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          🔍
        </span>
      </div>
      <div className="flex gap-3 mb-6 justify-center">
        {["all", "pdf", "image"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition border
        ${
          filter === type
            ? "bg-indigo-500 text-white border-indigo-500 shadow-md"
            : "bg-black/60 text-gray-300 border-gray-700 hover:border-indigo-400 hover:text-white"
        }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
      <div
        onDrop={handledrop}
        onDragLeave={handleDragleave}
        onDragOver={handleover}
        onDragEnter={handleover}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition
  ${
    dragactive
      ? "border-indigo-500 bg-indigo-500/10"
      : "border-gray-700 bg-black/60 hover:border-indigo-400"
  }`}
      >
        <input
          type="file"
          multiple
          onChange={handleupload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
          <div className="text-4xl">📂</div>

          <p className="text-lg text-white font-medium">
            Drag & drop files here
          </p>

          <p className="text-gray-400 text-sm">
            or click to browse from your device
          </p>

          <span className="text-indigo-400 text-sm">
            Upload your files securely
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-3xl font-bold text-white">My Files</h2>

        <CiFileOn className="text-indigo-400 text-3xl" />
      </div>
      <div className="mt-6">
        {filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">📂</div>

            <p className="text-xl text-gray-300 font-medium">No files found</p>

            <p className="text-gray-500 mt-2">
              Try uploading files or change your filter
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-yellow-300"
      >
        Logout
      </button>
    </div>
  );
};
export default Dashboard;
