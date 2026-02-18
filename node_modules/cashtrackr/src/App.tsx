import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddExpense from "./pages/AddExpense";
import ManageExpenses from "./pages/ManageExpenses";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/register", element: <Register /> },
  { path: "/add-expense", element: <AddExpense /> },
  { path: "/manage-expenses", element: <ManageExpenses /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
