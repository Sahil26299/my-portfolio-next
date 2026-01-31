import dbConnect from "@/lib/db";
import Blog, { IBlog } from "@/lib/models/Blog";
import BlogCard from "@/src/components/blogs/BlogCard";

export const revalidate = 60; // Revalidate every minute

async function getBlogs() {
  await dbConnect();
  // Lean query for performance, sorting by newest
  const blogs = await Blog.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(blogs)) as IBlog[];
}

export default async function BlogsPage() {
  const blogs = await getBlogs();
console.log(blogs,'blogs');

  return (
    <div className="primary-background flex flex-col flex-1">
      <div className="flex flex-col items-center my-6 text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-16 bg-gradient-to-r from-blue to-purple bg-clip-text text-transparent">
          My Blogs
        </h1>
        <p className="custom-text-primary max-w-2xl">
          Thoughts, tutorials, and insights on software development, design, and
          technology.
        </p>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-md italic custom-text-secondary">
            No blogs published yet. Stay tuned!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs?.map((blog) => (
            <BlogCard key={blog._id as any} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}
