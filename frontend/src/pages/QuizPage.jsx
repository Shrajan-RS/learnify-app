import React, { useEffect, useState } from "react";
import useCurrentUser from "../hooks/useCurrentUser";
import axios from "axios";
import { userProfileURI } from "../App";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

function QuizPage() {
  const { isLoading, userData } = useCurrentUser();

  const [quiz, setQuiz] = useState(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timer, setTimer] = useState(60);
  const [showResults, setShowResults] = useState(false);

  // Fetch quiz
  const getCurrentQuiz = async () => {
    try {
      const quizId = userData?.message?.slice(-1)[0];
      console.log(quizId);

      if (!quizId) return;

      const quizRes = await axios.get(`${userProfileURI}/quiz/${quizId}`, {
        withCredentials: true,
      });

      let raw = quizRes?.data?.data?.quizData;

      if (typeof raw === "string") {
        raw = raw.replace(/```json|```/g, "");
        raw = JSON.parse(raw);
      }

      setQuiz(raw);
    } catch (err) {
      console.error("Quiz fetch failed:", err);
    }
  };

  useEffect(() => {
    if (!isLoading) getCurrentQuiz();
  }, [isLoading, userData]);

  useEffect(() => {
    if (!quiz) return;

    if (timer <= 0) {
      handleSkip();
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, quiz]);

  const handleSelect = (option) => {
    setSelected(option);
    setShowExplanation(true);
  };

  const handleSkip = () => {
    setSelected("SKIPPED");
    setShowExplanation(false);

    // auto move
    setTimeout(() => {
      nextQuestion();
    }, 400);
  };

  const nextQuestion = () => {
    if (index + 1 < quiz.length) {
      setIndex(index + 1);
      setSelected(null);
      setShowExplanation(false);
      setTimer(60);
    } else {
      setShowResults(true); // <--- instead of alert
    }
  };

  // Now it's safe to early-return
  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-xl">
        Loading Quiz...
      </div>
    );
  }

  const current = quiz[index];

  if (showResults) {
    return (
      <div className="min-h-screen bg-[#131314] flex items-center justify-center p-4 relative">
        <Link
          to={"/"}
          className="text-white absolute top-[5%] right-[3%] hover:bg-white/10 rounded-xl transition-all duration-200 px-4 py-2"
        >
          <FaHome size={30} />
        </Link>
        <div className="bg-gray-800 text-white w-full max-w-2xl p-6 rounded-xl shadow-lg space-y-6">
          <h1 className="text-3xl font-bold text-center">Results 🎉</h1>
          <p className="opacity-80 text-center mb-4">
            Answer's for all the questions
          </p>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {quiz.map((q, i) => (
              <div key={i} className="bg-gray-700 p-4 rounded-lg">
                <p className="font-semibold text-lg mb-2">
                  {i + 1}. {q.Q}
                </p>
                <p className="text-green-400 font-medium">
                  Correct Answer: {q.answer}
                </p>
                <p className="text-sm opacity-80 mt-1">{q.explanation}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold text-white mt-4 cursor-pointer"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131314] flex items-center justify-center p-4 relative">
      <Link
        to={"/"}
        className="text-white absolute top-[5%] right-[3%] hover:bg-white/10 rounded-xl transition-all duration-200 px-4 py-2"
      >
        <FaHome size={30} />
      </Link>

      <div className="bg-gray-800 text-white w-full max-w-xl p-6 rounded-xl shadow-lg space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Quiz Game </h1>

          {/* Question counter */}
          <p className="text-lg opacity-80">
            {index + 1}/{quiz.length}
          </p>
        </div>

        {/* Timer bar */}
        <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all duration-1000"
            style={{ width: `${(timer / 60) * 100}%` }}
          />
        </div>

        <p className="text-right text-sm opacity-80">{timer}s left</p>

        {/* Question */}
        <p className="text-lg font-medium">{`${current.Q}`}</p>

        {/* Options */}
        <div className="space-y-3">
          {current.options.map((opt, i) => {
            const isCorrect = opt === current.answer;
            const isSelected = opt === selected;

            const letters = ["A", "B", "C", "D"]; // <-- labels

            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                disabled={selected !== null}
                className={`w-full text-left px-4 py-3 rounded-lg transition cursor-pointer
        ${
          selected
            ? isSelected
              ? isCorrect
                ? "bg-green-500 text-black"
                : "bg-red-500 text-black"
              : "bg-gray-700"
            : "bg-gray-700 hover:bg-gray-600"
        }
      `}
              >
                <span className="font-bold mr-2">{letters[i]}.</span>
                {opt}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="p-4 bg-gray-700 rounded-lg">
            <p className="text-sm">{current.explanation}</p>
          </div>
        )}

        {(selected || timer <= 0) && (
          <button
            onClick={nextQuestion}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold text-white cursor-pointer"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}

export default QuizPage;
