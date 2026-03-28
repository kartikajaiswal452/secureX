import React from "react";
import { useState } from "react";
import bgimage1 from "../assets/Image/zulfugar-karimov-2_rlRMukZO4-unsplash.jpg";
const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleregister = async (e) => {
    e.preventDefault();
    const res = await fetch(
      "https://mern-project-4-ihvs.onrender.com/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      },
    );

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div
      className="h-screen w-full flex items-center justify-center bg-cover bg-no-repeat bg-center"
      style={{
        backgroundImage: `url(${bgimage1})`,
        backgroundAttachment: "fixed",
      }}
    >
      <form
        className="w-80 bg-white rounded-xl mt-10 shadow-lg p-6 hover:bg-gray-300"
        onSubmit={handleregister}
      >
        <h1 className="font-bold text-xl text-center mb-4 hover:text-blue-500">
          Register
        </h1>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          className="w-full mb-2 p-2 text-center border-2 rounded-xl hover:border-blue-500 "
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          className="w-full text-center p-2 border-2 rounded-xl hover:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-center w-full mt-3  rounded-xl p-2 hover:bg-blue-300 "
        >
          Register
        </button>
      </form>
    </div>
  );
};
export default Register;
