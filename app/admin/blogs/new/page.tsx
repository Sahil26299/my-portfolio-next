import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import BlogForm from "@/src/components/blogs/BlogForm";

export default async function NewBlogPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  if (token?.value !== "authenticated") {
    redirect("/admin/login");
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <BlogForm />
    </div>
  );
}
