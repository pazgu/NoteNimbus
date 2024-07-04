/* eslint-disable react/prop-types */

import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import AuthLayout from "./components/AuthLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import AuthProvider from "./context/AuthContext";

const loggedInUser = { username: "baba" };

function ProtectedRoute({ children }) {
  // in real world, loggedInUser will consume from AuthContext
  if (loggedInUser === null) {
    return <Navigate to="/auth/login" />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage/>} />
          <Route path="about" element={<div>about</div>} />
          <Route path="contact" element={<div>contact</div>} />
          <Route path="task" element={<div>tasks</div>} />
        </Route>

        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
