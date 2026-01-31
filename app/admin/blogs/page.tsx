import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Blog, { IBlog } from "@/lib/models/Blog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, LogOut } from "lucide-react";
import dayjs from "dayjs";
import DeleteBlogButton from "@/src/components/blogs/DeleteBlogButton"; // Need to create this client component

async function getBlogs() {
  await dbConnect();
  const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(blogs)) as IBlog[];
}

export default async function AdminBlogsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  if (token?.value !== "authenticated") {
    redirect("/admin/login");
  }

  const blogs = await getBlogs();

  return (
    <div className="h-screen w-screen flex flex-col p-16 primary-background" >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          Manage Blogs
        </h1>
        <div className="flex gap-4">
          <Link href="/blogs" target="_blank">
            <Button variant="ghost">View Public Site</Button>
          </Link>
          <Link href="/admin/blogs/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Create New
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-xl shadow-xl secondary-background overflow-hidden border-none custom-text-primary">
        <Table  >
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="custom-text-secondary">
            {blogs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center h-24 text-muted-foreground"
                >
                  No blogs found. Create one!
                </TableCell>
              </TableRow>
            ) : (
              blogs.map((blog) => (
                <TableRow key={String(blog._id)}>
                  <TableCell
                    className="font-medium max-w-[300px] truncate"
                    title={blog.title}
                  >
                    {blog.title}
                  </TableCell>
                  <TableCell>
                    {blog.isPublished ? (
                      <Badge
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {dayjs(blog.createdAt).format("MMM D, YYYY")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 text-muted-foreground hover:text-foreground">
                      <Link href={`/admin/blogs/${blog._id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4 text-blue-500" />
                        </Button>
                      </Link>
                      <DeleteBlogButton id={String(blog._id)} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
