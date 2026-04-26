import React, { useState, useEffect } from "react";
import { FaBars, FaUser, FaChartPie, FaLock, FaHistory } from "react-icons/fa";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("profile");
  const [files, setFiles] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("https://mern-project-4-ihvs.onrender.com/api/files", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setFiles(data || []))
      .catch((err) => console.error(err));
  }, []);

  // 📊 Stats
  const totalFiles = files.length;
  const totalSize = (
    files.reduce((acc, f) => acc + f.size, 0) /
    1024 /
    1024
  ).toFixed(2);

  const imageCount = files.filter((f) =>
    /\.(jpg|jpeg|png|gif)$/i.test(f.fileName),
  ).length;
  const pdfCount = files.filter((f) => f.fileName?.endsWith(".pdf")).length;

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 p-5 transition-transform duration-300 
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <h2 className="text-xl mb-6">Menu</h2>

        <p
          onClick={() => setActive("profile")}
          className="cursor-pointer mb-3 flex items-center gap-2 hover:text-indigo-400"
        >
          <FaUser /> Account
        </p>

        <p
          onClick={() => setActive("stats")}
          className="cursor-pointer mb-3 flex items-center gap-2 hover:text-indigo-400"
        >
          <FaChartPie /> Storage Analytics
        </p>

        <p
          onClick={() => setActive("security")}
          className="cursor-pointer mb-3 flex items-center gap-2 hover:text-indigo-400"
        >
          <FaLock /> Security
        </p>

        <p
          onClick={() => setActive("activity")}
          className="cursor-pointer flex items-center gap-2 hover:text-indigo-400"
        >
          <FaHistory /> Activity
        </p>
      </div>

      {/* Main */}
      <div className="flex-1 p-6">
        {/* Top bar */}
        <button onClick={() => setOpen(!open)} className="text-2xl mb-4">
          <FaBars />
        </button>

        {/* Profile Section */}
        {active === "profile" && (
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-md">
            <h2 className="text-xl mb-4">Profile</h2>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-2xl">
                K
              </div>

              <div>
                <p className="text-lg">Kartik</p>
                <p className="text-gray-400 text-sm">kartik@email.com</p>
              </div>
            </div>

            <button className="mt-4 bg-indigo-500 px-4 py-2 rounded">
              Edit Profile
            </button>
          </div>
        )}

        {/* Stats Section */}
        {active === "stats" && (
          <div>
            <h2 className="text-xl mb-4">Storage Analytics</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800 p-4 rounded-xl">
                <p>Total Files</p>
                <h3 className="text-2xl">{totalFiles}</h3>
              </div>

              <div className="bg-gray-800 p-4 rounded-xl">
                <p>Storage Used</p>
                <h3 className="text-2xl">{totalSize} MB</h3>
              </div>

              <div className="bg-gray-800 p-4 rounded-xl">
                <p>Images</p>
                <h3 className="text-2xl">{imageCount}</h3>
              </div>

              <div className="bg-gray-800 p-4 rounded-xl">
                <p>PDFs</p>
                <h3 className="text-2xl">{pdfCount}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Security Section */}
        {active === "security" && (
          <div className="bg-gray-800 p-6 rounded-xl max-w-md">
            <h2 className="text-xl mb-4">Security</h2>

            <p className="text-gray-400 mb-4">
              Your files are encrypted using AES-256 🔐
            </p>

            <button className="bg-red-500 px-4 py-2 rounded">
              Change Password
            </button>
          </div>
        )}

        {/* Activity Section */}
        {active === "activity" && (
          <div>
            <h2 className="text-xl mb-4">Recent Activity</h2>

            {files.slice(0, 5).map((file) => (
              <div key={file._id} className="bg-gray-800 p-3 rounded mb-2">
                Uploaded: {file.fileName}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
