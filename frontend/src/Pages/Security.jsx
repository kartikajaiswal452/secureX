import React from "react";
import { MdOutlineSecurity } from "react-icons/md";
import { FaLock, FaShieldAlt, FaUserShield } from "react-icons/fa";
import encryption from "../assets/Image/encryption.jpg";
import security2 from "../assets/Image/security2.jpg";

const Security = () => {
  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">
      <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
        <div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent mb-6">
            Advanced Security System 🔐
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed">
            Your files are protected with military-grade encryption and secure
            cloud architecture. We ensure privacy, integrity, and full control
            over your data.
          </p>

          <div className="flex gap-4 mt-8">
            <div className="bg-indigo-500/10 px-4 py-2 rounded-full text-indigo-400 text-sm border border-indigo-500/20">
              AES-256 Encryption
            </div>

            <div className="bg-green-500/10 px-4 py-2 rounded-full text-green-400 text-sm border border-green-500/20">
              End-to-End Secure
            </div>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
          <img
            src={encryption}
            alt="encryption"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <div className="group bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:scale-105 transition">
          <FaLock className="text-3xl text-indigo-400 mb-4" />
          <h2 className="text-xl font-bold mb-2">Encryption</h2>
          <p className="text-gray-400 text-sm">
            Files are encrypted before upload using AES-256 standard.
          </p>
        </div>

        <div className="group bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:scale-105 transition">
          <FaShieldAlt className="text-3xl text-green-400 mb-4" />
          <h2 className="text-xl font-bold mb-2">Secure Storage</h2>
          <p className="text-gray-400 text-sm">
            Stored safely in cloud infrastructure with zero access policy.
          </p>
        </div>

        <div className="group bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:scale-105 transition">
          <FaUserShield className="text-3xl text-purple-400 mb-4" />
          <h2 className="text-xl font-bold mb-2">User Privacy</h2>
          <p className="text-gray-400 text-sm">
            Only you can access your files using your encryption password.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
          <img
            src={security2}
            alt="security"
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <h2 className="text-4xl font-bold mb-6 flex items-center gap-3">
            <MdOutlineSecurity className="text-indigo-400" />
            How Your Data is Protected
          </h2>

          <ul className="space-y-4 text-gray-400">
            <li>🔐 End-to-End Encryption before upload</li>
            <li>☁️ Secure Cloud Storage (Cloudinary)</li>
            <li>🔑 Password-protected file access</li>
            <li>🚫 Zero-knowledge architecture</li>
            <li>⚡ Fast & secure file retrieval</li>
          </ul>

          <div className="mt-8 bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/20 rounded-3xl p-6 backdrop-blur-xl">
            <p className="text-gray-400">Security Status</p>
            <h2 className="text-xl font-bold mt-2 text-green-400">
              Fully Protected ✅
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
