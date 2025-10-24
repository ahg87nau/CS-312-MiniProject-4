import md5 from "md5";

export class MemoryDAO {
  constructor() {
    this.users = new Map(); // key: user_id
    this.posts = new Map(); // key: blog_id (number)
    this._nextId = 1;

    // seed with a demo user and post
    const demoPwd = md5("password");
    this.users.set("demo", {
      user_id: "demo",
      name: "Demo User",
      password: demoPwd,
      age: 25,
      occupation: "Student",
      city: "San Jose",
    });

    const id = this._nextId++;
    this.posts.set(id, {
      blog_id: id,
      title: "Hi",
      body: "Welcome to Explore & Learn Blog .",
      category: "Other",
      creator_name: "Demo User",
      creator_user_id: "demo",
      date_created: new Date().toISOString(),
    });
  }

  // USERS
  async getUserByIdAndPassword(user_id, passwordHash) {
    const u = this.users.get(user_id);
    if (!u) return null;
    return u.password === passwordHash
      ? { user_id: u.user_id, name: u.name }
      : null;
  }

  async userExists(user_id) {
    return this.users.has(user_id);
  }

  async createUser({ user_id, passwordHash, name, age, occupation, city }) {
    this.users.set(user_id, {
      user_id,
      password: passwordHash,
      name,
      age: age ?? null,
      occupation: occupation ?? null,
      city: city ?? null,
    });
  }

  async updateUser(current_id, { new_user_id, new_passwordHash, new_name, age, occupation, city }) {
    const u = this.users.get(current_id);
    if (!u) return;

    if (new_name) u.name = new_name;
    if (typeof age !== "undefined") u.age = age;
    if (typeof occupation !== "undefined") u.occupation = occupation;
    if (typeof city !== "undefined") u.city = city;
    if (new_passwordHash) u.password = new_passwordHash;

    // propagate id change and (optionally) name
    if (new_user_id && new_user_id !== current_id) {
      this.users.delete(current_id);
      u.user_id = new_user_id;
      this.users.set(new_user_id, u);
      for (const p of this.posts.values()) {
        if (p.creator_user_id === current_id) {
          p.creator_user_id = new_user_id;
          if (new_name) p.creator_name = new_name;
        }
      }
    }
  }

  // POSTS
  async listPosts(category = null) {
    let all = Array.from(this.posts.values());
    if (category) all = all.filter((p) => p.category === category);
    return all.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
  }

  async getPost(id) {
    return this.posts.get(Number(id)) || null;
  }

  async getPostById(id) {
    return this.getPost(id);
  }

  async createPost({ title, body, category, creator_user_id, creator_name }) {
    const id = this._nextId++;
    const post = {
      blog_id: id,
      title,
      body,
      category,
      creator_user_id,
      creator_name,
      date_created: new Date().toISOString(),
    };
    this.posts.set(id, post);
    return post;
  }

  async updatePost(id, { title, body, category }) {
    const p = this.posts.get(Number(id));
    if (!p) return null;
    if (title) p.title = title;
    if (body) p.body = body;
    if (category) p.category = category;
    return p;
  }

  async deletePost(id) {
    this.posts.delete(Number(id));
  }


  async listUserPosts(user_id) {
    return Array.from(this.posts.values()).filter(
      (p) => p.creator_user_id === user_id
    );
  }
}

// properly close the class and export singleton
export const memoryDAO = new MemoryDAO();

