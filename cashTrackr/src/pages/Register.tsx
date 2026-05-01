import Button from "../components/button";
import Card from "../components/card";
import Input from "../components/input";
import lightModeIcon from "../assets/lightmode.png";
import darkModeIcon from "../assets/darkmode.png";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setAuthSession } from "../lib/api";

function Register() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Register failed");
      }

      setAuthSession(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`relative w-full h-screen flex items-center justify-center transition-colors ${
        isDarkMode ? "bg-[#0F1115] text-white" : "bg-white text-gray-900"
      }`}
    >
      <Link
        to="/"
        className={`absolute top-3 left-3 font-pt-serif text-xl font-normal transition hover:opacity-80 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
        aria-label="Go to dashboard"
      >
        CashTrackr
      </Link>
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
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          <h1
            className={`title-serif font-normal text-left w-full animate-fade-up ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Welcome
          </h1>
          <Input
            type="text"
            placeholder="Enter your name"
            theme={isDarkMode ? "dark" : "light"}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Enter email address"
            theme={isDarkMode ? "dark" : "light"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Enter password"
            theme={isDarkMode ? "dark" : "light"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirm password"
            theme={isDarkMode ? "dark" : "light"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <Button
            type="submit"
            size="md"
            variant={isDarkMode ? "light" : "dark"}
            fullWidth
            isLoading={loading}
          >
            Continue
          </Button>
          <Link
            to="/login"
            className={`text-left w-full text-sm transition ${
              isDarkMode
                ? "text-white/70 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Already have an account? Login
          </Link>
        </form>
      </Card>
    </div>
  );
}

export default Register;
