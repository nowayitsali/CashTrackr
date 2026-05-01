import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/button";
import Card from "../components/card";
import Input from "../components/input";
import darkModeIcon from "../assets/darkmode.png";
import lightModeIcon from "../assets/lightmode.png";
import { authFetch, getToken } from "../lib/api";

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function AddExpense() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState(getTodayDate());
  const [categoryName, setCategoryName] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!getToken()) {
      navigate("/login");
    }
  }, [navigate]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const trimmedTitle = title.trim();
    const trimmedCategory = categoryName.trim();
    const trimmedNote = note.trim();
    const parsedAmount = Number(amount);

    if (
      !trimmedTitle ||
      !expenseDate ||
      !Number.isFinite(parsedAmount) ||
      parsedAmount <= 0
    ) {
      setError("Please enter a title, a valid amount, and a date.");
      setLoading(false);
      return;
    }

    try {
      await authFetch("/expenses", {
        method: "POST",
        body: JSON.stringify({
          title: trimmedTitle,
          amount: parsedAmount,
          expenseDate,
          categoryName: trimmedCategory || undefined,
          note: trimmedNote || undefined,
        }),
      });

      setSuccess("Expense saved.");
      setTitle("");
      setAmount("");
      setExpenseDate(getTodayDate());
      setCategoryName("");
      setNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save expense");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`relative flex min-h-screen items-center justify-center px-6 py-10 transition-colors ${isDarkMode ? "bg-[#0F1115] text-white" : "bg-white text-gray-900"}`}
    >
      <Link
        to="/"
        className={`absolute top-3 left-3 font-pt-serif text-xl font-normal transition hover:opacity-80 ${isDarkMode ? "text-white" : "text-gray-900"}`}
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
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-4 text-left"
        >
          <div>
            <p
              className={`text-sm uppercase tracking-[0.3em] ${isDarkMode ? "text-white/50" : "text-gray-500"}`}
            >
              New expense
            </p>
            <h1
              className={`mt-3 title-serif text-3xl font-normal ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
              Add expense
            </h1>
          </div>

          <Input
            placeholder="Enter description"
            theme={isDarkMode ? "dark" : "light"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="Enter amount"
            theme={isDarkMode ? "dark" : "light"}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Input
            type="date"
            theme={isDarkMode ? "dark" : "light"}
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
          />
          <Input
            placeholder="Enter category"
            theme={isDarkMode ? "dark" : "light"}
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <Input
            placeholder="Note (optional)"
            theme={isDarkMode ? "dark" : "light"}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          {success ? (
            <p className="text-sm text-emerald-500">{success}</p>
          ) : null}

          <Button
            type="submit"
            variant={isDarkMode ? "light" : "dark"}
            isLoading={loading}
            fullWidth
          >
            Add Expense
          </Button>

          <Link
            to="/manage-expenses"
            className={`text-left text-sm transition ${
              isDarkMode
                ? "text-white/70 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            View all expenses
          </Link>
        </form>
      </Card>
    </div>
  );
}

export default AddExpense;
