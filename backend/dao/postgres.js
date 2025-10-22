import { Pool } from "pg";
import md5 from "md5";

export class PostgresDAO {
  /** @param {Pool} pool */
  constructor(pool) {
    this.pool = pool;
  }

  // ========== USERS ==========

  async getUserByIdAndPassword(user_id, passwordHash) {
    const { rows } = await this.pool.query(
      "SELECT user_id, name, age, occupation, city FROM users WHERE user_id=$1 AND password=$2",
      [user_id, passwordHash]
    );
    return rows[0] || null;
  }

  async userExists(user_id) {
    const { rows } = await this.pool.query(
      "SELECT 1 FROM users WHERE user_id=$1",
      [user_id]
    );
    return rows.length > 0;
  }

  async createUser({ user_id, passwordHash, name, age, occupation, city }) {
    await this.pool.query(
      "INSERT INTO users (user_id, password, name, age, occupation, city) VALUES ($1,$2,$3,$4,$5,$6)",
      [user_id, passwordHash, name, age || null, occupation || null, city || null]
    );
  }

  async updateUser(current_id, { new_user_id, new_passwordHash, new_name, age, occupation, city }) {
    const updates = [];
    const params = [];

    if (new_name) {
      updates.push(`name=$${updates.length + 1}`);
      params.push(new_name);
    }
    if (typeof age !== "undefined") {
      updates.push(`age=$${updates.length + 1}`);
      params.push(age);
    }
    if (typeof occupation !== "undefined") {
      updates.push(`occupation=$${updates.length + 1}`);
      params.push(occupation);
    }
    if (typeof city !== "undefined") {
      updates.push(`city=$${updates.length + 1}`);
      params.push(city);
    }
    if (new_passwordHash) {
      updates.push(`password=$${updates.length + 1}`);
      params.push(new_passwordHash);
    }

    if (updates.length) {
      params.push(current_id);
      await this.pool.query(
        `UPDATE users SET ${updates.join(", ")} WHERE user_id=$${updates.length + 1}`,
        params
      );
    }

    if (new_user_id && new_user_id !== current_id) {
      await this.pool.query(
        "UPDATE blogs SET creator_user_id=$1, creator_name=COALESCE($2, creator_name) WHERE creator_user_id=$3",
        [new_user_id, new_name || null, current_id]
      );
      await this.pool.query("UPDATE users SET user_id=$1 WHERE user_id=$2", [
        new_user_id,
        current_id,
      ]);
    }

    const { rows } = await this.pool.query(
      "SELECT user_id, name, age, occupation, city FROM users WHERE user_id=$1",
      [new_user_id || current_id]
    );
    return rows[0] || null;
  }

  async getUserProfile(user_id) {
    const { rows } = await this.pool.query(
      "SELECT user_id, name, age, occupation, city FROM users WHERE user_id=$1",
      [user_id]
    );
    return rows[0] || null;
  }

  // ========== POSTS ==========

  async listPosts(category = "") {
    const sql = `
      SELECT blog_id, title, body, category, creator_name, creator_user_id, date_created
      FROM blogs
      ${category ? "WHERE category=$1" : ""}
      ORDER BY date_created DESC
    `;
    const params = category ? [category] : [];
    const { rows } = await this.pool.query(sql, params);
    return rows;
  }

  async getPostById(id) {
    const { rows } = await this.pool.query(
      "SELECT blog_id, title, body, category, creator_name, creator_user_id, date_created FROM blogs WHERE blog_id=$1",
      [id]
    );
    return rows[0] || null;
  }

  async createPost({ title, body, category, creator_user_id, creator_name }) {
    await this.pool.query(
      "INSERT INTO blogs (title, body, category, creator_user_id, creator_name) VALUES ($1,$2,$3,$4,$5)",
      [title, body, category || null, creator_user_id, creator_name]
    );
  }

  async updatePost(id, { title, body, category, user_id }) {
    // Ensure ownership
    const { rows: ownerCheck } = await this.pool.query(
      "SELECT creator_user_id FROM blogs WHERE blog_id=$1",
      [id]
    );
    if (!ownerCheck.length)
      throw new Error("Post not found");
    if (ownerCheck[0].creator_user_id !== user_id)
      throw new Error("Forbidden");

    await this.pool.query(
      "UPDATE blogs SET title=$1, body=$2, category=$3 WHERE blog_id=$4",
      [title, body, category || null, id]
    );
  }

  async deletePost(id, user_id) {
    const { rows } = await this.pool.query(
      "SELECT creator_user_id FROM blogs WHERE blog_id=$1",
      [id]
    );
    if (!rows.length)
      throw new Error("Post not found");
    if (rows[0].creator_user_id !== user_id)
      throw new Error("Forbidden");
    await this.pool.query("DELETE FROM blogs WHERE blog_id=$1", [id]);
  }

  async listPostsByUser(user_id) {
    const { rows } = await this.pool.query(
      "SELECT * FROM blogs WHERE creator_user_id=$1 ORDER BY date_created DESC",
      [user_id]
    );
    return rows;
  }
}
