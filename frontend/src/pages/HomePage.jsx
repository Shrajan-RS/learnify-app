import React, { useState, useRef, useEffect } from "react";
import useCurrentUser from "../hooks/useCurrentUser";
import { ClimbingBoxLoader } from "react-spinners";
import { RiChatSearchFill } from "react-icons/ri";
import { MdLogout } from "react-icons/md";
import axios from "axios";
import { baseServerURI, userProfileURI } from "../App";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { IoAddOutline } from "react-icons/io5";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";

import { IoMdClose } from "react-icons/io";
import { FaClipboard } from "react-icons/fa";
import { FaClipboardCheck } from "react-icons/fa";
import { customNotification, failedNotification } from "../utils/notification";

const HomePage = () => {
  const { isLoading, userData } = useCurrentUser();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { getCurrentUser } = useUser();
  const userNavigation = useNavigate();
  const textareaRef = useRef(null);
  const [input, setInput] = useState("");
  const [isSendDisabled, setIsSendDisabled] = useState(true);

  const [selectedOption, setSelectedOption] = useState("flashcard");

  let flashcardData = [];

  const [loading, setLoading] = useState(false);

  const [geminiResponse, setGeminiResponse] = useState("");

  const [responseCard, setResponseCard] = useState(true);

  const [title, setTitle] = useState("");

  useEffect(() => {
    const getWordLength = () => {
      const wordLength = input.trim().length;

      if (wordLength > 1500) {
        setIsSendDisabled(false);
      } else {
        setIsSendDisabled(true);
      }
    };

    getWordLength();
  }, [input]);

  const handleInput = (e) => {
    setInput(e.target.value);

    const textarea = textareaRef.current;
    textarea.style.height = "auto";

    const maxHeight = 400;
    const newHeight = textarea.scrollHeight;

    if (newHeight <= maxHeight) {
      textarea.style.height = `${newHeight}px`;
      textarea.style.overflowY = "hidden";
    } else {
      textarea.style.height = `${maxHeight}px`;
      textarea.style.overflowY = "auto";
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${baseServerURI}/logout`, null, {
        withCredentials: true,
      });
      await getCurrentUser();
      userNavigation("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseResponse = () => {
    setResponseCard(false);
  };

  const handleCopyClipBoard = () => {
    if (selectedOption === "flashcard") {
      // Convert Q/A array to plain text
      const textToCopy = flashcardData
        .map((item) => `Q: ${item.Q}\nA: ${item.A}`)
        .join("\n\n");

      navigator.clipboard.writeText(textToCopy);

      customNotification({
        icon: <FaClipboardCheck />,
        message: "Copied to clipboard!",
      });
    } else if (selectedOption === "summarize") {
      navigator.clipboard.writeText(geminiResponse);
      customNotification({
        icon: <FaClipboardCheck />,
        message: "Copied to clipboard!",
      });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      content: input,
      option: selectedOption,
    };

    console.log(formData);

    if (formData.option === "summarize") {
      try {
        setLoading(true);
        setInput("");

        const serverResponse = await axios.post(
          `${userProfileURI}/summary`,
          formData,
          { withCredentials: true }
        );

        setTitle(serverResponse.data?.data[0]?.userPromptTitle);
        setGeminiResponse(serverResponse.data?.data[0]?.aiResponse);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        setResponseCard(true);
      }
    } else if (formData.option === "flashcard") {
      try {
        setLoading(true);
        setInput("");

        const serverResponse = await axios.post(
          `${userProfileURI}/flashcard`,
          formData,
          { withCredentials: true }
        );

        console.log(serverResponse);
        setGeminiResponse(serverResponse?.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        setResponseCard(true);
      }
    }
  };

  return (
    <section className="min-h-screen w-full">
      {isLoading || loading ? (
        <div className="min-h-screen min-w-full flex justify-center items-center bg-black/90 ">
          <ClimbingBoxLoader size={40} color="white" />
        </div>
      ) : responseCard ? (
        <div className="min-h-screen min-w-full bg-black/90 flex justify-center items-start p-2">
          <div className="text-white bg-white/10 w-[90vw] sm:w-[80vw] md:w-[80vw] lg:w-[80vw] xl:w-[80vw] py-6 px-4 flex flex-col gap-3.5 rounded-lg items-center shadow-gray-400/10 shadow-md mt-24 max-h-fit justify-center">
            <div className="w-full px-2 flex justify-end gap-4 items-center flex-col sm:flex-row">
              <FaClipboard
                size={40}
                className="cursor-pointer hover:bg-white/5 transition-all duration-200 p-2 rounded-lg"
                onClick={handleCopyClipBoard}
              />
              <IoMdClose
                size={40}
                className="cursor-pointer hover:bg-white/5 transition-all duration-200 p-1 rounded-lg"
                onClick={handleCloseResponse}
              />
            </div>
            {selectedOption === "summarize" && (
              <p className="font-semibold text-2xl text-center">
                {selectedOption === "summarize" && title != ""
                  ? `Summary of ${title}`
                  : "Summary"}
              </p>
            )}

            {selectedOption === "flashcard" && (
              <p className="font-semibold text-2xl text-center">
                {selectedOption === "flashcard" && "Flashcard"}
              </p>
            )}
            <div className="w-[90%] h-[1px] bg-white/30"></div>
            <div
              className={`w-full px-6 text-[18px] ${
                selectedOption === "flashcard" &&
                "flex justify-center items-center flex-col"
              }`}
            >
              {selectedOption === "summarize" && (
                <ul className="list-disc space-y-5 px-8">
                  {geminiResponse
                    .split("*")
                    .filter((point) => point.trim() !== "")
                    .map((point, index) => {
                      return (
                        <li className="text-[18px]" key={index}>
                          {point}
                        </li>
                      );
                    })}
                </ul>
              )}

              {selectedOption === "flashcard" &&
                (() => {
                  try {
                    const cleanResponse = geminiResponse
                      .replace(/```json|```/g, "")
                      .trim();

                    flashcardData =
                      typeof cleanResponse === "string"
                        ? JSON.parse(cleanResponse)
                        : cleanResponse;
                  } catch (err) {
                    console.error("JSON parse error:", err);
                    return <p className="text-white">Invalid JSON format</p>;
                  }

                  console.log(flashcardData);

                  return flashcardData.map((item, index) => (
                    <div
                      key={index}
                      className="w-11/12 p-5 border-b mb-10 border-white/70"
                    >
                      <p>
                        <strong>Q:</strong> {item.Q}
                      </p>
                      <p>
                        <strong>A:</strong> {item.A}
                      </p>
                    </div>
                  ));
                })()}
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen min-w-full bg-black/90 relative flex justify-end items-start">
          <div
            className={`h-screen border-r-2 border-white/5 sm:flex justify-between flex-col text-white absolute top-0 left-0 px-6 py-5 hidden z-50`}
          >
            <div className="w-full flex flex-col justify-center items-center gap-8 py-1">
              <div className="h-[40px] w-[40px] rounded-[50%] overflow-hidden">
                <a href="/">
                  <img
                    src="/img/logo.png"
                    alt="logo"
                    className="h-full w-full"
                  />
                </a>
              </div>
              <div className="w-full flex justify-center items-center">
                <button
                  title="Previous Chats"
                  className="cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                >
                  <RiChatSearchFill size={25} />
                </button>
              </div>
            </div>

            <div className="w-full flex justify-center items-center mb-4">
              <button
                title="Logout"
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200 cursor-pointer"
              >
                <MdLogout size={25} />
              </button>
            </div>
          </div>

          <div className="min-h-screen min-w-full relative p-3 ">
            <div className="sm:hidden">
              <button onClick={() => setIsNavOpen((prev) => !prev)}>
                <HiOutlineMenuAlt2 size={30} color="white" />
              </button>
            </div>

            {isNavOpen && (
              <div className="bg-[#242424] h-[180px] w-[150px] absolute top-0 left-0 rounded-tr-lg rounded-br-lg sm:hidden flex justify-between items-center flex-col overflow-hidden text-white p-2 gap-3">
                <div className="flex w-full justify-end p-2">
                  <button onClick={() => setIsNavOpen((prev) => !prev)}>
                    <IoClose size={30} />
                  </button>
                </div>

                <div className="w-full flex flex-col gap-3">
                  <div className="w-full flex justify-center items-center">
                    <button
                      title="Previous Chats"
                      className="cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                    >
                      <RiChatSearchFill size={25} />
                    </button>
                  </div>

                  <div className="w-full flex justify-center items-center mb-4">
                    <button
                      title="Logout"
                      onClick={handleLogout}
                      className="cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                    >
                      <MdLogout size={25} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="w-full min-h-[97vh]  flex flex-col items-center gap-12 text-white">
              <h1 className="text-3xl mt-[250px] text-center">
                How can I help, {userData?.name?.toUpperCase() || ""}?
              </h1>

              <form className="bg-white/5 w-[90vw] sm:w-[60vw] md:w-[60vw]  lg:w-[50vw] xl:w-[40vw] py-6 px-4 flex flex-col gap-3 rounded-4xl items-center shadow-gray-400/10 shadow-md">
                <div className="flex gap-2 items-center justify-center w-full">
                  <div className="hover:bg-white/5 p-2 h-[45px] w-[45px] rounded-4xl flex justify-center items-center cursor-pointer">
                    <IoAddOutline size={28} />
                  </div>

                  <div className="flex-1 flex items-center">
                    <textarea
                      ref={textareaRef}
                      rows={1}
                      value={input}
                      onInput={handleInput}
                      placeholder="Ask Anything..."
                      className="w-full resize-none overflow-hidden text-[15px] bg-transparent outline-0 text-white placeholder:text-white/70 transition-all duration-200 max-h-[260px]"
                    />
                  </div>

                  <div
                    className={
                      isSendDisabled
                        ? "p-2 rounded-4xl flex h-[45px] w-[45px] justify-center items-center cursor-no-drop"
                        : "hover:bg-white/5 p-2 h-[45px] w-[45px] rounded-4xl flex justify-center items-center cursor-pointer"
                    }
                  >
                    <button
                      type="submit"
                      disabled={isSendDisabled}
                      onClick={handleFormSubmit}
                      className={
                        isSendDisabled
                          ? "cursor-no-drop text-white/50"
                          : "cursor-pointer text-white"
                      }
                    >
                      <IoIosSend size={28} />
                    </button>
                  </div>
                </div>

                <div className="h-[1px] w-[90%] bg-white/50 mb-2"></div>

                <div className="w-full flex flex-wrap justify-center items-center gap-4 sm:gap-8 mt-2 px-4">
                  {["summarize", "flashcard", "quiz"].map((option) => (
                    <div
                      key={option}
                      className="flex px-4 py-1 rounded-md transition-all duration-200"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedOption(option)}
                        className={`h-full w-full text-white px-2 py-1 rounded-md capitalize cursor-pointer transition-all duration-200 
          ${selectedOption === option ? "bg-white/10" : "hover:bg-white/10"}`}
                      >
                        {option}
                      </button>
                    </div>
                  ))}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HomePage;
