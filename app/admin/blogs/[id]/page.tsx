import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Blog, { IBlog } from "@/lib/models/Blog";
import BlogForm from "@/src/components/blogs/BlogForm";

interface Props {
  params: Promise<{ id: string }>;
}

async function getBlog(id: string) {
  await dbConnect();
  const blog = await Blog.findById(id).lean();
  return JSON.parse(JSON.stringify(blog)) as IBlog;
}

export default async function EditBlogPage({ params }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  if (token?.value !== "authenticated") {
    redirect("/admin/login");
  }

  const { id } = await params;
  const blog = await getBlog(id);

  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <BlogForm initialData={blog} isEditing={true} />
    </div>
  );
}
