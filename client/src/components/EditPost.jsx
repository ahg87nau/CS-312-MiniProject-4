import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import { CATEGORIES } from "../App";

export default function EditPost() {
  const { id } = useParams();
  const [form, setForm] = useState({ title: "", body: "", category: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .getPost(id)
      .then((p) =>
        setForm({
          title: p.title,
          body: p.body,
          category: p.category || "",
        })
      )
      .catch((err) => setError(err.message));
  }, [id]);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.updatePost(id, form);
      // Redirect to View Posts page after editing
      navigate("/posts");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="card shadow-sm p-4" onSubmit={submit} style={{ borderRadius: "12px" }}>
      <h2 className="mb-3">Edit Post</h2>
      {error && <p className="text-danger">{error}</p>}

      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          name="title"
          className="form-control"
          value={form.title}
          onChange={update}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Body</label>
        <textarea
          name="body"
          className="form-control"
          rows="6"
          value={form.body}
          onChange={update}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Category</label>
        <select
          name="category"
          className="form-select"
          value={form.category}
          onChange={update}
        >
          <option value="">— Select —</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <button className="btn btn-primary" type="submit">
        Save Changes
      </button>
    </form>
  );
}
