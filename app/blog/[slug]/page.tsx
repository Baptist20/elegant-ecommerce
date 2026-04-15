import { notFound } from "next/navigation";
import Image from "next/image";
import { Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { poppins, inter } from "@/app/utils/font";
import connectDB from "@/lib/db";
import { Blog } from "@/models/Blog";
import { BlogCategory } from "@/models/BlogCategory";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getBlogBySlug(slug: string) {
  await connectDB();

  const blog = await Blog.findOne({ slug })
    .populate({
      path: "category",
      select: "name slug",
    })
    .lean();

  if (!blog) {
    return null;
  }

  // Convert MongoDB ObjectId to string
  return JSON.parse(JSON.stringify(blog));
}

export async function generateMetadata({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: `${blog.title} | Elegant Stores`,
    description: blog.content.substring(0, 160),
    openGraph: {
      title: blog.title,
      description: blog.content.substring(0, 160),
      images: blog.thumbnail ? [blog.thumbnail] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Back Navigation */}
      <div className="border-b border-gray-100">
        <div className="max-w-[1120px] mx-auto px-4 md:px-8 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className={`${inter.className} text-sm font-medium`}>
              Back to Blog
            </span>
          </Link>
        </div>
      </div>

      {/* Blog Content */}
      <article className="max-w-[1120px] mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header */}
        <header className="mb-8 md:mb-12">
          {/* Category */}
          {blog.category && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {(blog.category as { name: string }).name}
              </span>
            </div>
          )}

          {/* Title */}
          <h1
            className={`${poppins.className} text-3xl md:text-4xl lg:text-5xl font-medium text-[#141718] mb-6`}
          >
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className={`${inter.className} text-sm`}>
                {formattedDate}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className={`${inter.className} text-sm`}>
                {blog.author || "Admin"}
              </span>
            </div>
          </div>
        </header>

        {/* Thumbnail Image */}
        {blog.thumbnail && (
          <div className="relative w-full h-[200px] md:h-[280px] lg:h-[350px] mb-8 md:mb-12 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={blog.thumbnail}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div
            className={`${inter.className} text-gray-700 leading-relaxed`}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className={`${poppins.className} text-lg font-medium mb-4`}>
            Share this article
          </h3>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-[#141718] text-white rounded-lg hover:bg-black transition-colors">
              Share on Twitter
            </button>
            <button className="px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition-colors">
              Share on Facebook
            </button>
            <button className="px-4 py-2 bg-[#0077B5] text-white rounded-lg hover:bg-[#006699] transition-colors">
              Share on LinkedIn
            </button>
          </div>
        </div>
      </article>

      {/* Related Articles Section */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-[1120px] mx-auto px-4 md:px-8">
          <h2
            className={`${poppins.className} text-2xl md:text-3xl font-medium text-[#141718] mb-8`}
          >
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* This would be populated with related blogs */}
            <div className="text-center py-8 text-gray-500">
              <p className={`${inter.className}`}>
                Related articles would appear here
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link
              href="/blog"
              className={`inline-flex items-center gap-2 ${inter.className} font-medium text-[#141718] hover:text-black transition-colors`}
            >
              View all articles
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
