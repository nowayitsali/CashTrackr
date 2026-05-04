import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/button";
import Card from "../components/card";
import darkModeIcon from "../assets/darkmode.png";
import lightModeIcon from "../assets/lightmode.png";
import {
  authFetch,
  clearAuthSession,
  getToken,
  getStoredUser,
} from "../lib/api";

type ExpenseItem = {
  id: number;
  title: string;
  amount: string;
  expenseDate: string;
  note?: string | null;
  category?: { id: number; name: string } | null;
};

type StoredUser = {
  id: number;
  email: string;
  name: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatDate(isoDate: string) {
  const date = new Date(isoDate);
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = String(date.getDate()).padStart(2, "0");
  return `${month} ${day}`;
}

function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!getToken()) {
      navigate("/login");
      return;
    }

    const storedUser = getStoredUser<StoredUser>();
    setUser(storedUser);

    async function loadExpenses() {
      try {
        const data = await authFetch<ExpenseItem[]>("/expenses");
        setExpenses(data);
      } catch (err) {
        console.error("Failed to load expenses:", err);
      } finally {
        setLoading(false);
      }
    }

    loadExpenses();
  }, [navigate]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    }

    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showProfileMenu]);

  function handleLogout() {
    clearAuthSession();
    navigate("/login");
  }

  const [monthlyBudget, setMonthlyBudget] = useState<number>(() => {
    try {
      const raw = localStorage.getItem("monthlyBudget");
      return raw ? Number(raw) : 1000;
    } catch {
      return 1000;
    }
  });
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalInput, setGoalInput] = useState(String(monthlyBudget));

  const summary = useMemo(() => {
    const total = expenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0,
    );
    const recent = expenses.slice(0, 5);

    return { total, recent };
  }, [expenses]);

  const monthlySpent = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return expenses
      .filter((expense) => {
        const date = new Date(expense.expenseDate);
        return (
          date.getMonth() === currentMonth && date.getFullYear() === currentYear
        );
      })
      .reduce((sum, expense) => sum + Number(expense.amount), 0);
  }, [expenses]);

  const goalProgress = (monthlySpent / (monthlyBudget || 1)) * 100;

  return (
    <div
      className={`relative min-h-screen px-6 py-10 transition-colors ${isDarkMode ? "bg-[#0F1115] text-white" : "bg-white text-gray-900"}`}
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
          onClick={() => setIsDarkMode((prev) => !prev)}
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

        <div className="relative" ref={profileMenuRef}>
          <button
            type="button"
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
              isDarkMode
                ? "border-white/20 bg-white/5 hover:bg-white/10"
                : "border-gray-300 bg-black/5 hover:bg-black/10"
            }`}
            aria-label="Profile menu"
            title={user?.name || "Profile"}
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </button>

          {showProfileMenu && (
            <div
              className={`absolute top-12 right-0 rounded-lg border shadow-lg ${
                isDarkMode
                  ? "border-white/10 bg-[#1a1f26]"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="px-4 py-3 text-sm font-medium">
                {user?.name || "User"}
              </div>
              <div
                className={`border-t ${isDarkMode ? "border-white/10" : "border-gray-200"}`}
              />
              <button
                type="button"
                onClick={() => {
                  clearAuthSession();
                  navigate("/login");
                }}
                className={`block w-full px-4 py-2 text-left text-sm transition ${
                  isDarkMode
                    ? "hover:bg-white/5 text-red-400"
                    : "hover:bg-gray-100 text-red-600"
                }`}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowGoalModal(false)} />
          <div className={`relative w-full max-w-md rounded-2xl p-6 ${isDarkMode ? "bg-[#0B0D10] text-white" : "bg-white text-gray-900"}`}>
            <h3 className="text-lg font-semibold">Edit Monthly Goal</h3>
            <p className="mt-2 text-sm text-gray-400">Set the monthly spending goal for progress tracking.</p>

            <div className="mt-4">
              <label className="block text-xs text-gray-400">Amount (USD)</label>
              <input
                type="number"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                className={`mt-1 w-full rounded-md border px-3 py-2 ${isDarkMode ? "bg-black border-white/10 text-white" : "bg-white border-gray-300 text-gray-900"}`}
              />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowGoalModal(false)}
                className={`px-4 py-2 rounded-md ${isDarkMode ? "bg-white/5" : "bg-gray-100"}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const val = Number(goalInput) || 0;
                  setMonthlyBudget(val);
                  try { localStorage.setItem('monthlyBudget', String(val)); } catch {}
                  setShowGoalModal(false);
                }}
                className="px-4 py-2 rounded-md bg-blue-500 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 pt-12">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card
            theme={isDarkMode ? "dark" : "light"}
            size="lg"
            className="flex flex-col justify-between text-left lg:col-span-2"
          >
            <div className="w-full">
              <p
                className={`text-xs uppercase tracking-[0.2em] ${isDarkMode ? "text-white/50" : "text-gray-500"}`}
              >
                This Month
              </p>
              <h1 className="mt-3 text-5xl font-bold">
                {loading ? "..." : formatCurrency(monthlySpent)}
              </h1>
              <p
                className={`mt-1 text-sm ${isDarkMode ? "text-white/60" : "text-gray-600"}`}
              >
                Monthly spending
              </p>
            </div>

            <div className="mt-12 grid w-full grid-cols-3 gap-4">
              <div
                className={`rounded-lg p-6 ${isDarkMode ? "bg-white/5" : "bg-gray-100"}`}
              >
                <p
                  className={`text-xs uppercase tracking-[0.2em] ${isDarkMode ? "text-white/50" : "text-gray-500"}`}
                >
                  Total
                </p>
                <p className="mt-3 text-2xl font-bold">
                  {loading ? "..." : formatCurrency(summary.total)}
                </p>
              </div>
              <div
                className={`rounded-lg p-6 ${isDarkMode ? "bg-white/5" : "bg-gray-100"}`}
              >
                <p
                  className={`text-xs uppercase tracking-[0.2em] ${isDarkMode ? "text-white/50" : "text-gray-500"}`}
                >
                  Expenses
                </p>
                <p className="mt-3 text-2xl font-bold">
                  {loading ? "..." : expenses.length}
                </p>
              </div>
              <div
                className={`rounded-lg p-6 ${isDarkMode ? "bg-white/5" : "bg-gray-100"}`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setGoalInput(String(monthlyBudget));
                    setShowGoalModal(true);
                  }}
                  className="w-full text-left"
                  aria-label="Edit monthly goal"
                >
                  <p
                    className={`text-xs uppercase tracking-[0.2em] ${isDarkMode ? "text-white/50" : "text-gray-500"}`}
                  >
                    Goal
                  </p>
                  <p className="mt-3 text-2xl font-bold">
                    {formatCurrency(monthlyBudget)}
                  </p>
                </button>
              </div>
            </div>

          </Card>
          <Card
            theme={isDarkMode ? "dark" : "light"}
            size="lg"
            className="items-stretch text-left"
          >
            <div className="w-full">
              <p
                className={`text-xs uppercase tracking-[0.2em] ${isDarkMode ? "text-white/50" : "text-gray-500"}`}
              >
                Quick Actions
              </p>
              <h2 className="mt-2 text-xl font-semibold">Expense</h2>
            </div>

            <div className="mt-4 flex w-full flex-col gap-2">
              <Button
                variant={isDarkMode ? "light" : "dark"}
                onClick={() => navigate("/add-expense")}
                fullWidth
              >
                Add Expense
              </Button>
              <Button
                variant="blue"
                onClick={() => navigate("/manage-expenses")}
                fullWidth
              >
                Manage
              </Button>
            </div>

            <div className="mt-auto flex flex-col gap-4 pt-6">
              <p
                className={`text-xs uppercase tracking-[0.2em] ${isDarkMode ? "text-white/50" : "text-gray-500"}`}
              >
                Budget Progress
              </p>
              <div className="space-y-2">
                <div className="flex items-end justify-between">
                  <span className="text-sm font-medium">
                    {formatCurrency(monthlySpent)} /{" "}
                    {formatCurrency(monthlyBudget)}
                  </span>
                  <span
                    className={`text-xs font-semibold ${goalProgress > 100 ? "text-red-400" : "text-emerald-400"}`}
                  >
                    {Math.round(goalProgress)}%
                  </span>
                </div>
                <div className="relative w-full">
                  <div
                    className={`h-3 w-full rounded-full overflow-hidden ${isDarkMode ? "bg-white/10" : "bg-gray-300"}`}
                  >
                    <div
                      className={`h-full rounded-full transition-all ${goalProgress > 100 ? "bg-red-500" : "bg-blue-500"}`}
                      style={{ width: `${Math.min(goalProgress, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card
          theme={isDarkMode ? "dark" : "light"}
          size="lg"
          className="items-start text-left w-full"
        >
          <div className="w-full">
            <p
              className={`text-xs uppercase tracking-[0.2em] ${isDarkMode ? "text-white/50" : "text-gray-500"}`}
            >
              All expenses
            </p>
            <h2 className="text-xl font-semibold">Expense list</h2>
          </div>

          <div
            className={`w-full overflow-hidden rounded-2xl border ${isDarkMode ? "border-white/10" : "border-gray-200"}`}
          >
            <table className="w-full border-collapse text-left">
              <thead
                className={
                  isDarkMode
                    ? "bg-white/5 text-white/50"
                    : "bg-gray-50 text-gray-500"
                }
              >
                <tr>
                  <th className="px-4 py-3 text-sm font-medium">Date</th>
                  <th className="px-4 py-3 text-sm font-medium">
                    Description
                  </th>
                  <th className="px-4 py-3 text-sm font-medium">Category</th>
                  <th className="px-4 py-3 text-sm font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length > 0 ? (
                  expenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className={
                        isDarkMode
                          ? "border-t border-white/10"
                          : "border-t border-gray-200"
                      }
                    >
                      <td className="px-4 py-3 text-sm">
                        {formatDate(expense.expenseDate)}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{expense.title}</p>
                          {expense.note ? (
                            <p className="text-sm text-white/50">
                              {expense.note}
                            </p>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {expense.category?.name || "Uncategorized"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {formatCurrency(Number(expense.amount))}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-sm text-white/50">
                      No expenses yet. Add one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
