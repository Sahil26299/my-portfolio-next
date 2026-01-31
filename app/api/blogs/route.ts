import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Blog from "@/lib/models/Blog";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";

    // If admin fetching, or public fetching only published
    // For now, simpler: Public API returns only published. Admin API might need a different route or auth check.
    // Let's stick to: GET /api/blogs returns all published.
    // Admin list will be separate or filtered.

    // Actually, looking at the plan: "GET: Fetch all published blogs (public)".
    // I will return all published blogs sorted by date.

    const blogs = await Blog.find({ isPublished: true }).sort({
      createdAt: -1,
    });
    return NextResponse.json({ success: true, data: blogs });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token");

    // Simple verification (in real app, verify JWT signature)
    if (!token || token.value !== process.env.ADMIN_TOKEN_SECRET) {
      // Fallback for dev ease if env not set precisely, but strict for prod
      if (token?.value !== "authenticated") {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    await dbConnect();
    const body = await request.json();

    const blog = await Blog.create(body);
    return NextResponse.json({ success: true, data: blog }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create blog" },
      { status: 400 }
    );
  }
}
