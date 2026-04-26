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
    if (isImage) return <FaImage className="text-blue-500 text-3xl" />;
    if (file.fileName?.endsWith(".pdf"))
      return <FaFileAlt className="text-red-400 text-3xl" />;
    return <FaFileAlt className="text-gray-500 text-3xl" />;
  };

  // ✅ DOWNLOAD (Backend decrypts)
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

  // ✅ SHARE
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
      className="bg-black/60 p-4 rounded-2xl border border-gray-800 shadow-lg 
                 transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
    >
      {/* Icon */}
      <div className="text-4xl mb-3 flex justify-center">{getFileIcon()}</div>

      {/* Name */}
      <p className="text-white truncate">{file.fileName}</p>

      {/* Size */}
      <p className="text-sm text-gray-400">
        {(file.size / 1024).toFixed(2)} KB
      </p>

      {/* Actions */}
      <div className="flex justify-between mt-4 text-white">
        <button onClick={handleDownload} className="hover:text-green-400">
          <FaDownload />
        </button>

        <button onClick={handleShare} className="hover:text-blue-400">
          <FaShare />
        </button>

        <button
          onClick={() => onDelete(file._id)}
          className="hover:text-red-400"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default FileCard;
