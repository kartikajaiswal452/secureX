import React, { useState, useEffect } from "react";
import { FaBars, FaUser, FaChartPie, FaLock, FaHistory } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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

      if (!storedUser || storedUser === "undefined") {
        return null;
      }

      return JSON.parse(storedUser);
    } catch (err) {
      console.log("User parse error:", err);

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
    fetch("https://mern-project-4-ihvs.onrender.com/api/files", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFiles(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
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

  const largestFile =
    files.length > 0
      ? files.reduce((max, file) => (file.size > max.size ? file : max))
      : null;

  const storageLimit = 1024;

  const storageUsedPercent = ((totalSize / storageLimit) * 100).toFixed(1);

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        "https://mern-project-4-ihvs.onrender.com/api/users/upload-profile",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await res.json();

      localStorage.setItem("user", JSON.stringify(data));

      setUser(data);

      alert("Profile Updated ✅");
    } catch (err) {
      console.error(err);
      alert("Upload failed ❌");
    }
  };

  const handleProfileSave = async () => {
    try {
      const res = await fetch(
        "https://mern-project-4-ihvs.onrender.com/api/users/update-profile",
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

      if (!res.ok) {
        alert(data.message || "Update failed ❌");
        return;
      }

      setUser(data);

      localStorage.setItem("user", JSON.stringify(data));

      setProfileData({
        name: data.name || "",
        bio: data.bio || "",
        phone: data.phone || "",
        location: data.location || "",
      });

      alert("Profile Updated Successfully ✅");

      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Server Error ❌");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-3xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#08142c] p-6 transition-transform duration-300 z-50
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <h2 className="text-2xl font-bold mb-8">Secure Storage</h2>

        <p
          onClick={() => {
            setActive("profile");
            setOpen(false);
          }}
          className={`cursor-pointer mb-5 flex items-center gap-3 p-3 rounded-xl transition
          ${
            active === "profile"
              ? "bg-indigo-600 text-white"
              : "hover:text-indigo-400"
          }`}
        >
          <FaUser />
          Account
        </p>

        <p
          onClick={() => {
            setActive("stats");
            setOpen(false);
          }}
          className={`cursor-pointer mb-5 flex items-center gap-3 p-3 rounded-xl transition
          ${
            active === "stats"
              ? "bg-indigo-600 text-white"
              : "hover:text-indigo-400"
          }`}
        >
          <FaChartPie />
          Storage Analytics
        </p>

        <p
          onClick={() => {
            setActive("security");
            setOpen(false);
          }}
          className={`cursor-pointer mb-5 flex items-center gap-3 p-3 rounded-xl transition
          ${
            active === "security"
              ? "bg-indigo-600 text-white"
              : "hover:text-indigo-400"
          }`}
        >
          <FaLock />
          Security
        </p>

        <p
          onClick={() => {
            setActive("activity");
            setOpen(false);
          }}
          className={`cursor-pointer flex items-center gap-3 p-3 rounded-xl transition
          ${
            active === "activity"
              ? "bg-indigo-600 text-white"
              : "hover:text-indigo-400"
          }`}
        >
          <FaHistory />
          Activity
        </p>
      </div>

      <div className="flex-1 p-6 ml-0 md:ml-64">
        <button
          onClick={() => setOpen(!open)}
          className="text-2xl mb-6 md:hidden"
        >
          <FaBars />
        </button>

        {active === "profile" && (
          <div className="w-full min-h-[85vh] bg-gradient-to-br from-gray-950 via-gray-900 to-black rounded-3xl shadow-2xl border border-gray-800 p-8 md:p-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/20 blur-3xl rounded-full"></div>

            <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 blur-3xl rounded-full"></div>

            <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                  {user?.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt="profile"
                      className="w-40 h-40 rounded-full object-cover border-4 border-indigo-500 shadow-2xl"
                    />
                  ) : (
                    <div className="w-40 h-40 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-6xl font-bold shadow-2xl">
                      {user?.email?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <label className="absolute bottom-2 right-2 bg-indigo-600 hover:bg-indigo-700 p-3 rounded-full cursor-pointer shadow-lg transition duration-300 hover:scale-110">
                    📷
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleProfileUpload}
                    />
                  </label>
                </div>

                <div>
                  <h2 className="text-5xl font-bold text-white tracking-wide">
                    {user?.name || "User"}
                  </h2>

                  <p className="text-gray-400 text-lg mt-3">{user?.email}</p>

                  <div className="flex gap-4 mt-8 flex-wrap">
                    <button
                      onClick={() => setEditMode(!editMode)}
                      className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl transition duration-300 font-semibold shadow-lg"
                    >
                      {editMode ? "Cancel" : "Edit Profile"}
                    </button>

                    <button
                      onClick={() => navigate("/dashboard")}
                      className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl transition duration-300 font-semibold shadow-lg"
                    >
                      Upload File
                    </button>

                    <button
                      onClick={handleLogout}
                      className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl transition duration-300 font-semibold shadow-lg"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 w-full lg:w-[420px]">
                <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700">
                  <p className="text-gray-400 text-sm">Total Files</p>

                  <h3 className="text-4xl font-bold mt-2">{totalFiles}</h3>
                </div>

                <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700">
                  <p className="text-gray-400 text-sm">Storage Used</p>

                  <h3 className="text-4xl font-bold mt-2 text-indigo-400">
                    {totalSize} MB
                  </h3>
                </div>

                <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700">
                  <p className="text-gray-400 text-sm">Images</p>

                  <h3 className="text-4xl font-bold mt-2 text-pink-400">
                    {imageCount}
                  </h3>
                </div>

                <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700">
                  <p className="text-gray-400 text-sm">PDFs</p>

                  <h3 className="text-4xl font-bold mt-2 text-red-400">
                    {pdfCount}
                  </h3>
                </div>
              </div>
            </div>

            {editMode && (
              <div className="mt-10 bg-gray-900/70 border border-gray-700 p-6 rounded-2xl w-full max-w-2xl">
                <h3 className="text-2xl font-semibold mb-6">Edit Profile</h3>

                <div className="grid gap-5">
                  <input
                    type="text"
                    placeholder="Name"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        name: e.target.value,
                      })
                    }
                    className="bg-black border border-gray-700 p-4 rounded-xl"
                  />

                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        phone: e.target.value,
                      })
                    }
                    className="bg-black border border-gray-700 p-4 rounded-xl"
                  />

                  <input
                    type="text"
                    placeholder="Location"
                    value={profileData.location}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        location: e.target.value,
                      })
                    }
                    className="bg-black border border-gray-700 p-4 rounded-xl"
                  />

                  <textarea
                    placeholder="Bio"
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        bio: e.target.value,
                      })
                    }
                    className="bg-black border border-gray-700 p-4 rounded-xl h-32"
                  />

                  <button
                    onClick={handleProfileSave}
                    className="bg-green-500 hover:bg-green-600 py-4 rounded-xl font-semibold text-lg transition"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {active === "stats" && (
          <div className="space-y-8">
            <h2 className="text-4xl font-bold">Storage Analytics 📊</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  label: "Total Files",
                  value: totalFiles,
                },
                {
                  label: "Storage Used",
                  value: `${totalSize} MB`,
                },
                {
                  label: "Images",
                  value: imageCount,
                },
                {
                  label: "PDF Files",
                  value: pdfCount,
                },
                {
                  label: "Videos",
                  value: videoCount,
                },
                {
                  label: "Other Files",
                  value: otherCount,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gray-900 border border-gray-800 p-6 rounded-3xl hover:scale-[1.02] transition"
                >
                  <p className="text-gray-400">{item.label}</p>

                  <h3 className="text-4xl font-bold mt-3">{item.value}</h3>
                </div>
              ))}
            </div>

            <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl">
              <div className="flex justify-between mb-3">
                <p className="text-gray-300">Storage Usage</p>

                <p className="text-indigo-400 font-bold">
                  {storageUsedPercent}%
                </p>
              </div>

              <div className="w-full bg-gray-800 rounded-full h-5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-5 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(storageUsedPercent, 100)}%`,
                  }}
                ></div>
              </div>

              <p className="mt-4 text-gray-400 text-sm">1 GB Total Storage</p>
            </div>

            {largestFile && (
              <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl">
                <p className="text-gray-400">Largest File</p>

                <h3 className="text-3xl font-bold mt-3">
                  {largestFile.fileName}
                </h3>

                <p className="text-indigo-400 mt-2 text-lg">
                  {(largestFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>
        )}

        {active === "security" && (
          <div className="max-w-5xl mx-auto p-6 space-y-8">
            <h2 className="text-4xl font-bold">Security Center 🔐</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl">
                <h3 className="text-2xl font-semibold mb-4">
                  Account Security
                </h3>

                <div className="space-y-3 text-gray-300">
                  <p>✅ JWT Authentication</p>
                  <p>✅ AES-256 Encryption</p>
                  <p>✅ Cloud Storage</p>
                  <p>✅ Secure Uploads</p>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl">
                <h3 className="text-2xl font-semibold mb-4">Quick Actions</h3>

                <div className="space-y-4">
                  <button
                    onClick={() => alert("Password change coming soon")}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl"
                  >
                    Change Password
                  </button>

                  <button
                    onClick={() => alert("2FA coming soon")}
                    className="w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-xl"
                  >
                    Enable 2FA
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl"
                  >
                    Logout All Devices
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {active === "activity" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-4xl font-bold">Recent Activity 📂</h2>

              <button
                onClick={() => window.location.reload()}
                className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-xl"
              >
                Refresh
              </button>
            </div>

            <div className="space-y-4">
              {files.slice(0, 10).map((file) => (
                <div
                  key={file._id}
                  className="bg-gray-900 p-5 rounded-2xl border border-gray-800"
                >
                  <p className="text-lg font-semibold">{file.fileName}</p>

                  <p className="text-gray-400 text-sm mt-1">
                    Uploaded on {new Date(file.createdAt).toLocaleString()}
                  </p>

                  <p className="text-indigo-400 mt-2">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
