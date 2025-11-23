import SignupPage from "./pages/authPages/SignupPage";
import AuthPage from "./pages/authPages/AuthPage";
import LoginPage from "./pages/authPages/LoginPage";
import HomePage from "./pages/HomePage";

import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ClimbingBoxLoader } from "react-spinners";
import { useUser } from "./context/UserContext";
import QuizPage from "./pages/QuizPage";

export const baseServerURI = "http://localhost:7000/api/v1/auth/user";
export const userProfileURI = "http://localhost:7000/api/v1/user";

const App = () => {
  const { userData, isLoading } = useUser();
  const userLoggedIn = !!userData?._id;
  const userVerified = userData?.isVerified;

  if (isLoading)
    return (
      <div className="bg-black/90 text-white h-screen w-full flex justify-center items-center">
        <ClimbingBoxLoader size={40} color="white" />
      </div>
    );

  return (
    <main className="min-h-screen w-full box-border p-0 m-0">
      <Toaster
        position="top-center"
        reverseOrder={true}
        containerClassName="mt-8"
      />

      <Routes>
        <Route
          path="/"
          element={
            userLoggedIn && userVerified ? (
              <HomePage />
            ) : userLoggedIn && !userVerified ? (
              <Navigate to="/auth" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/login"
          element={
            userLoggedIn ? (
              userVerified ? (
                <Navigate to="/" replace />
              ) : (
                <Navigate to="/auth" replace />
              )
            ) : (
              <LoginPage />
            )
          }
        />

        <Route
          path="/signup"
          element={
            userLoggedIn ? (
              userVerified ? (
                <Navigate to="/" replace />
              ) : (
                <Navigate to="/auth" replace />
              )
            ) : (
              <SignupPage />
            )
          }
        />

        <Route
          path="/auth"
          element={
            userLoggedIn ? (
              userVerified ? (
                <Navigate to="/" replace />
              ) : (
                <AuthPage />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />

        <Route path="/quiz" element={<QuizPage />} />
      </Routes>
    </main>
  );
};

export default App;
