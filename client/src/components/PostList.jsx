import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { CATEGORIES } from "../App";

export default function PostList({ user }) {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const q = category ? `?category=${encodeURIComponent(category)}` : "";
      const data = await api.listPosts(q);
      setPosts(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, [category]);

  async function remove(id) {
    if (!confirm("Delete this post?")) return;
    try {
      await api.deletePost(id);
      setPosts((p) => p.filter((x) => x.blog_id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="container posts-container mt-4">

      {/* Toolbar */}
      <div
        className="d-flex justify-content-between align-items-center mb-3"
        style={{ flexWrap: "wrap", gap: "10px" }}
      >
        <h2 className="mb-0">All Posts</h2>
        <select
          className="form-select w-auto"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Error or empty states */}
      {error && <p className="text-danger">{error}</p>}
      {posts.length === 0 && !error && (
        <p
          style={{
            textAlign: "center",
            marginTop: "2rem",
            opacity: 0.8,
          }}
        >
          No posts yet. Be the first to write one!
        </p>
      )}

      {/* Post grid */}
      <div className="post-grid">
        {posts.map((p) => (
          <article
            key={p.blog_id}
            className="card shadow-sm border-0 post-card"
            style={{ borderRadius: "12px" }}
          >
            <div className="card-body">
              <header className="mb-2">
                <h3 className="h5 mb-1">
                  <Link
                    to={`/posts/${p.blog_id}`}
                    style={{
                      textDecoration: "none",
                      color: "#007bff",
                      fontWeight: "600",
                    }}
                  >
                    {p.title}
                  </Link>
                </h3>
                <small className="text-muted">
                  by {p.creator_name} ·{" "}
                  {new Date(p.date_created).toLocaleString()}
                </small>
              </header>

              <p className="mb-2">
                {p.body.length > 200
                  ? p.body.slice(0, 200) + "..."
                  : p.body}
              </p>

              <footer className="post-footer">
                <div className="mb-2">
                  <span className="badge bg-secondary">
                    {p.category || "Uncategorized"}
                  </span>
                </div>

                {user?.user_id === p.creator_user_id && (
                  <div className="actions-row mt-2">
                    <Link
                      className="btn btn-sm btn-outline-primary"
                      to={`/edit/${p.blog_id}`}
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => remove(p.blog_id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </footer>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
