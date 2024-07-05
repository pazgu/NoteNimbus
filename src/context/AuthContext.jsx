/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import { formatJWTTokenToUser } from "../utils/utils";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = formatJWTTokenToUser(token);
      if (user !== null) {
        setLoggedInUser({token });
      }
    }
  }, []);

  const login = (user) => {
    localStorage.setItem("token", user.token);
    setLoggedInUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedInUser(null);
  };

  return (
    <AuthContext.Provider value={{ loggedInUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;


// import api from "@/lib/api";
// import { useLocalStorage } from "@uidotdev/usehooks";
// import React, { createContext, useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [loggedInUser, setLoggedInUser] = useState(undefined);
//   const [token, setToken] = useLocalStorage("token", null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!token) {
//       setLoggedInUser(null);
//       return;
//     }

//     async function fetchUser() {
//       try {
//         const response = await api.get("/auth/loggedInUser");
//         setLoggedInUser(response.data);
//       } catch (error) {
//         if (error.response?.status === 401) {
//           console.error("Invalid token, logging out");
//           logout();
//         } else if (error.response?.status === 404) {
//           console.error("User not found, logging out");
//           logout();
//         } else {
//           console.error("Error fetching user data:", error);
//         }
//       }
//     }

//     fetchUser();
//   }, [token]);

//   useEffect(() => {
//     if (loggedInUser) navigate("/", { replace: true });
//   }, [loggedInUser]);

//   function logout() {
//     setToken(null);
//     setLoggedInUser(null);
//   }

//   async function login(userData) {
//     try {
//       const response = await api.post("/auth/login", userData);
//       setToken(response.data.token);
//     } catch (error) {
//       console.error("Error logging in:", error);
//     }
//   }

//   async function register(userData) {
//     try {
//       const response = await api.post("/auth/register", userData);
//     } catch (error) {
//       console.error("Error registering:", error);
//     }
//   }

//   return (
//     <AuthContext.Provider value={{ loggedInUser, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within a UserProvider");
//   }
//   return context;
// }