import Button from "../components/button";
import Card from "../components/card";
import Input from "../components/input";
import lightModeIcon from "../assets/lightmode.png";
import darkModeIcon from "../assets/darkmode.png";
import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div
      className={`relative w-full h-screen flex items-center justify-center transition-colors ${
        isDarkMode ? "bg-[#0F1115] text-white" : "bg-white text-gray-900"
      }`}
    >
      <div
        className={`absolute top-3 left-3 font-pt-serif text-xl font-normal ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        CashTrackr
      </div>
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
            isDarkMode
              ? "border-white/20 bg-white/5 hover:bg-white/10"
              : "border-gray-300 bg-black/5 hover:bg-black/10"
          }`}
          aria-label={
            isDarkMode ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          <img
            src={isDarkMode ? lightModeIcon : darkModeIcon}
            alt={isDarkMode ? "Light mode" : "Dark mode"}
            className="h-5 w-5"
          />
        </button>
      </div>
      <Card
        theme={isDarkMode ? "dark" : "light"}
        size="lg"
        className="w-full max-w-md justify-center"
      >
        <h1
          className={`title-serif font-normal text-left w-full animate-fade-up ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Welcome Back
        </h1>
        <Input
          type="email"
          placeholder="Enter email address"
          theme={isDarkMode ? "dark" : "light"}
        />
        <Input
          type="password"
          placeholder="Enter password"
          theme={isDarkMode ? "dark" : "light"}
        />
        <Button size="md" variant={isDarkMode ? "light" : "dark"} fullWidth>
          login
        </Button>
        <Link
          to="/register"
          className={`text-left w-full text-sm transition ${
            isDarkMode
              ? "text-white/70 hover:text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Register
        </Link>
      </Card>
    </div>
  );
}

export default Login;
