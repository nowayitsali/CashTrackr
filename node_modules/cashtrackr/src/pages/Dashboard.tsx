import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/button";
import Card from "../components/card";
import darkModeIcon from "../assets/darkmode.png";
import lightModeIcon from "../assets/lightmode.png";

const overviewCards = [
  { label: "Balance", value: "$4,280.00" },
  { label: "Income", value: "$6,500.00" },
  { label: "Expenses", value: "$2,220.00" },
];

const spendingBreakdown = [
  { label: "Food", percent: 42, color: "#3b82f6" },
  { label: "Groceries", percent: 30, color: "#34d399" },
  { label: "Subscriptions", percent: 28, color: "#d946ef" },
];

const recentExpenses = [
  {
    date: "Nov 08",
    description: "Uber Eats",
    amount: "-$20.11",
    category: "Food",
    color: "bg-sky-500",
  },
  {
    date: "Nov 08",
    description: "Groceries",
    amount: "-$108.04",
    category: "Groceries",
    color: "bg-emerald-400",
  },
  {
    date: "Nov 08",
    description: "Open AI",
    amount: "-$25.00",
    category: "Subscriptions",
    color: "bg-fuchsia-500",
  },
  {
    date: "Nov 10",
    description: "AWS",
    amount: "-$14.99",
    category: "Subscriptions",
    color: "bg-fuchsia-500",
  },
];

function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const navigate = useNavigate();

  return (
    <div
      className={`relative min-h-screen w-full transition-colors ${
        isDarkMode ? "bg-[#0F1115] text-white" : "bg-white text-gray-900"
      }`}
    >
      <header
        className={`border-b px-6 py-4 ${
          isDarkMode ? "border-white/10" : "border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div
            className={`font-pt-serif text-xl font-normal ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            CashTrackr
          </div>

          <div className="flex items-center gap-2">
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

            <button
              type="button"
              onClick={() => navigate("/login")}
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
                isDarkMode
                  ? "border-white/20 bg-white/5 hover:bg-white/10"
                  : "border-gray-300 bg-black/5 hover:bg-black/10"
              }`}
              aria-label="Logout"
            >
              <svg
                viewBox="0 0 24 24"
                className={`h-5 w-5 ${isDarkMode ? "text-white" : "text-gray-900"}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 12m-3.2 0a3.2 3.2 0 1 0 6.4 0a3.2 3.2 0 1 0-6.4 0" />
                <path d="M4.5 19.5c1.7-2.8 4.3-4.2 7.5-4.2s5.8 1.4 7.5 4.2" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-6">
        <section className="grid gap-6 md:grid-cols-[1.6fr_1fr]">
          <Card
            theme={isDarkMode ? "dark" : "light"}
            size="lg"
            className="justify-between"
          >
            <div className="w-full text-left">
              <p className="text-sm uppercase tracking-[0.3em] text-white/50">
                Overview
              </p>
              <h1
                className={`mt-3 animate-fade-up title-serif font-normal ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Welcome back
              </h1>
              <p className={isDarkMode ? "text-white/70" : "text-gray-600"}>
                Track your income, expenses, and savings in one place.
              </p>
            </div>

            <div
              className={`flex w-full flex-1 flex-col justify-between rounded-2xl border p-6 text-left ${
                isDarkMode
                  ? "border-white/10 bg-white/5"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div>
                <p className="text-sm text-white/50">Your Monthly Spending</p>
                <p className="mt-2 text-4xl font-semibold">$2,200.00</p>
              </div>

              <div className="mt-4 flex w-full items-center justify-between gap-6">
                <div
                  className="relative flex h-44 w-44 items-center justify-center rounded-full"
                  style={{
                    background:
                      "conic-gradient(#3b82f6 0% 42%, #34d399 42% 72%, #d946ef 72% 100%)",
                  }}
                >
                  <div
                    className={`h-28 w-28 rounded-full ${
                      isDarkMode ? "bg-[#0F1115]" : "bg-white"
                    }`}
                  />
                </div>

                <div className="flex flex-1 flex-col gap-3 text-left">
                  {spendingBreakdown.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        {item.label}
                      </span>
                      <span className="font-semibold">{item.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid w-full gap-4 sm:grid-cols-3">
              {overviewCards.map((card) => (
                <div
                  key={card.label}
                  className={`rounded-2xl border p-4 text-left ${
                    isDarkMode
                      ? "border-white/10 bg-white/5"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <p className="text-sm text-white/50">{card.label}</p>
                  <p className="mt-2 text-2xl font-semibold">{card.value}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card theme={isDarkMode ? "dark" : "light"} size="lg">
            <div className="w-full text-left">
              <p className="text-sm uppercase tracking-[0.3em] text-white/50">
                Quick actions
              </p>
              <h2 className="mt-3 text-2xl font-semibold">Shortcuts</h2>
            </div>

            <div className="flex w-full flex-col gap-3">
              <Link
                to="/add-expense"
                className={`w-full rounded-lg px-4 py-3 text-center font-medium transition ${
                  isDarkMode
                    ? "bg-white text-gray-900 hover:bg-white/90"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                Add expense
              </Link>
              <Link
                to="/manage-expenses"
                className={`w-full rounded-lg px-4 py-3 text-center font-medium transition ${
                  isDarkMode
                    ? "border border-white/15 text-white hover:bg-white/5"
                    : "border border-gray-300 text-gray-900 hover:bg-gray-50"
                }`}
              >
                Manage expenses
              </Link>
            </div>

            <div className="w-full pt-6 text-left">
              <p className="text-sm uppercase tracking-[0.3em] text-white/50">
                Goals
              </p>
              <h3 className="mt-3 text-xl font-semibold">This month</h3>

              <div className="mt-5 space-y-4 text-left">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span>Savings goal</span>
                    <span>68%</span>
                  </div>
                  <div
                    className={
                      isDarkMode
                        ? "h-2 rounded-full bg-white/10"
                        : "h-2 rounded-full bg-gray-200"
                    }
                  >
                    <div className="h-2 w-[68%] rounded-full bg-blue-500" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span>Spending limit</span>
                    <span>42%</span>
                  </div>
                  <div
                    className={
                      isDarkMode
                        ? "h-2 rounded-full bg-white/10"
                        : "h-2 rounded-full bg-gray-200"
                    }
                  >
                    <div className="h-2 w-[42%] rounded-full bg-emerald-500" />
                  </div>
                </div>

                <Button
                  size="md"
                  variant={isDarkMode ? "light" : "dark"}
                  fullWidth
                >
                  View reports
                </Button>
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-1">
          <Card
            theme={isDarkMode ? "dark" : "light"}
            size="lg"
            className="md:col-span-1"
          >
            <div className="w-full text-left">
              <p className="text-sm uppercase tracking-[0.3em] text-white/50">
                Recent expenses
              </p>
              <h2 className="mt-3 text-2xl font-semibold">Latest activity</h2>
            </div>

            <div
              className={`w-full overflow-hidden rounded-2xl border text-left ${
                isDarkMode ? "border-white/10" : "border-gray-200"
              }`}
            >
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr
                    className={
                      isDarkMode
                        ? "bg-white/5 text-white/50"
                        : "bg-gray-50 text-gray-500"
                    }
                  >
                    <th className="px-4 py-3 text-sm font-medium">Date</th>
                    <th className="px-4 py-3 text-sm font-medium">
                      Description
                    </th>
                    <th className="px-4 py-3 text-sm font-medium">Amount</th>
                    <th className="px-4 py-3 text-sm font-medium">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {recentExpenses.map((expense) => (
                    <tr
                      key={`${expense.date}-${expense.description}`}
                      className={
                        isDarkMode
                          ? "border-t border-white/10"
                          : "border-t border-gray-200"
                      }
                    >
                      <td className="px-4 py-4 text-sm text-white/50">
                        {expense.date}
                      </td>
                      <td className="px-4 py-4 font-medium">
                        {expense.description}
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold">
                        {expense.amount}
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-3 text-sm">
                          <span
                            className={`h-4 w-4 rounded-sm ${expense.color}`}
                          />
                          {expense.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
