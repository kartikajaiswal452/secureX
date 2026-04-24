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
      console.log("No token → redirect");
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

      if (res.status === 401) {
        console.log("Unauthorized (token invalid or expired)");
        return; // ❗ DO NOT auto logout
      }

      const data = await res.json();
      setFiles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFiles();
    }, 300); // small delay prevents race condition

    return () => clearTimeout(timer);
  }, []);
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

    if (!token) {
      navigate("/Login");
      return;
    }
    const password = prompt("Enter password");
    if (!password) return;

    try {
      for (let file of selectedFiles) {
        if (!file) continue;
        await encryptAndUpload(file, password, token);
      }

      alert("Encrypted upload complete 🔐");
      fetchFiles();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Drag over
  const handleover = (e) => {
    e.preventDefault();
    setDragactive(true);
  };

  // ✅ Drag leave
  const handleDragleave = () => {
    setDragactive(false);
  };

  // ✅ Drop
  const handledrop = async (e) => {
    e.preventDefault();
    setDragactive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const token = getToken();

    if (!token) {
      navigate("/Login");
      return;
    }

    const password = prompt("Enter password");
    if (!password) return;

    try {
      for (let file of droppedFiles) {
        await encryptAndUpload(file, password, token);
      }

      alert("Encrypted upload complete 🔐");
      fetchFiles();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const token = getToken();

    if (!token) {
      navigate("/Login");
      return;
    }

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
      file.fileName?.toLowerCase().includes(search.toLowerCase()),
    )
    .filter((file) => {
      const original = file.fileName?.replace(".enc", "") || "";

      if (filter === "image") {
        return original.match(/\.(jpg|jpeg|png|gif)$/i);
      }
      if (filter === "pdf") {
        return original.endsWith(".pdf");
      }
      return true;
    });

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/Login");
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center p-6"
      style={{ backgroundImage: `url(${bgimage2})` }}
    >
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
        onDragLeave={handleDragleave}
        onDragOver={handleover}
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

      <div className="mt-10 flex justify-center">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
