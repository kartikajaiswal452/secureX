import React from "react";
import {
  FaFileAlt,
  FaImage,
  FaTrash,
  FaDownload,
  FaShare,
} from "react-icons/fa";
const FileCard = ({ file, onDelete }) => {
  const isImage = file.filename?.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/);
  const getFileIcon = () => {
    if (isImage) {
      return <FaImage className="text-blue-500 text-3xl" />;
    }
    if (file.filename?.endsWith(".pdf")) {
      return <FaFileAlt className="text-red-400 text-3xl" />;
    }
    return <FaFileAlt className="text-gray-500 text-3xl" />;
  };
  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://mern-project-4-ihvs.onrender.com/api/files/download/${file._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        const errText = await res.text(); // read ONLY once
        throw new Error(errText || "Download failed");
      }

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.filename;

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };
  const handleShare = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://mern-project-4-ihvs.onrender.com/api/files/download/${file._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Share failed");
      }

      const data = await res.json();

      if (!data.shareLink) {
        throw new Error("No link received");
      }

      await navigator.clipboard.writeText(data.shareLink);
      alert("Link copied!");
    } catch (err) {
      console.error(err);
      alert("Share failed");
    }
  };
  return (
    <div className="bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-gray-800 shadow-lg transition transform hover:-translate-y-1 hover:shadow-2xl">
      {isImage ? (
        <img
          src={`https://mern-project-4-ihvs.onrender.com/${file.path}`}
          alt={file.filename}
          className="h-36 w-full object-cover rounded-xl mb-3 transition hover:scale-105"
        />
      ) : (
        <div className="text-4xl text-indigo-400 mb-3 flex justify-center">
          {getFileIcon()}
        </div>
      )}

      <p className="font-semibold text-white truncate">{file.filename}</p>

      <p className="text-sm text-gray-400">
        {(file.size / 1024).toFixed(2)} KB
      </p>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handleDownload}
          className="text-gray-400 hover:text-indigo-400 transition text-lg"
        >
          <FaDownload />
        </button>

        <button
          onClick={handleShare}
          className="text-gray-400 hover:text-blue-400 transition text-lg"
        >
          <FaShare />
        </button>

        <button
          onClick={onDelete}
          className="text-gray-400 hover:text-red-500 transition text-lg"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};
export default FileCard;
