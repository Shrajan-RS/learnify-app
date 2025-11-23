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

import * as pdfjsLib from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

const HomePage = () => {
  const { isLoading, userData } = useCurrentUser();
  const { getCurrentUser } = useUser();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const userNavigation = useNavigate();
  const textareaRef = useRef(null);
  const [input, setInput] = useState("");
  const [isSendDisabled, setIsSendDisabled] = useState(true);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [selectedOption, setSelectedOption] = useState("summarize");
  const [selectedDifficulty, setSelectedDifficulty] = useState("easy");

  let flashcardData = [];

  const [loading, setLoading] = useState(false);

  const [geminiResponse, setGeminiResponse] = useState("");

  const [responseCard, setResponseCard] = useState(false);

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

  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const extractPdfText = async (file) => {
    const url = URL.createObjectURL(file);
    const pdf = await pdfjsLib.getDocument(url).promise;

    let extractedText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      extractedText += content.items.map((item) => item.str).join(" ") + "\n\n";
    }

    return extractedText;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));

    // Allow sending once a file is chosen
    setIsSendDisabled(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let finalText = input;

    // ⬇️ If a PDF was uploaded, extract text now (NOT during selection)
    if (selectedFile && selectedFile.type === "application/pdf") {
      try {
        finalText = await extractPdfText(selectedFile);
      } catch (err) {
        console.error("PDF extraction failed:", err);
        failedNotification({
          message: "Couldn't extract text from the PDF",
        });
        setLoading(false);
        return;
      }
    }

    const formData = {
      content: finalText,
      option: selectedOption,
    };

    console.log(formData);

    try {
      setInput("");

      if (selectedOption === "summarize") {
        const serverResponse = await axios.post(
          `${userProfileURI}/summary`,
          formData,
          { withCredentials: true }
        );

        setTitle(serverResponse.data?.data[0]?.userPromptTitle);
        setGeminiResponse(serverResponse.data?.data[0]?.aiResponse);
        setResponseCard(true);
      } else if (selectedOption === "flashcard") {
        const serverResponse = await axios.post(
          `${userProfileURI}/flashcard`,
          formData,
          { withCredentials: true }
        );

        setGeminiResponse(serverResponse?.data?.data[0]?.aiResponse);
        setResponseCard(true);
      } else {
        const quizFormData = {
          content: finalText,
          option: selectedOption,
          difficulty: selectedDifficulty,
        };

        console.log(quizFormData);

        const serverResponse = await axios.post(
          `${userProfileURI}/quiz`,
          quizFormData,
          { withCredentials: true }
        );

        setGeminiResponse(serverResponse?.data?.data[0]?.aiResponse);
        userNavigation("/quiz");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
              className={`w-full px-6 text-[18px] flex flex-col justify-end items-end ${
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

                  return flashcardData.map((item, index) => (
                    <div
                      key={index}
                      className="w-11/12 p-5 border-b mb-10 border-white/70"
                    >
                      <p>
                        <strong>Q{index + 1}:</strong> {item.Q}
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
        <div className="min-h-screen min-w-full bg-[#131314] relative flex justify-end items-start">
          <div
            className={`h-screen border-r-2 border-white/5 sm:flex justify-between flex-col text-white absolute top-0 left-0 px-6 py-5 hidden z-50 bg-[#1f2021]`}
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
                How can I help,{" "}
                <span className="text-[#458DFA]">
                  {userData?.name?.toUpperCase() || ""} ?
                </span>
              </h1>

              <form
                className="bg-[#131314] w-[90vw] sm:w-[60vw] md:w-[60vw] lg:w-[50vw] xl:w-[40vw] px-4 flex flex-col gap-3 rounded-4xl items-center shadow-white/10 shadow-md outline-[1.5px] outline-white/10
"
              >
                <div className="flex gap-2 items-center justify-center w-full mt-5">
                  {previewUrl && (
                    <div className="w-full mt-4 bg-white/5 p-3 rounded-xl flex flex-col gap-3">
                      {/* File Name */}
                      <p className="text-white/80 text-sm">
                        {selectedFile.name}
                      </p>

                      {/* Image Preview */}
                      {selectedFile.type.startsWith("image/") && (
                        <img
                          src={previewUrl}
                          alt="preview"
                          className="max-h-[200px] rounded-lg object-contain"
                        />
                      )}

                      {/* PDF Preview */}
                      {selectedFile.type === "application/pdf" && (
                        <iframe
                          src={previewUrl}
                          className="w-full h-[200px] rounded-lg"
                          title="pdf preview"
                        ></iframe>
                      )}

                      {/* Remove preview button */}
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewUrl(null);
                            setSelectedFile(null);
                          }}
                          className="text-white/70 hover:text-white/100 transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <div
                    className="hover:bg-white/5 p-2 h-[45px] w-[45px] rounded-4xl flex justify-center items-center cursor-pointer"
                    onClick={handleIconClick}
                  >
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

                <div className="w-fit flex flex-wrap justify-center items-center gap-4 sm:gap-8 mt-2 px-4 relative">
                  {selectedOption === "quiz" && (
                    <div className="flex px-4 py-3 rounded-md transition-all duration-200 flex-col gap-3 absolute bg-black top-[0%] right-[-900%]">
                      {["easy", "medium", "hard"].map((difficulty) => (
                        <button
                          key={difficulty}
                          type="button"
                          onClick={() => setSelectedDifficulty(difficulty)}
                          className={`h-full w-full text-white px-2 py-1 rounded-md capitalize cursor-pointer transition-all duration-200 
          ${
            selectedDifficulty === difficulty
              ? "bg-white/10"
              : "hover:bg-white/10"
          }`}
                        >
                          {difficulty}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </form>

              <div className="w-full flex justify-center">
                {["summarize", "flashcard", "quiz"].map((option) => (
                  <div
                    key={option}
                    className="flex px-4 py-1 rounded-md transition-all duration-200"
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedOption(option)}
                      className={`h-full w-fit text-white p-4 rounded-4xl capitalize cursor-pointer transition-all duration-200 
          ${selectedOption === option ? "bg-white/10" : "hover:bg-white/10"}`}
                    >
                      {option}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HomePage;
