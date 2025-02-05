import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  mobileNumber: String,
  education: String,
});

const resourceCompletedSchema = new mongoose.Schema({
  resource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resource",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const bookmarkSchema = new mongoose.Schema({
  resource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resource",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const resourceSchema = new mongoose.Schema({
  type: String, // yt vid, github repo, website, blog, udemy course, questions(quora, stackoverflow), books, articles
  tags: [String],
  title: String,
  url: String,
  description: String,
  difficulty: String,
  rating: Number,
  reviews: [String],
});

const User = mongoose.model("User", userSchema);
const Resource = mongoose.model("Resource", resourceSchema);
const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
const ResourceCompleted = mongoose.model(
  "ResourceCompleted",
  resourceCompletedSchema
);

resourceSchema.index({
  type: "text",
  tags: "text",
  title: "text",
  url: "text",
  description: "text",
});

export { User, Resource, Bookmark, ResourceCompleted };
