import React, { useState } from "react";
import { useEffect } from "react";
import { baseServerURI } from "../../App";

import axios from "axios";
import { Link } from "react-router-dom";

import {
  customNotification,
  failedNotification,
  successNotification,
} from "../../utils/notification";

import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { useUser } from "../../context/UserContext";

function AuthPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [OTP, setOTP] = useState({ OTP: "" });
  const [time, setTime] = useState(30);
  const [disableResendOTP, setDisableResendOTP] = useState(false);

  const { getCurrentUser } = useUser();

  const userNavigation = useNavigate();

  useEffect(() => {
    if (!errorMessage) return;

    const timer = setTimeout(() => {
      setErrorMessage("");
    }, 1500);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const handleChange = (e) => {
    setOTP({ OTP: e.target.value });
  };

  useEffect(() => {
    if (time === 0) {
      setDisableResendOTP(false);
      setTime(10);
      return;
    }

    const interval = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    try {
      setIsDisabled(true);

      const serverResponse = await axios.post(`${baseServerURI}/verify`, OTP, {
        withCredentials: true,
      });

      await getCurrentUser();

      setTimeout(() => {
        userNavigation("/");
      }, 4500);
    } catch (error) {
      console.log(error);

      const message = error.response?.data?.message || "Something Went Wrong!";

      if (message.includes("Expired OTP!"))
        return failedNotification({ message: message });

      if (message.includes("OTP")) setErrorMessage(message);

      if (message.includes("User")) failedNotification({ message });

      failedNotification({ message: error.response?.data?.message });

      setIsDisabled(false);
    } finally {
      setIsDisabled(false);
    }
  };

  const handleResendOTP = async () => {
    setDisableResendOTP(true);
    try {
      const serverResponse = await axios.post(
        `${baseServerURI}/resend-otp`,
        null,
        { withCredentials: true }
      );

      successNotification({
        message: serverResponse.data?.message,
        duration: 2500,
      });
      setDisableResendOTP(false);
    } catch (error) {
      failedNotification({
        message: error.response?.data?.message || "Something Went Wrong!",
      });
      setDisableResendOTP(false);
    } finally {
      setDisableResendOTP(false);
    }
  };

  return (
    <section className="bg-[#0A0C10] min-h-screen flex justify-center items-center p-5 sm:p-6 md:p-8">
      <div
        className="
        bg-[#181A26]/50
        w-full
        max-w-[330px] sm:max-w-[340px] md:max-w-[340px] lg:max-w-[400px]
        min-h-[310px] sm:min-h-[310px] md:min-h-[310px]
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
          <form className="w-full">
            <div className="w-full">
              <h1 className="flex gap-3 items-center justify-center my-2 mb-5 text-3xl text-white font-semibold">
                Verify Your Email
              </h1>
              <div className="h-[1px] bg-white w-full my-2"></div>

              <div className="w-full p-2.5 text-white flex gap-2 flex-col font-medium">
                <label htmlFor="OTP" className="capitalize ">
                  OTP
                </label>

                <div className="flex items-center bg-gray-500/20 pl-3 py-1 rounded-md">
                  <div className="w-full px-2 py-1">
                    <input
                      name="OTP"
                      value={OTP.OTP}
                      onChange={handleChange}
                      type="text"
                      placeholder="Enter OTP"
                      className="w-full outline-0"
                      id="OTP"
                    />
                  </div>
                </div>
                {errorMessage && (
                  <p className="text-red-500 mb-4 h-0.5 text-[12px] sm:text-[15px]">
                    {errorMessage}
                  </p>
                )}
              </div>
              <div className="w-full text-right px-2">
                <Link
                  className={
                    disableResendOTP
                      ? "hover:cursor-no-drop text-gray-700 text-center"
                      : "hover:underline text-gray-400 text-center"
                  }
                  onClick={handleResendOTP}
                >
                  Resend OTP
                </Link>
                {disableResendOTP && (
                  <span className="text-gray-400 mx-2">{time}</span>
                )}
              </div>
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
                onClick={handleOTPVerification}
              >
                Verify
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default AuthPage;
