import React from "react";
import {
  FaFileAlt,
  FaImage,
  FaTrash,
  FaDownload,
  FaShare,
} from "react-icons/fa";

const FileCard = ({ file, onDelete }) => {
  if (!file) return null;

  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(file.fileName || "");

  const getFileIcon = () => {
    if (isImage) return <FaImage className="text-indigo-400 text-3xl" />;
    if (file.fileName?.endsWith(".pdf"))
      return <FaFileAlt className="text-red-400 text-3xl" />;
    return <FaFileAlt className="text-gray-400 text-3xl" />;
  };

  const handleDownload = async () => {
    const password = prompt("Enter password");
    if (!password) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://mern-project-4-ihvs.onrender.com/api/files/download/${file._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password }),
        },
      );

      if (!res.ok) {
        throw new Error("Download failed");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = file.fileName;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Wrong password or download failed ❌");
    }
  };

  const handleShare = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://mern-project-4-ihvs.onrender.com/api/files/share/${file._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      await navigator.clipboard.writeText(data.shareLink);
      alert("Link copied!");
    } catch (err) {
      console.error(err);
      alert("Share failed");
    }
  };

  return (
    <div
      className="group relative bg-white/5 backdrop-blur-xl border border-white/10 
                 rounded-2xl p-5 shadow-xl transition-all duration-300 
                 hover:scale-[1.03] hover:shadow-indigo-500/20 hover:border-indigo-400/30"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition"></div>

      {isImage ? (
        <div className="h-32 mb-4 rounded-xl overflow-hidden">
          <img
            src={`https://mern-project-4-ihvs.onrender.com/uploads/${file.fileName}`}
            alt={file.fileName}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      ) : (
        <div className="flex justify-center mb-4">{getFileIcon()}</div>
      )}

      <div className="relative z-10">
        <p className="text-white font-medium truncate">{file.fileName}</p>

        <p className="text-xs text-gray-400 mt-1">
          {(file.size / 1024).toFixed(2)} KB
        </p>
      </div>

      <div className="relative z-10 flex justify-between items-center mt-5">
        <button
          onClick={handleDownload}
          className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg 
                     bg-green-500/10 text-green-400 hover:bg-green-500/20 transition"
        >
          <FaDownload />
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg 
                     bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition"
        >
          <FaShare />
        </button>

        <button
          onClick={() => onDelete(file._id)}
          className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg 
                     bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default FileCard;
