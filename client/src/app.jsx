import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { api } from "./api";
import NavBar from "./components/NavBar.jsx";
import SignIn from "./components/SignIn.jsx";
import SignUp from "./components/SignUp.jsx";
import PostForm from "./components/PostForm.jsx";
import PostList from "./components/PostList.jsx";
import EditPost from "./components/EditPost.jsx";
import Profile from "./components/Profile.jsx";
import PostDetail from "./components/PostDetail.jsx";
import Home from "./components/Home.jsx";
import Footer from "./components/Footer.jsx";

export const CATEGORIES = ["Lifestyle", "Technology", "Education", "Other"];

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load session user on mount
  useEffect(() => {
    api.me()
      .then((r) => setUser(r.user))
      .catch(() => setUser(null));
  }, []);

  // Auth guard helper
  function requireAuth(el) {
    return user ? el : <Navigate to="/signin" replace />;
  }

  // Logout handler
  async function handleLogout() {
    try {
      await api.logout();
      setUser(null);
      navigate("/signin");
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  return (
    <>
      <NavBar user={user} onLogout={handleLogout} />

      {/* === Main Content === */}
      <div className="container mt-4" style={{ flex: 1 }}>
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Home />} />

          {/* All Posts Page */}
          <Route path="/posts" element={<PostList user={user} />} />

          {/* Single Post Details */}
          <Route path="/posts/:id" element={<PostDetail />} />

          {/* Create / Edit / Profile */}
          <Route path="/new" element={requireAuth(<PostForm />)} />
          <Route path="/edit/:id" element={requireAuth(<EditPost />)} />
          <Route
            path="/profile"
            element={requireAuth(<Profile user={user} setUser={setUser} />)}
          />

          {/* Auth Routes */}
          <Route
            path="/signin"
            element={
              <SignIn
                onSignedIn={(u) => {
                  setUser(u);
                  navigate("/posts");
                }}
              />
            }
          />
          <Route
            path="/signup"
            element={<SignUp onSignedUp={() => navigate("/signin")} />}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* FOOTER */}
      <Footer />
    </>
  );
}

