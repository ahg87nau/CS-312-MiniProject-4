import React, { useState } from 'react';
import { api } from '../api';


export default function SignIn({ onSignedIn }) {
const [form, setForm] = useState({ user_id: '', password: '' });
const [error, setError] = useState('');


function update(e) { setForm({ ...form, [e.target.name]: e.target.value }); }


async function submit(e) { e.preventDefault(); setError('');
try {
const r = await api.signin(form);
onSignedIn?.(r.user);
} catch (err) { setError(err.message); }
}


return (
<form className="card" onSubmit={submit}>
<h2>Sign in</h2>
{error && <p className="error">{error}</p>}
<label>User ID<input name="user_id" value={form.user_id} onChange={update} required /></label>
<label>Password<input type="password" name="password" value={form.password} onChange={update} required /></label>
<button className="btn" type="submit">Sign in</button>
</form>
);
}