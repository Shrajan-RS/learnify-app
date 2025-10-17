import Navbar from "./components/Navbar";
import SignupPage from "./pages/authPages/SignupPage";
import AuthPage from "./pages/authPages/AuthPage";
import LoginPage from "./pages/authPages/LoginPage";
import HomePage from "./pages/HomePage";

import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <main className="min-h-screen w-full box-border p-0 m-0">
      {/* <Navbar /> */}

      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </main>
  );
};

export default App;
