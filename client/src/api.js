const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';


async function j(method, url, data) {
const res = await fetch(BASE + url, {
method,
headers: { 'Content-Type': 'application/json' },
credentials: 'include', // send/receive session cookie
body: data ? JSON.stringify(data) : undefined
});
const ct = res.headers.get('content-type') || '';
const body = ct.includes('application/json') ? await res.json() : await res.text();
if (!res.ok) throw new Error(body?.error || String(body));
return body;
}


export const api = {
// auth
signup: (payload) => j('POST', '/auth/signup', payload),
signin: (payload) => j('POST', '/auth/signin', payload),
me: () => j('GET', '/auth/me'),
logout: () => j('POST', '/auth/logout'),
updateAccount: (payload) => j('POST', '/auth/account', payload),


// posts
listPosts: (q = '') => j('GET', `/posts${q}`),
getPost: (id) => j('GET', `/posts/${id}`),
createPost: (payload) => j('POST', '/posts', payload),
updatePost: (id, payload) => j('PUT', `/posts/${id}`, payload),
deletePost: (id) => j('DELETE', `/posts/${id}`),
myPosts: () => j('GET', '/posts/by/me/all')
};