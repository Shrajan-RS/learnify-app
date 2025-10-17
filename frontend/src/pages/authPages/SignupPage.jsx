import React from "react";
import { IoPersonSharp } from "react-icons/io5";
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";

import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";

function SignupPage() {
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

              <div className="flex items-center bg-gray-500/20 pl-3 py-1 rounded-md">
                <div className="w-6">
                  <RiLockPasswordFill className="text-white" />
                </div>
                <div className="w-full px-2 py-1">
                  <input
                    type="text"
                    placeholder="Password"
                    className="w-full outline-0"
                  />
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
              >
                Sign Up
              </button>
            </div>
          </div>

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
            >
              <span>
                <FcGoogle size={25} />
              </span>
              Google
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignupPage;
