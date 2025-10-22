import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function Profile({ user, setUser }) {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({
    new_user_id: user?.user_id || "",
    new_name: user?.name || "",
    age: user?.age || "",
    occupation: user?.occupation || "",
    city: user?.city || "",
  });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    // load profile info
    api
      .me()
      .then((r) => {
        const u = r.user || {};
        setForm({
          new_user_id: u.user_id || "",
          new_name: u.name || "",
          age: u.age || "",
          occupation: u.occupation || "",
          city: u.city || "",
        });
      })
      .catch(() => {});
    // load user posts
    api.myPosts().then(setPosts).catch(() => {});
  }, []);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function save(e) {
    e.preventDefault();
    setErr("");
    setMsg("");
    try {
      const r = await api.updateAccount({
        ...form,
        age: form.age ? Number(form.age) : undefined,
      });
      setMsg("Saved successfully");
      setUser?.(r.user);
    } catch (error) {
      setErr(error.message);
    }
  }

  // return statement inside the component function
  return (
    <div className="grid2">
      <form className="card" onSubmit={save}>
        <h2>My Profile</h2>
        {msg && <p className="ok">{msg}</p>}
        {err && <p className="error">{err}</p>}
        <label>
          Username (user_id)
          <input
            name="new_user_id"
            value={form.new_user_id}
            onChange={update}
          />
        </label>
        <label>
          Name
          <input name="new_name" value={form.new_name} onChange={update} />
        </label>
        <label>
          New Password
          <input type="password" name="new_password" onChange={update} />
        </label>
        <div className="grid2">
          <label>
            Age
            <input name="age" value={form.age} onChange={update} />
          </label>
          <label>
            Occupation
            <input
              name="occupation"
              value={form.occupation}
              onChange={update}
            />
          </label>
        </div>
        <label>
          City
          <input name="city" value={form.city} onChange={update} />
        </label>
        <button className="btn" type="submit">
          Save
        </button>
      </form>

      <div>
        <h2>My Posts ({posts.length})</h2>
        <div className="list">
          {posts.map((p) => (
            <article className="post" key={p.blog_id}>
              <header>
                <h3>{p.title}</h3>
                <small>{new Date(p.date_created).toLocaleString()}</small>
              </header>
              <p>{p.body}</p>
              <footer>
                <span className="tag">{p.category || "Uncategorized"}</span>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
