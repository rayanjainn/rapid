import express from "express";
import connectDB from "./db";
import cors from "cors";
import jwt from "jsonwebtoken";
import { User, Resource, Bookmark, ResourceCompleted } from "./db/schema";
import { signupSchema, loginSchema } from "./types";
import { auth } from "./middlewares/auth";
import dotenv from "dotenv";

dotenv.config();
const app = express();

connectDB();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/signup", async (req, res) => {
  const user = signupSchema.safeParse(req.body);
  if (!user.success) {
    res.status(400).json({ message: user.error });
    return;
  }
  try {
    await User.create(user.data);
    res.status(200).json({ message: "User created successfully" });
    return;
  } catch (error) {
    res.status(500).json({ message: error });
    return;
  }
});

app.post("/api/login", async (req, res) => {
  const user = loginSchema.safeParse(req.body);
  if (!user.success) {
    res.status(400).json({ message: user.error });
    return;
  }
  try {
    const dbuser = await User.findOne({ email: user.data.email });
    if (!dbuser) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (dbuser.password !== user.data.password) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }
    console.log(dbuser);
    const token = jwt.sign(
      dbuser._id.toString(),
      process.env.JWT_SECRET as string
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error });
    return;
  }
});

app.post("/api/resource", async (req, res) => {
  const resource = req.body;
  try {
    const newResource = await Resource.create(resource);
    res.json(newResource);
    return;
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.get("/api/allresources", auth, async (req, res) => {
  try {
    const resources = await Resource.find({});
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.get("/api/:search", auth, async (req, res) => {
  const search = req.params.search;
  try {
    const resources = await Resource.find({ $text: { $search: search } });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.get("/api/bookmarks", auth, async (req, res) => {
  const userId = req.userId;
  try {
    const bookmarks = await Bookmark.find({ user: userId });
    const bookmarkedResources = await Resource.find({
      _id: { $in: bookmarks },
    });
    res.json(bookmarkedResources);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.post("/api/bookmark/:resource", auth, async (req, res) => {
  const resourceId = req.params.resource;
  const userId = req.userId;
  try {
    const bookmark = await Bookmark.findOne({
      resource: resourceId,
      user: userId,
    });
    if (bookmark) {
      res.status(400).json({ message: "Already bookmarked" });
      return;
    }
    //add bookmark
    const newBookmark = await Bookmark.create({
      resource: resourceId,
      user: userId,
    });
    res.json(newBookmark);
    return;
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.delete("/api/bookmark/:resource", auth, async (req, res) => {
  const resourceId = req.params.resource;
  const userId = req.userId;
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      resource: resourceId,
      user: userId,
    });
    if (!bookmark) {
      res.status(404).json({ message: "Bookmark not found" });
      return;
    }
    res.json(bookmark);
    return;
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.post("/api/complete/:resource", auth, async (req, res) => {
  const resourceId = req.params.resource;
  const userId = req.userId;
  try {
    const completed = await ResourceCompleted.findOne({
      resource: resourceId,
      user: userId,
    });
    if (completed) {
      res.status(400).json({ message: "Already completed" });
      return;
    }
    const newCompleted = await ResourceCompleted.create({
      resource: resourceId,
      user: userId,
    });
    res.json(newCompleted);
    return;
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.get("/api/completed", auth, async (req, res) => {
  const userId = req.userId;
  try {
    const completed = await ResourceCompleted.find({ user: userId });
    res.json(completed);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.post("/api/rate/:resource", auth, (req, res) => {
  const resourceId = req.params.resource;
  const userId = req.userId;
  try {
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.post("/api/review/:resource", auth, (req, res) => {});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
