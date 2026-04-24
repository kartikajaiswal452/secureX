import React from "react";
import { decryptFile } from "../utils/crypto";
import {
  FaFileAlt,
  FaImage,
  FaTrash,
  FaDownload,
  FaShare,
} from "react-icons/fa";

const FileCard = ({ file, onDelete }) => {
  if (!file) return null;

  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(file.filename || "");

  const getFileIcon = () => {
    if (isImage) return <FaImage className="text-blue-500 text-3xl" />;
    if (file.filename?.endsWith(".pdf"))
      return <FaFileAlt className="text-red-400 text-3xl" />;
    return <FaFileAlt className="text-gray-500 text-3xl" />;
  };
  const handleDownload = async () => {
    const password = prompt("Enter password");
    if (!password) return;
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
      const blob = await res.blob();
      const encryptedText = await blob.text();

      const decryptedBlob = decryptFile(encryptedText, password);

      const url = window.URL.createObjectURL(decryptedBlob);

      const a = document.createElement("a");
      a.href = url;
      a.download = file.filename;
      a.click();
    } catch (err) {
      console.error(err);
      alert("Download failed or wrong password ❌");
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
    <div className="bg-black/60 p-4 rounded-2xl border border-gray-800 shadow-lg">
      {/* ❌ Image preview removed (E2E incompatible) */}
      <div className="text-4xl mb-3 flex justify-center">{getFileIcon()}</div>

      <p className="text-white truncate">{file.filename}</p>

      <p className="text-sm text-gray-400">
        {(file.size / 1024).toFixed(2)} KB
      </p>

      <div className="flex justify-between mt-4">
        <button onClick={handleDownload}>
          <FaDownload />
        </button>

        <button onClick={handleShare}>
          <FaShare />
        </button>

        <button onClick={() => onDelete(file._id)}>
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default FileCard;
