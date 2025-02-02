import mongoose from "mongoose";

const Schema = mongoose.Schema;
const blogSchema = new Schema(
  {
    title: { type: String, require: true },
    content: { type: String, require: true },
    imageURL: { type: String, require: true },
    owner: { type: String, default: "Admin" },
    categories: [
      {
        type: String,
        enum: ["Sağlık", "Mezoterapi", "Teknoloji"],
      },
    ],
    tags: { type: [String] },
    likes: { type: Number, default: 0 },
    comments: [
      {
        content: String,
        date: Date,
        name: String,
        email: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
