import React, { useState } from "react";
import { useEffect } from "react";
import { baseServerURI } from "../../App";

import { IoPersonSharp } from "react-icons/io5";
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { HiOutlineMailOpen } from "react-icons/hi";
import { RiSendPlaneFill } from "react-icons/ri";
import { FaHome } from "react-icons/fa";
import { MdOutlineSignalWifiStatusbarConnectedNoInternet4 } from "react-icons/md";

import axios from "axios";
import { Link } from "react-router-dom";

import { googleAuth } from "../../services/firebaseAuth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import {
  customNotification,
  failedNotification,
  successNotification,
} from "../../utils/notification";

import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const userNavigation = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsDisabled(true);

      const serverResponse = await axios.post(
        `${baseServerURI}/login`,
        formData,
        {
          withCredentials: true,
        }
      );

      setFormData({ email: "", password: "" });

      successNotification({
        message: "Redirecting to Home",
        icon: <FaHome />,
      });

      setTimeout(() => {
        userNavigation("/");
      }, 2800);
    } catch (error) {
      const requestMessage = error.response?.data;

      setIsDisabled(false);

      const message =
        error.response?.data?.message ||
        "Something went wrong, Please Try Again Later!";

      message.includes("Unauthorized") &&
        failedNotification({ message, duration: 2800 });

      message.includes("User") &&
        failedNotification({ message, duration: 2800 });

      setErrorMessage(message);

      if (message.toString().includes("taken")) {
        customNotification(<HiOutlineMailOpen />, message);
      }

      if (message.includes("Requests"))
        failedNotification({ message, size: 50 });

      if (message.includes("authentication")) failedNotification({ message,size:50 });

      if (requestMessage.includes("Requests"))
        failedNotification({ message: requestMessage });
    } finally {
      setIsDisabled(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsDisabled(true);

      const googleProvider = new GoogleAuthProvider();
      const googleResponse = await signInWithPopup(googleAuth, googleProvider);
      const user = {
        email: googleResponse.user.email,
      };
      const serverResponse = await axios.post(
        `${baseServerURI}/google-login`,
        user,
        { withCredentials: true }
      );

      successNotification({
        message: "Redirecting to Home",
        icon: <FaHome />,
      });

      setTimeout(() => {
        userNavigation("/");
      }, 2500);
    } catch (error) {
      setIsDisabled(false);

      const message = error.response?.data?.message || "Something Went Wrong!";

      setErrorMessage(message);

      failedNotification({
        message,
        duration: 2800,
      });
    } finally {
      setIsDisabled(false);
    }
  };

  useEffect(() => {
    if (!errorMessage) return;

    const timer = setTimeout(() => {
      setErrorMessage("");
    }, 1500);

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
                Login
              </h1>

              <div className="h-[1px] bg-white w-full my-2"></div>

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
                {errorMessage.includes("Email") && (
                  <p className="text-red-500 mb-4 h-0.5 text-[12px] sm:text-[15px]">
                    {errorMessage}
                  </p>
                )}
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
                {errorMessage.includes("Password") && (
                  <p className="text-red-500 mb-4 h-0.5 text-[12px] sm:text-[15px]">
                    {errorMessage}
                  </p>
                )}
                <button
                  className={`
   w-full 
    px-5 
    py-1.5 
    ${
      isDisabled
        ? "bg-purple-700/10 cursor-no-drop"
        : "bg-purple-700 cursor-pointer hover:bg-purple-700/60"
    }
    my-4
    rounded-md 
    text-xl 
    font-semibold 
    text-white 
    transition-all 
    duration-300 
    flex items-center
    justify-center gap-2
    capitalize
  `}
                  type="submit"
                >
                  Login
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
              className={`
      w-full 
    px-5 
    py-1.5 
    ${
      isDisabled
        ? "bg-black/5 cursor-no-drop"
        : "bg-black hover:bg-white/5 cursor-pointer"
    }
    my-4
    rounded-md 
    text-xl 
    font-semibold 
    text-white 
    transition-all 
    duration-300 
    flex items-center
    justify-center gap-2
    capitalize
  `}
              onClick={handleGoogleSignUp}
            >
              <span>
                <FcGoogle size={25} />
              </span>
              Google
            </button>
          </div>
          <p className="text-[15px] text-gray-400 capitalize text-center">
            don't have an account?
            <Link
              className="text-[#9000ff] hover:underline hover:scale-50"
              to={"/signup"}
            >
              {" "}
              Signup
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
