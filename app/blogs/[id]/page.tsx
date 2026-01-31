import dbConnect from "@/lib/db";
import Blog, { IBlog } from "@/lib/models/Blog";
import BlogEditor from "@/src/components/blogs/BlogEditor";
import { notFound } from "next/navigation";
import { CalendarIcon, Clock, Tag } from "lucide-react";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";

interface Props {
  params: Promise<{ id: string }>;
}

async function getBlog(id: string) {
  await dbConnect();
  let blog;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    blog = await Blog.findById(id).lean();
  } else {
    blog = await Blog.findOne({ slug: id }).lean();
  }

  if (!blog || !blog.isPublished) {
    // Admin might want to preview unpublished, but public route should hide it?
    // For now, if found but not published, return null unless maybe query param?
    // Let's hide unpublished for public route.
    if (blog && !blog.isPublished) return null;
  }

  return JSON.parse(JSON.stringify(blog)) as IBlog;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const blog = await getBlog(id);
  if (!blog) return { title: "Blog Not Found" };

  return {
    title: `${blog.title} | Blogs`,
    description: blog.excerpt,
  };
}

export default async function SingleBlogPage({ params }: Props) {
  const { id } = await params;
  const blog = await getBlog(id);

  if (!blog) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl pt-24">
      {/* Header */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-2">
          {blog.tags?.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
          {blog.title}
        </h1>
        <div className="flex items-center gap-6 text-muted-foreground text-sm">
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" />
            <span>{dayjs(blog.createdAt).format("MMMM D, YYYY")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{Math.ceil(blog.content.length / 1000)} min read</span>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {blog.coverImage && (
        <div className="w-full h-[300px] md:h-[400px] overflow-hidden rounded-xl mb-10 shadow-lg relative">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content - Using Editor in read-only mode */}
      <div className="prose-container">
        <BlogEditor content={blog.content} editable={false} />
      </div>
    </div>
  );
}
