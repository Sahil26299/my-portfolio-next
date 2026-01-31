import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML content from Tiptap
  coverImage?: string;
  tags: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title for this blog."],
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    slug: {
      type: String,
      required: [true, "Please provide a slug for this blog."],
      unique: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      required: [true, "Please provide an excerpt for this blog."],
      maxlength: [300, "Excerpt cannot be more than 300 characters"],
    },
    content: {
      type: String,
      required: [true, "Please provide content for this blog."],
    },
    coverImage: {
      type: String,
    },
    tags: {
      type: [String],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Check if model already exists to prevent overwrite error during HMR
const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
