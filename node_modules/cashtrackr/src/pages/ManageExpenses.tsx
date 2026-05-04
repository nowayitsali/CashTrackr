import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/button";
import Card from "../components/card";
import Input from "../components/input";
import { authFetch, getToken } from "../lib/api";

type ExpenseItem = {
  id: number;
  title: string;
  amount: string;
  expenseDate: string;
  note?: string | null;
  category?: { id: number; name: string } | null;
};

function formatDate(isoDate: string) {
  const date = new Date(isoDate);
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = String(date.getDate()).padStart(2, "0");
  return `${month} ${day}`;
}

function ManageExpenses() {
  const [isDarkMode] = useState(true);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    amount: "",
    expenseDate: "",
    categoryName: "",
    note: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!getToken()) {
      navigate("/login");
      return;
    }

    loadExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  async function loadExpenses() {
    try {
      const data = await authFetch<ExpenseItem[]>("/expenses");
      setExpenses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(expense: ExpenseItem) {
    setEditingId(expense.id);
    setEditForm({
      title: expense.title,
      amount: String(expense.amount),
      expenseDate: expense.expenseDate.slice(0, 10),
      categoryName: expense.category?.name || "",
      note: expense.note || "",
    });
  }

  async function saveEdit(id: number) {
    try {
      await authFetch(`/expenses/${id}`, {
        method: "PUT",
        body: JSON.stringify(editForm),
      });
      setEditingId(null);
      await loadExpenses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update expense");
    }
  }

  async function deleteExpense(id: number) {
    try {
      await authFetch(`/expenses/${id}`, { method: "DELETE" });
      await loadExpenses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete expense");
    }
  }

  const rows = useMemo(() => expenses, [expenses]);

  const [showOrganizeModal, setShowOrganizeModal] = useState(false);
  const [suggestedGroups, setSuggestedGroups] = useState<Array<any>>([]);

  function buildSuggestions() {
    const byCategory: Record<string, ExpenseItem[]> = {};
    for (const e of expenses) {
      const key = e.category?.name || "Uncategorized";
      if (!byCategory[key]) byCategory[key] = [];
      byCategory[key].push(e);
    }

    const groups = Object.entries(byCategory).map(([k, items], idx) => ({
      id: `g${idx}`,
      suggestedLabel: k === "Uncategorized" ? "Other" : k,
      confidence: 0.6,
      count: items.length,
      examples: items.slice(0, 3),
      itemIds: items.map((i) => i.id),
    }));

    setSuggestedGroups(groups);
  }

  return (
    <div
      className={`min-h-screen p-6 ${isDarkMode ? "bg-[#0F1115] text-white" : "bg-white text-gray-900"}`}
    >
      <Link
        to="/"
        className={`mb-6 inline-block font-pt-serif text-xl font-normal transition hover:opacity-80 ${isDarkMode ? "text-white" : "text-gray-900"}`}
        aria-label="Go to dashboard"
      >
        CashTrackr
      </Link>

      <div className="mx-auto max-w-6xl">
        <Card
          theme={isDarkMode ? "dark" : "light"}
          size="lg"
          className="w-full"
        >
          <div className="w-full text-left">
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">
              Manage expenses
            </p>
            <h1 className="mt-3 title-serif text-3xl font-normal">Expenses</h1>
            <div className="mt-4 flex items-center gap-3">
              <Button
                variant="blue"
                onClick={() => {
                  buildSuggestions();
                  setShowOrganizeModal(true);
                }}
              >
                Organize with AI
              </Button>
              <Button
                variant={isDarkMode ? "light" : "dark"}
                onClick={() => navigate("/add-expense")}
              >
                Add Expense
              </Button>
            </div>
          </div>

          {error ? (
            <p className="w-full text-sm text-red-500">{error}</p>
          ) : null}

          {loading ? (
            <p className="w-full text-left text-sm text-white/60">Loading...</p>
          ) : (
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
                    <th className="px-4 py-3 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((expense) => (
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
                        {editingId === expense.id ? (
                          <Input
                            theme={isDarkMode ? "dark" : "light"}
                            value={editForm.title}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                          />
                        ) : (
                          <div>
                            <p className="font-medium">{expense.title}</p>
                            {expense.note ? (
                              <p className="text-sm text-white/50">
                                {expense.note}
                              </p>
                            ) : null}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {editingId === expense.id ? (
                          <Input
                            theme={isDarkMode ? "dark" : "light"}
                            value={editForm.categoryName}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                categoryName: e.target.value,
                              }))
                            }
                          />
                        ) : (
                          expense.category?.name || "Uncategorized"
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {editingId === expense.id ? (
                          <Input
                            theme={isDarkMode ? "dark" : "light"}
                            value={editForm.amount}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                amount: e.target.value,
                              }))
                            }
                          />
                        ) : (
                          `$${Number(expense.amount).toFixed(2)}`
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingId === expense.id ? (
                          <div className="flex gap-2">
                            <Button
                              variant="blue"
                              size="sm"
                              onClick={() => saveEdit(expense.id)}
                            >
                              Save
                            </Button>
                            <Button
                              variant={isDarkMode ? "light" : "dark"}
                              size="sm"
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Button
                              variant="blue"
                              size="sm"
                              onClick={() => startEdit(expense)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => deleteExpense(expense.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
        {showOrganizeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowOrganizeModal(false)}
            />
            <div
              className={`relative w-full max-w-3xl rounded-2xl p-6 ${isDarkMode ? "bg-[#0B0D10] text-white" : "bg-white text-gray-900"}`}
            >
              <h3 className="text-lg font-semibold">
                Organize expenses (preview)
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                This preview shows suggested groups and labels. No changes are
                saved until you apply.
              </p>

              <div className="mt-4 space-y-4 max-h-96 overflow-auto">
                {suggestedGroups.length === 0 ? (
                  <p className="text-sm text-gray-400">
                    No suggestions available.
                  </p>
                ) : (
                  suggestedGroups.map((g) => (
                    <div key={g.id} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <input
                            className="rounded px-2 py-1 bg-transparent border border-white/10"
                            value={g.suggestedLabel}
                            onChange={() => {}}
                          />
                          <span className="ml-3 text-sm text-white/50">
                            {g.count} items
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="light">
                            Preview
                          </Button>
                          <Button size="sm" variant="blue">
                            Apply
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-white/60">
                        {g.examples.map((ex: ExpenseItem) => (
                          <div
                            key={ex.id}
                            className="flex items-center justify-between py-1"
                          >
                            <div>
                              <div className="font-medium">{ex.title}</div>
                              <div className="text-xs text-white/40">
                                {ex.note || ""}
                              </div>
                            </div>
                            <div className="ml-4">
                              ${Number(ex.amount).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant={isDarkMode ? "light" : "dark"}
                  onClick={() => setShowOrganizeModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageExpenses;
