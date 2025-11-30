import React from "react";
import useCurrentUser from "../hooks/useCurrentUser";
import { useUser } from "../context/UserContext";
import axios from "axios";
import { userProfileURI } from "../App";
import { ClimbingBoxLoader } from "react-spinners";
import { useState } from "react";
import { FaClipboard, FaClipboardCheck, FaArrowLeft } from "react-icons/fa";
import { customNotification } from "../utils/notification";
import { useNavigate } from "react-router-dom";

function PreviousChats() {
  const { isLoading, userData } = useCurrentUser();
  const [responseCard, setResponseCard] = useState(false);
  const [isCardLoading, setCardLoading] = useState(false);

  const [isSummary, setIsSummary] = useState(false);
  const [isFlashCard, setIsFlashCard] = useState(false);
  const [isQuiz, setIsQuiz] = useState(false);

  const [data, setData] = useState(null);

  const messagesIds = [userData?.message];
  const userNavigation = useNavigate();

  const handleQuery = async (e) => {
    const target = e.target.innerText.toLowerCase();

    setIsSummary(false);
    setIsFlashCard(false);
    setIsQuiz(false);

    try {
      setCardLoading(true);

      let endpoint = "";

      if (target === "summary") {
        endpoint = "get-previous-summary";
        setIsSummary(true);
      } else if (target === "flashcard") {
        endpoint = "get-previous-flashcard";
        setIsFlashCard(true);
      } else {
        endpoint = "get-previous-quiz";
        setIsQuiz(true);
      }

      const response = await axios.post(
        `${userProfileURI}/${endpoint}`,
        messagesIds,
        { withCredentials: true }
      );

      setData(response?.data?.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setCardLoading(false);
      setResponseCard(true);
    }
  };

  const parseFlashcards = (aiResponse) => {
    try {
      const clean = aiResponse.replace(/```json|```/g, "").trim();
      return JSON.parse(clean);
    } catch {
      return null;
    }
  };

  return (
    <section className="min-h-screen w-full">
      <FaArrowLeft
        className="absolute top-[5%] left-[5%] cursor-pointer text-white"
        size={25}
        onClick={() => window.location.reload()}
      />

      {isLoading || isCardLoading ? (
        <div className="min-h-screen flex justify-center items-center bg-[#131314]">
          <ClimbingBoxLoader size={40} color="white" />
        </div>
      ) : responseCard ? (
        <div className="p-[8%] bg-[#131314] min-h-screen text-white flex justify-center">
          {/* SUMMARY SECTION */}
          {isSummary && (
            <>
              {data?.length === 0 ? (
                <div className="flex justify-center items-center text-white text-3xl capitalize">
                  You have not generated any summaries yet!
                </div>
              ) : (
                <div>
                  {data.map(({ title, aiResponse }) => (
                    <div
                      key={title}
                      className="text-white bg-[#1E2939] w-[90vw] sm:w-[80vw] py-6 px-4 rounded-lg shadow-md mt-24 mb-4 relative"
                    >
                      <FaClipboard
                        className="absolute right-5 top-5 cursor-pointer"
                        size={25}
                        onClick={() => {
                          navigator.clipboard.writeText(aiResponse);
                          customNotification({
                            icon: <FaClipboardCheck />,
                            message: "Copied to clipboard!",
                          });
                        }}
                      />

                      <p className="font-semibold text-2xl text-center">
                        Summary of {title}
                      </p>

                      <div className="w-full h-[1px] bg-white/30 my-3"></div>

                      <ul className="list-disc space-y-5 px-8">
                        {aiResponse
                          .split("*")
                          .filter((p) => p.trim())
                          .map((point, index) => (
                            <li key={index} className="text-[18px]">
                              {point}
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* FLASHCARD SECTION */}
          {isFlashCard && (
            <>
              {data?.length === 0 ? (
                <div className="flex justify-center items-center text-white text-3xl capitalize">
                  You have not generated any flashcards yet!
                </div>
              ) : (
                <div>
                  {data.map(({ aiResponse }, idx) => {
                    const flashcards = parseFlashcards(aiResponse);

                    return (
                      <div
                        key={idx}
                        className="text-white bg-[#1E2939] w-[90vw] sm:w-[80vw] py-6 px-4 rounded-lg shadow-black/50 shadow-lg mt-24 mb-4 relative"
                      >
                        <FaClipboard
                          className="absolute right-5 top-5 cursor-pointer"
                          size={25}
                          onClick={() => {
                            if (!flashcards) return;

                            const textToCopy = flashcards
                              .map((item) => `Q: ${item.Q}\nA: ${item.A}`)
                              .join("\n\n");

                            navigator.clipboard.writeText(textToCopy);
                            customNotification({
                              icon: <FaClipboardCheck />,
                              message: "Copied!",
                            });
                          }}
                        />

                        <p className="font-semibold text-2xl text-center">
                          Flashcard
                        </p>
                        <div className="w-full h-[1px] bg-white/30 my-3"></div>

                        {!flashcards ? (
                          <p>Invalid JSON format</p>
                        ) : (
                          flashcards.map((item, index) => (
                            <div
                              key={index}
                              className="border-b border-white/40 pb-5 mb-5 px-7"
                            >
                              <p>
                                <strong>Q{index + 1}:</strong> {item.Q}
                              </p>
                              <p>
                                <strong>A:</strong> {item.A}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* QUIZ SECTION */}
          {isQuiz && (
            <>
              {data?.length === 0 ? (
                <div className="flex justify-center items-center text-white text-3xl capitalize">
                  You have not generated any type of quiz yet!
                </div>
              ) : (
                <div className="w-full flex flex-col items-center gap-10 mt-20">
                  {data.map((quizBlock, idx) => {
                    const clean = quizBlock.aiResponse
                      .replace(/```json|```/g, "")
                      .trim();

                    let parsed = [];
                    try {
                      parsed = JSON.parse(clean);
                    } catch (error) {
                      console.log(error);
                    }

                    return (
                      <div
                        key={idx}
                        className="text-white bg-[#1E2939] w-[90vw] sm:w-[80vw] py-7 px-5 rounded-lg shadow-md relative"
                      >
                        <FaClipboard
                          className="absolute right-5 top-5 cursor-pointer"
                          size={25}
                          onClick={() => {
                            const quizText = parsed
                              .map(
                                (q, i) =>
                                  `Q${i + 1}: ${q.Q}\nA. ${q.options[0]}\nB. ${
                                    q.options[1]
                                  }\nC. ${q.options[2]}\nD. ${
                                    q.options[3]
                                  }\nAnswer: ${q.answer}\nExplanation: ${
                                    q.explanation
                                  }`
                              )
                              .join("\n\n");

                            navigator.clipboard.writeText(quizText);
                            customNotification({
                              icon: <FaClipboardCheck />,
                              message: "Quiz copied!",
                            });
                          }}
                        />

                        <p className="text-3xl font-bold text-center capitalize">
                          {quizBlock.difficulty} Quiz
                        </p>

                        <div className="w-full h-[1px] bg-white/25 my-4"></div>

                        {parsed.map((item, qIdx) => (
                          <div
                            key={qIdx}
                            className="border-b border-white/30 pb-6 mb-6"
                          >
                            <p className="font-semibold text-lg mb-3">
                              Q{qIdx + 1}: {item.Q}
                            </p>

                            <ul className="space-y-2 ml-5">
                              {item.options.map((opt, optIdx) => {
                                const label = String.fromCharCode(65 + optIdx);

                                return (
                                  <li
                                    key={optIdx}
                                    className={`flex gap-2 text-[17px] ${
                                      opt === item.answer
                                        ? "font-bold text-green-300"
                                        : ""
                                    }`}
                                  >
                                    <span className="font-semibold">
                                      {label}.
                                    </span>
                                    <span>{opt}</span>
                                  </li>
                                );
                              })}
                            </ul>

                            <p className="mt-3 text-white/80 text-sm">
                              <strong>Explanation:</strong> {item.explanation}
                            </p>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="w-full min-h-screen flex flex-col items-center gap-24 p-[15%] bg-[#131314] relative">
          <FaArrowLeft
            className="absolute top-[5%] left-[5%] cursor-pointer text-white"
            size={25}
            onClick={() => userNavigation("/")}
          />

          <h1 className="text-4xl text-white">Previous Chats</h1>

          <div className="flex gap-8 text-white flex-wrap justify-center">
            {["summary", "flashcard", "quiz"].map((ele, index) => (
              <div
                key={index}
                onClick={handleQuery}
                className="w-64 h-40 bg-[#1E2939] rounded-2xl shadow-lg flex items-center justify-center text-white text-2xl font-semibold hover:scale-110 transition-all cursor-pointer uppercase shadow-black/50"
              >
                {ele}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default PreviousChats;
