import React, { useState } from 'react';
import { api } from '../api';


export default function SignUp({ onSignedUp }) {
const [form, setForm] = useState({ user_id: '', password: '', name: '', age: '', occupation: '', city: '' });
const [error, setError] = useState('');


function update(e) { setForm({ ...form, [e.target.name]: e.target.value }); }


async function submit(e) {
e.preventDefault(); setError('');
try {
await api.signup({ ...form, age: form.age ? Number(form.age) : undefined });
onSignedUp?.();
} catch (err) { setError(err.message); }
}


return (
<form className="card" onSubmit={submit}>
<h2>Create an account</h2>
{error && <p className="error">{error}</p>}
<label>User ID<input name="user_id" value={form.user_id} onChange={update} required /></label>
<label>Password<input type="password" name="password" value={form.password} onChange={update} required /></label>
<label>Name<input name="name" value={form.name} onChange={update} required /></label>
<div className="grid2">
<label>Age<input name="age" value={form.age} onChange={update} /></label>
<label>Occupation<input name="occupation" value={form.occupation} onChange={update} /></label>
</div>
<label>City<input name="city" value={form.city} onChange={update} /></label>
<button className="btn" type="submit">Sign up</button>
</form>
);
}