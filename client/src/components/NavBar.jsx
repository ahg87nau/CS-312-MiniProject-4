import React from "react";
import { Link } from "react-router-dom";

export default function NavBar({ user, onLogout }) {
  return (
    <nav
      className="nav d-flex justify-content-between align-items-center px-4 py-2 shadow-sm"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(10px)",
        borderRadius: "0 0 12px 12px",
      }}
    >
      {/* Brand / Logo */}
      <div className="brand fw-bold fs-5">
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "#00aaff",
            fontWeight: "600",
          }}
        >
          Explore & Learn Blog
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="links d-flex align-items-center gap-3">
        {/* Always visible navigation */}
        <Link to="/" className="text-light text-decoration-none">
          Home
        </Link>
        <Link to="/posts" className="text-light text-decoration-none">
          View Posts
        </Link>

        {/* Show only if logged in */}
        {user && (
          <>
            <Link to="/new" className="text-light text-decoration-none">
              New Post
            </Link>
            <Link to="/profile" className="text-light text-decoration-none">
              My Profile
            </Link>
          </>
        )}

        {/* Show only if NOT logged in */}
        {!user && (
          <>
            <Link to="/signin" className="btn btn-sm btn-outline-light">
              Sign In
            </Link>
            <Link to="/signup" className="btn btn-sm btn-primary">
              Sign Up
            </Link>
          </>
        )}

        {/* Logout button */}
        {user && (
          <button
            className="btn btn-sm btn-outline-light"
            onClick={onLogout}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

