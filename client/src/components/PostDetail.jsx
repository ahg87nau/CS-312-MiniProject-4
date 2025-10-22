import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPost() {
      try {
        const data = await api.getPost(id); // fetch single post directly
        setPost(data);
      } catch (err) {
        console.error("Failed to load post", err);
        setError("Failed to load this post.");
      }
    }
    fetchPost();
  }, [id]);

  if (error) return <p className="text-danger">{error}</p>;
  if (!post) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <article className="card shadow-sm border-0 p-4" style={{ borderRadius: "12px" }}>
        <header className="mb-3">
          <h2 className="fw-bold mb-1">{post.title}</h2>
          <div className="text-muted">
            by {post.creator_name} •{" "}
            {new Date(post.date_created).toLocaleString()}
          </div>
          {post.category && (
            <span className="badge bg-secondary mt-2">{post.category}</span>
          )}
        </header>

        <p style={{ whiteSpace: "pre-line" }}>{post.body}</p>

        <footer className="mt-4">
          <Link to="/posts" className="btn btn-outline-primary">
            ← Back to Posts
          </Link>
        </footer>
      </article>
    </div>
  );
}
