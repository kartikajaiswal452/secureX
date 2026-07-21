import React, { useState, useEffect } from "react";
import { FaBars, FaUser, FaChartPie, FaLock, FaHistory } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

const Profile = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("profile");
  const [files, setFiles] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser || storedUser === "undefined") return null;
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  });

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    phone: user?.phone || "",
    location: user?.location || "",
  });

  useEffect(() => {
    fetch("https://securex-d2tq.onrender.com/api/files", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setFiles(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  const totalFiles = files.length;

  const totalSize = (
    files.reduce((acc, f) => acc + (f.size || 0), 0) /
    1024 /
    1024
  ).toFixed(2);

  const imageCount = files.filter((f) =>
    /\.(jpg|jpeg|png|gif)$/i.test(f.fileName),
  ).length;

  const pdfCount = files.filter((f) => /\.pdf$/i.test(f.fileName)).length;

  const videoCount = files.filter((f) =>
    /\.(mp4|mkv|mov|avi)$/i.test(f.fileName),
  ).length;

  const otherCount = totalFiles - imageCount - pdfCount - videoCount;

  const storageLimit = 1024;
  const storageUsedPercent = ((totalSize / storageLimit) * 100).toFixed(1);

  const pieData = [
    { name: "Images", value: imageCount },
    { name: "PDFs", value: pdfCount },
    { name: "Videos", value: videoCount },
    { name: "Others", value: otherCount },
  ];

  const barData = [
    { name: "Files", value: totalFiles },
    { name: "Storage(MB)", value: parseFloat(totalSize) },
    { name: "Images", value: imageCount },
    { name: "PDFs", value: pdfCount },
  ];

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        "https://securex-d2tq.onrender.com/api/users/upload-profile",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      const data = await res.json();
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      alert("Profile Updated ✅");
    } catch {
      alert("Upload failed ❌");
    }
  };

  const handleProfileSave = async () => {
    try {
      const res = await fetch(
        "https://securex-d2tq.onrender.com/api/users/update-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profileData),
        },
      );

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      setEditMode(false);
    } catch {
      alert("Error ❌");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-3xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 text-white flex">
      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-slate-950/90 border-r border-white/10 backdrop-blur-xl p-6 transition z-50
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
          SecureX
        </h2>

        {[
          { name: "profile", icon: <FaUser />, label: "Account" },
          { name: "stats", icon: <FaChartPie />, label: "Analytics" },
          { name: "security", icon: <FaLock />, label: "Security" },
          { name: "activity", icon: <FaHistory />, label: "Activity" },
        ].map((item) => (
          <div
            key={item.name}
            onClick={() => {
              setActive(item.name);
              setOpen(false);
            }}
            className={`cursor-pointer flex items-center gap-3 p-3 rounded-xl mb-3 transition
            ${
              active === item.name
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                : "hover:bg-white/5 text-gray-300"
            }`}
          >
            {item.icon}
            {item.label}
          </div>
        ))}
      </div>

      <div className="flex-1 p-6 ml-0 md:ml-64">
        <button
          onClick={() => setOpen(!open)}
          className="text-2xl mb-6 md:hidden"
        >
          <FaBars />
        </button>

        {active === "profile" && (
          <div className="space-y-8">
            {/* Profile Card */}
            <div className="bg-[#0f172a]/80 rounded-3xl overflow-hidden">
              {/* Banner */}
              <div
                className="
h-40 
bg-gradient-to-r 
from-indigo-600 
via-purple-600 
to-blue-600
"
              ></div>

              <div className="p-8">
                <div className="flex items-center gap-6 -mt-20">
                  {/* Avatar */}

                  <div className="relative">
                    {user?.profilePic ? (
                      <img
                        src={user.profilePic}
                        className="
w-32 h-32
rounded-full
border-4
border-[#0f172a]
"
                      />
                    ) : (
                      <div
                        className="
w-32 h-32
rounded-full
bg-indigo-600
flex
items-center
justify-center
text-4xl
border-4
border-[#0f172a]
"
                      >
                        {user?.email?.charAt(0)}
                      </div>
                    )}

                    <input
                      type="file"
                      hidden
                      id="upload"
                      onChange={handleProfileUpload}
                    />

                    <label
                      htmlFor="upload"
                      className="
absolute
bottom-2
right-2
bg-indigo-600
p-2
rounded-full
cursor-pointer
"
                    >
                      📷
                    </label>
                  </div>

                  <div className="mt-16">
                    <h2 className="text-3xl font-bold">{user?.name}</h2>

                    <p className="text-gray-400">{user?.email}</p>

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => setEditMode(!editMode)}
                        className="bg-indigo-600 px-5 py-2 rounded-xl"
                      >
                        Edit Profile
                      </button>

                      <button
                        onClick={handleLogout}
                        className="bg-red-600 px-5 py-2 rounded-xl"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}

            <div className="grid md:grid-cols-3 gap-6">
              <div
                className="
bg-[#0f172a]/80
p-6
rounded-2xl
"
              >
                <h3 className="text-gray-400">Total Files</h3>

                <p className="text-4xl font-bold text-indigo-400">
                  {totalFiles}
                </p>
              </div>

              <div
                className="
bg-[#0f172a]/80
p-6
rounded-2xl
"
              >
                <h3 className="text-gray-400">Storage Used</h3>

                <p className="text-4xl font-bold text-green-400">
                  {totalSize} MB
                </p>
              </div>

              <div
                className="
bg-[#0f172a]/80
p-6
rounded-2xl
"
              >
                <h3 className="text-gray-400">Security Score</h3>

                <p className="text-4xl font-bold text-yellow-400">95%</p>
              </div>
            </div>

            {/* Security Card */}

            <div
              className="
bg-[#0f172a]/80
p-6
rounded-2xl
"
            >
              <h2 className="text-xl font-bold mb-4">🔐 SecureX Protection</h2>

              <div className="space-y-3 text-gray-300">
                <p>✅ AES File Encryption</p>

                <p>✅ JWT Authentication</p>

                <p>✅ Cloudinary Secure Storage</p>

                <p>✅ Protected File Access</p>
              </div>
            </div>

            {/* Edit */}

            {editMode && (
              <div className="bg-[#0f172a]/80 p-6 rounded-2xl">
                <input
                  className="
w-full
p-3
bg-black
border
rounded-xl
mb-3
"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      name: e.target.value,
                    })
                  }
                />

                <button
                  onClick={handleProfileSave}
                  className="
bg-green-600
px-5
py-2
rounded-xl
"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        )}

        {active === "stats" && (
          <div className="space-y-8">
            <h2 className="text-3xl text-indigo-400">Analytics</h2>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="bg-[#0f172a]/80 p-6 rounded-2xl">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value">
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {active === "security" && (
          <div className="space-y-6">
            <h2 className="text-3xl text-indigo-400">Security</h2>

            <input
              type="password"
              placeholder="New Password"
              className="w-full p-3 bg-black border rounded"
            />
            <button className="bg-indigo-600 px-5 py-2 rounded">Update</button>

            <button className="bg-red-600 px-5 py-2 rounded">Logout All</button>
          </div>
        )}

        {active === "activity" && (
          <div>
            <h2 className="text-3xl text-indigo-400 mb-4">Activity</h2>

            {files.slice(0, 5).map((file, i) => (
              <div key={i} className="flex justify-between border-b py-2">
                <span>{file.fileName}</span>
                <span className="text-gray-400">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
