/* eslint-disable react/prop-types */

import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import AuthLayout from "./components/AuthLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import AuthProvider, { AuthContext } from "./context/AuthContext";
import Notes from "./pages/Notes";
import { useContext } from "react";
import Contact from "./pages/Contact";
import { ToastProvider } from "./components/ui/toast";
import Profile from "./pages/Profile";
import CreateNewNote from "./pages/CreateNewNote";
import NoteDetails from "./pages/NoteDetails";

function ProtectedRoute({ children }) {
  const { loggedInUser } = useContext(AuthContext);
  if (loggedInUser === undefined) {
    //at first mount
    return null;
  }
  if (loggedInUser === null) {
    return <Navigate to="/auth/login" />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route
              path="contact"
              element={
                <ProtectedRoute>
                  <Contact />
                </ProtectedRoute>
              }
            />
            <Route
              path="notes/:userId/:id"
              element={
                <ProtectedRoute>
                  <NoteDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="notes/:userId"
              element={
                <ProtectedRoute>
                  <Notes />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile/:userId"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="notes/create"
              element={
                <ProtectedRoute>
                  <CreateNewNote />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
