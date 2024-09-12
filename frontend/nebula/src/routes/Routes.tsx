import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage";
import NotesPage from "../pages/NotesPage";
import MainPage from "../pages/MainPage";
import ProfilePage from "../pages/ProfilePage";
import TestPage from "../pages/test/TestPage";
import StatisticsPage from "../pages/StatisticsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
        <App />
    ),
    children: [
      { path: "", element: <MainPage /> },
      { path: "home", element: <HomePage /> },
      { path: "notes", element: <NotesPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "test", element: <TestPage /> },
      { path: "stats", element: <StatisticsPage /> }
    ],
  },
]);