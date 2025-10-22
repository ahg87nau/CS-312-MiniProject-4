import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="hero">
      <h1>Welcome to Explore & Learn Blog</h1>
      <p>
        A community-driven space where ideas, knowledge, and creativity come
        together. Start sharing your thoughts or explore posts from others!
      </p>
      <Link to="/posts" className="btn">
        View All Posts
      </Link>
    </section>
  );
}
