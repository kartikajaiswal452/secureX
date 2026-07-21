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
const StatCard = ({ title, value, color }) => {
  return (
    <div className="bg-[#0f172a]/80 p-6 rounded-2xl border border-white/10">
      <p className="text-gray-400">{title}</p>

      <h2 className={`text-4xl font-bold mt-2 ${color}`}>{value}</h2>
    </div>
  );
};

const SecurityCard = ({ title, value }) => {
  return (
    <div className="bg-black/20 p-5 rounded-xl border border-white/10">
      <p className="text-gray-400">{title}</p>

      <h2 className="text-3xl font-bold mt-2 text-white">{value}</h2>
    </div>
  );
};
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

  const totalSize = Number(
    (files.reduce((acc, f) => acc + (f.size || 0), 0) / 1024 / 1024).toFixed(2),
  );

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
              <div className="h-40 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600"></div>

              <div className="p-8">
                <div className="flex items-center gap-6 -mt-20">
                  {/* Avatar */}

                  <div className="relative">
                    {user?.profilePic ? (
                      <img
                        src={user.profilePic}
                        className="w-32 h-32 rounded-full border-4 border-[#0f172a]"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-indigo-600 flex items-center justify-center text-4xl border-4 border-[#0f172a]">
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
                      className="absolute bottom-2 right-2 bg-indigo-600 p-2 rounded-full cursor-pointer"
                    >
                      📷
                    </label>
                  </div>

                  <div className="mt-16">
                    <h2 className="text-3xl font-bold">{user?.name}</h2>

                    <p className="text-gray-400">{user?.email}</p>

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => {
                          console.log("Edit clicked");
                          setEditMode(true);
                        }}
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
                    {editMode && (
                      <div className="bg-[#0f172a]/80 p-6 rounded-2xl">
                        <input
                          className="w-full p-3 bg-black border rounded-xl mb-3"
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
                          className="bg-green-600 px-5 py-2 rounded-xl"
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#0f172a]/80 p-6 rounded-2xl">
                <h3 className="text-gray-400">Total Files</h3>

                <p className="text-4xl font-bold text-indigo-400">
                  {totalFiles}
                </p>
              </div>

              <div className="bg-[#0f172a]/80 p-6 rounded-2xl">
                <h3 className="text-gray-400">Storage Used</h3>

                <p className="text-4xl font-bold text-green-400">
                  {totalSize} MB
                </p>
              </div>

              <div className="bg-[#0f172a]/80 p-6 rounded-2xl">
                <h3 className="text-gray-400">Security Score</h3>

                <p className="text-4xl font-bold text-yellow-400">95%</p>
              </div>
            </div>

            {/* Security Card */}

            <div className="bg-[#0f172a]/80 p-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-4">🔐 SecureX Protection</h2>

              <div className="space-y-3 text-gray-300">
                <p>✅ AES File Encryption</p>

                <p>✅ JWT Authentication</p>

                <p>✅ Cloudinary Secure Storage</p>

                <p>✅ Protected File Access</p>
              </div>
            </div>

            {/* Edit */}
          </div>
        )}

        {active === "stats" && (
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h2 className="text-3xl text-indigo-400 font-bold">
                📊 Storage Analytics
              </h2>
              <p className="text-gray-400 mt-2">
                Monitor your files, storage usage and security status
              </p>
            </div>

            {/* Overview Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <StatCard
                title="Total Files"
                value={totalFiles}
                color="text-indigo-400"
              />

              <StatCard
                title="Storage Used"
                value={`${totalSize} MB`}
                color="text-green-400"
              />

              <StatCard
                title="Images"
                value={imageCount}
                color="text-blue-400"
              />

              <StatCard
                title="Documents"
                value={pdfCount}
                color="text-yellow-400"
              />
            </div>

            {/* Storage Progress */}
            <div className="bg-[#0f172a]/80 p-6 rounded-2xl">
              <div className="flex justify-between mb-3">
                <h3 className="text-xl font-semibold">☁ Cloud Storage</h3>

                <span>{storageUsedPercent}%</span>
              </div>

              <div className="w-full bg-gray-700 h-4 rounded-full">
                <div
                  className="bg-indigo-500 h-4 rounded-full"
                  style={{
                    width: `${storageUsedPercent}%`,
                  }}
                />
              </div>

              <p className="text-gray-400 mt-3">
                {totalSize} MB used of 1024 MB
              </p>
            </div>

            {/* Charts Section */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Pie Chart */}

              <div className="bg-[#0f172a]/80 p-6 rounded-2xl">
                <h3 className="text-xl mb-5">📁 File Distribution</h3>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" outerRadius={100} label>
                      {pieData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index]} />
                      ))}
                    </Pie>

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart */}

              <div className="bg-[#0f172a]/80 p-6  rounded-2xl">
                <h3 className="text-xl mb-5">📈 File Statistics</h3>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="name" />

                    <YAxis />

                    <Tooltip />

                    <Bar dataKey="value" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Security Analytics */}

            <div className="bg-[#0f172a]/80 p-6 rounded-2xl">
              <h3 className="text-xl font-bold mb-6">🔐 Security Analytics</h3>

              <div className="grid md:grid-cols-3 gap-6">
                <SecurityCard title="Encrypted Files" value={totalFiles} />

                <SecurityCard title="Encryption" value="AES-256" />

                <SecurityCard title="Access Control" value="JWT" />
              </div>
            </div>

            {/* Largest Files */}

            <div className="bg-[#0f172a]/80 p-6 rounded-2xl">
              <h3 className="text-xl font-bold mb-5">📁 Largest Files</h3>

              {[...files]
                .sort((a, b) => b.size - a.size)
                .slice(0, 5)
                .map((file) => (
                  <div
                    key={file._id}
                    className="flex justify-between border-b border-white/10 py-3"
                  >
                    <span>{file.fileName}</span>

                    <span className="text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
        {active === "security" && (
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold text-indigo-400">
                🔐 Security Center
              </h2>

              <p className="text-gray-400 mt-2">
                Manage your account security and protection settings
              </p>
            </div>

            {/* Security Score */}

            <div className="bg-[#0f172a]/80 p-6 rounded-3xl  border border-white/10">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">Security Score</h3>

                  <p className="text-gray-400">Your account protection level</p>
                </div>

                <div className="w-24 h-24  rounded-full bg-green-500/20  flex items-center justify-center border-4 border-green-500">
                  <span className="text-3xl font-bold text-green-400">95%</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between">
                  <span>🔒 AES-256 Encryption</span>

                  <span className="text-green-400">Active</span>
                </div>

                <div className="flex justify-between">
                  <span>🔑 JWT Authentication</span>

                  <span className="text-green-400">Active</span>
                </div>

                <div className="flex justify-between">
                  <span>☁ Cloudinary Storage</span>

                  <span className="text-green-400">Protected</span>
                </div>
              </div>
            </div>

            {/* Change Password */}

            <div className="bg-[#0f172a]/80 p-6 rounded-3xl border border-white/10">
              <h3 className="text-xl font-bold mb-5">🔑 Change Password</h3>

              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="Current Password"
                  className="w-full p-3 bg-black border border-white/10 rounded-xl"
                />

                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full p-3 bg-black border border-white/10 rounded-xl"
                />

                <input
                  type="password"
                  placeholder="Confirm New Password"
                  className="w-full p-3 bg-black border border-white/10 rounded-xl"
                />

                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition">
                  Update Password
                </button>
              </div>
            </div>

            {/* Two Factor Authentication */}

            <div className="bg-[#0f172a]/80 p-6 rounded-3xl border border-white/10">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">
                    📱 Two Factor Authentication
                  </h3>

                  <p className="text-gray-400">
                    Add extra protection to your account
                  </p>
                </div>

                <button className="bg-green-600 px-5 py-2 rounded-xl">
                  Enable
                </button>
              </div>
            </div>

            {/* Active Sessions */}

            <div className="bg-[#0f172a]/80 p-6 rounded-3xl border border-white/10">
              <h3 className="text-xl font-bold mb-5">🌍 Active Sessions</h3>

              <div className="flex justify-between items-center bg-black/30 p-4 rounded-xl">
                <div>
                  <p>💻 Windows Chrome</p>

                  <span className="text-gray-400 text-sm">Current Session</span>
                </div>

                <span className="text-green-400">Online</span>
              </div>
            </div>

            {/* Danger Zone */}

            <div className="bg-red-950/30  border border-red-500/30 p-6 rounded-3xl">
              <h3 className="text-xl font-bold text-red-400">⚠ Danger Zone</h3>

              <p className="text-gray-400 mt-2">
                Logout from all devices and revoke sessions
              </p>

              <button className=" mt-5 bg-red-600 px-6  py-3 rounded-xl hover:bg-red-700">
                Logout All Devices
              </button>
            </div>
          </div>
        )}
        {active === "activity" && (
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold text-indigo-400">
                📜 Activity Center
              </h2>

              <p className="text-gray-400 mt-2">
                Track your recent file activities and security events
              </p>
            </div>

            {/* Activity Overview */}
            <div className="grid md:grid-cols-4 gap-6">
              <StatCard
                title="Total Uploads"
                value={totalFiles}
                color="text-indigo-400"
              />

              <StatCard
                title="Encrypted Files"
                value={totalFiles}
                color="text-green-400"
              />

              <StatCard
                title="Storage Used"
                value={`${totalSize} MB`}
                color="text-yellow-400"
              />

              <StatCard
                title="Security"
                value="Protected"
                color="text-blue-400"
              />
            </div>

            {/* Timeline */}
            <div className="bg-[#0f172a]/80 p-6 rounded-3xl border border-white/10">
              <h3 className="text-xl font-bold mb-6">🕒 Recent Activities</h3>

              <div className="space-y-5">
                {files.slice(0, 8).map((file, index) => (
                  <div
                    key={file._id || index}
                    className="
              flex
              items-center
              justify-between
              bg-black/30
              p-4
              rounded-xl
              border
              border-white/5
              hover:bg-white/5
              transition
            "
                  >
                    {/* Left Section */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center  justify-center text-2xl">
                        {file.fileName.match(/\.(jpg|png|jpeg)$/i)
                          ? "🖼️"
                          : file.fileName.match(/\.pdf$/i)
                            ? "📄"
                            : file.fileName.match(/\.(mp4|mkv)$/i)
                              ? "🎥"
                              : "📁"}
                      </div>

                      <div>
                        <h4 className="font-semibold">{file.fileName}</h4>

                        <p className="text-gray-400 text-sm">
                          Uploaded recently • {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="text-right">
                      <p className="text-green-400">🔐 Encrypted</p>

                      <p className="text-gray-400 text-sm">☁ Cloud Storage</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Logs */}
            <div className="bg-[#0f172a]/80 p-6 rounded-3xl border border-white/10">
              <h3 className="text-xl font-bold mb-5">🔐 Security Logs</h3>

              <div className="space-y-4">
                <div className="flex justify-between p-4 bg-black/30 rounded-xl">
                  <span>🔑 User Login</span>

                  <span className="text-green-400">Successful</span>
                </div>

                <div className="flex justify-between p-4 bg-black/30 rounded-xl">
                  <span>🛡 File Encryption</span>

                  <span className="text-green-400">AES-256</span>
                </div>

                <div className="flex justify-between p-4 bg-black/30 rounded-xl">
                  <span>☁ Cloud Upload</span>

                  <span className="text-blue-400">Cloudinary</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
