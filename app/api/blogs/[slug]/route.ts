import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Blog } from "@/models/Blog";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

// GET: Get single blog by slug
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        { error: "Blog slug is required" },
        { status: 400 },
      );
    }

    const blog = await Blog.findOne({ slug }).populate({
      path: "category",
      select: "name slug",
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 },
    );
  }
}

// PUT: Update blog by slug
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        { error: "Blog slug is required" },
        { status: 400 },
      );
    }

    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const body = await request.json();
    const { title, content, author, category } = body;

    // Update blog fields
    if (title) blog.title = title;
    if (content) blog.content = content;
    if (author) blog.author = author;
    if (category) blog.category = category;

    await blog.save();

    // Populate category details
    await blog.populate({
      path: "category",
      select: "name slug",
    });

    return NextResponse.json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 },
    );
  }
}

// DELETE: Delete blog by slug
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        { error: "Blog slug is required" },
        { status: 400 },
      );
    }

    const blog = await Blog.findOneAndDelete({ slug });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 },
    );
  }
}
