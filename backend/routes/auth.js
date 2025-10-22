import express from 'express';
import md5 from 'md5';


export function makeAuthRouter(dao) {
const router = express.Router();


router.post('/signup', async (req, res) => {
const { user_id, password, name, age, occupation, city } = req.body;
if (!user_id || !password || !name) return res.status(400).json({ error: 'user_id, password, name are required' });


if (await dao.userExists(user_id)) return res.status(409).json({ error: 'User ID already taken' });


await dao.createUser({ user_id, passwordHash: md5(password), name, age, occupation, city });
return res.json({ ok: true });
});


router.post('/signin', async (req, res) => {
const { user_id, password } = req.body;
const user = await dao.getUserByIdAndPassword(user_id, md5(password));
if (!user) return res.status(401).json({ error: 'Invalid credentials' });


req.session.user = user; // { user_id, name }
return res.json({ ok: true, user });
});


router.get('/me', async (req, res) => {
if (!req.session.user) return res.status(401).json({ user: null });
const profile = await dao.getUserProfile(req.session.user.user_id);
return res.json({ user: profile });
});


router.post('/logout', (req, res) => {
req.session.destroy(() => res.json({ ok: true }));
});


router.post('/account', async (req, res) => {
if (!req.session.user) return res.status(401).json({ error: 'Not signed in' });
const { new_user_id, new_password, new_name, age, occupation, city } = req.body;
const current_id = req.session.user.user_id;


if (new_user_id && new_user_id !== current_id) {
if (await dao.userExists(new_user_id)) return res.status(409).json({ error: 'User ID already taken' });
}


const updated = await dao.updateUser(current_id, {
new_user_id,
new_passwordHash: new_password ? md5(new_password) : null,
new_name,
age, occupation, city
});


if (updated) req.session.user = { user_id: updated.user_id, name: updated.name };


return res.json({ ok: true, user: updated });
});


return router;
}