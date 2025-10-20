import React, { useState } from "react";
import { IoPersonSharp } from "react-icons/io5";
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";

import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";

import axios from "axios";
import { baseServerURI } from "../../App";

import auth from "../../../../backend/src/services/firebaseAuth.js";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useEffect } from "react";

function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ message: "" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const serverResponse = await axios.post(
        `${baseServerURI}/signup`,
        formData,
        {
          withCredentials: true,
        }
      );

      console.log(serverResponse.response);
    } catch (error) {
      setErrorMessage({
        message: error.response?.data?.message || "Something Went Wrong!",
      });
    }
  };

  const handleGoogleSignUp = async () => {
    const googleProvider = new GoogleAuthProvider();

    const googleResponse = await signInWithPopup(auth, googleProvider);

    const user = {
      name: googleResponse.user.displayName,
      email: googleResponse.user.email,
    };

    const serverResponse = await axios.post(
      `${baseServerURI}/google-signup`,
      user,
      { withCredentials: true }
    );
  };

  useEffect(() => {
    if (!errorMessage) return; // no need to set timeout if no error

    const timer = setTimeout(() => {
      setErrorMessage("");
    }, 1500);

    // Cleanup function
    return () => clearTimeout(timer);
  }, [errorMessage]);

  return (
    <section className="bg-[#0A0C10] min-h-screen flex justify-center items-center p-5 sm:p-6 md:p-8">
      <div
        className="
        bg-[#181A26]/50
        w-full
        max-w-[330px] sm:max-w-[340px] md:max-w-[340px] lg:max-w-[400px]
        min-h-[520px] sm:min-h-[520px] md:min-h-[520px]
        rounded-2xl
        shadow-lg
        shadow-white/5
        p-5 
        overflow-hidden
        flex 
        border border-white/5
      "
      >
        <div className="w-full flex items-center justify-between flex-col">
          <form className="w-full" onSubmit={handleFormSubmit}>
            <div className="w-full">
              <h1 className="flex gap-3 items-center justify-center my-2 mb-5 text-3xl text-white font-semibold">
                Sign Up
              </h1>

              <div className="h-[1px] bg-white w-full my-2"></div>

              <div className="w-full p-2.5 text-white flex gap-2 flex-col font-medium">
                <label htmlFor="name" className="capitalize ">
                  full name
                </label>

                <div className="flex items-center bg-gray-500/20 pl-3 py-1 rounded-md">
                  <div className="w-6">
                    <IoPersonSharp className="text-white" size={15} />
                  </div>
                  <div className="w-full px-2 py-1">
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      type="text"
                      placeholder="Full Name"
                      className="w-full outline-0"
                      id="name"
                    />
                  </div>
                </div>
              </div>

              <div className="w-full p-2.5 text-white flex gap-2 flex-col font-medium">
                <label htmlFor="email" className="capitalize ">
                  Email
                </label>

                <div className="flex items-center bg-gray-500/20 pl-3 py-1 rounded-md">
                  <div className="w-6">
                    <MdOutlineMail className="text-white" size={15} />
                  </div>
                  <div className="w-full px-2 py-1">
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="text"
                      placeholder="Email"
                      id="email"
                      className="w-full outline-0"
                    />
                  </div>
                </div>
              </div>

              <div className="w-full p-2.5 text-white flex gap-2 flex-col font-medium">
                <label htmlFor="password" className="capitalize ">
                  password
                </label>

                <div className="flex items-center justify-center bg-gray-500/20 pl-3 py-1 rounded-md">
                  <div className="w-6">
                    <RiLockPasswordFill className="text-white" />
                  </div>
                  <div className="w-full px-2 py-1">
                    <input
                      value={formData.password}
                      onChange={handleChange}
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="w-full outline-0"
                    />
                  </div>
                  <div className="mx-3 flex items-center justify-center">
                    <button
                      className="cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <button
                  className="
   w-full 
    px-5 
    py-1.5 
    bg-purple-700
    my-4
    rounded-md 
    text-xl 
    font-semibold 
    text-white 
    cursor-pointer
    transition-all 
    duration-300 
    flex items-center
    justify-center gap-2
    capitalize
    hover:bg-purple-700/60
  "
                  type="submit"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </form>

          <div className="w-full text-white flex justify-between items-center px-2 gap-2">
            <div className="bg-white border-[1px] w-1/2"></div>
            <div className="">OR</div>
            <div className="bg-white border-[1px] w-1/2"></div>
          </div>
          <div className="w-full px-2">
            <button
              className="
      w-full 
    px-5 
    py-1.5 
    bg-black
    my-4
    rounded-md 
    text-xl 
    font-semibold 
    text-white 
    cursor-pointer
    transition-all 
    duration-300 
    flex items-center
    justify-center gap-2
    capitalize
    hover:bg-white/5
  "
              onClick={handleGoogleSignUp}
            >
              <span>
                <FcGoogle size={25} />
              </span>
              Google
            </button>
          </div>
          {errorMessage && (
            <p className="text-xl text-red-600 transition-all duration-200 ease-in">
              {errorMessage.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default SignupPage;
