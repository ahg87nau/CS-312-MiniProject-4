import express from "express";

function requireAuth(req, res, next) {
  if (!req.session.user)
    return res.status(401).json({ error: "Not signed in" });
  next();
}

export function makePostsRouter(dao) {
  const router = express.Router();

  // Get all posts (optional category filter)
  router.get("/", async (req, res) => {
    try {
      const { category } = req.query;
      const posts = await dao.listPosts(category);
      return res.json(posts);
    } catch (err) {
      console.error("Error listing posts:", err);
      res.status(500).json({ error: "Failed to list posts" });
    }
  });

  // Create new post
  router.post("/", requireAuth, async (req, res) => {
    try {
      const { title, body, category } = req.body;
      if (!title || !body)
        return res
          .status(400)
          .json({ error: "title and body are required" });

      const { user_id, name } = req.session.user;
      const post = await dao.createPost({
        creator_user_id: user_id,
        creator_name: name,
        title: title.trim(),
        body: body.trim(),
        category,
      });

      return res.status(201).json(post);
    } catch (err) {
      console.error("Error creating post:", err);
      res.status(500).json({ error: "Failed to create post" });
    }
  });

  // Get single post by ID
  router.get("/:id", async (req, res) => {
    try {
      const post = await dao.getPostById(req.params.id);
      if (!post) return res.status(404).json({ error: "Not found" });
      return res.json(post);
    } catch (err) {
      console.error("Error fetching post:", err);
      res.status(500).json({ error: "Failed to fetch post" });
    }
  });

  // Edit post
  router.put("/:id", requireAuth, async (req, res) => {
    try {
      const post = await dao.getPostById(req.params.id);
      if (!post) return res.status(404).json({ error: "Not found" });
      if (post.creator_user_id !== req.session.user.user_id)
        return res.status(403).json({ error: "Forbidden" });

      const updated = await dao.updatePost(req.params.id, req.body);
      return res.json(updated);
    } catch (err) {
      console.error("Error updating post:", err);
      res.status(500).json({ error: "Failed to update post" });
    }
  });

  // Delete post
  router.delete("/:id", requireAuth, async (req, res) => {
    try {
      const post = await dao.getPostById(req.params.id); 
      if (!post) return res.status(404).json({ error: "Not found" });
      if (post.creator_user_id !== req.session.user.user_id)
        return res.status(403).json({ error: "Forbidden" });

      await dao.deletePost(req.params.id);
      return res.json({ ok: true });
    } catch (err) {
      console.error("Error deleting post:", err);
      res.status(500).json({ error: "Failed to delete post" });
    }
  });

  // List posts created by the current user
  router.get("/by/me/all", requireAuth, async (req, res) => {
    try {
      const posts = await dao.listUserPosts(req.session.user.user_id);
      return res.json(posts);
    } catch (err) {
      console.error("Error listing user's posts:", err);
      res.status(500).json({ error: "Failed to list user posts" });
    }
  });

  return router;
}
