"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Loader2,
  X,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  } | null;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogCategory {
  _id: string;
  name: string;
  slug: string;
}

interface BlogFormData {
  title: string;
  content: string;
  author: string;
  category: string;
  thumbnail: File | null;
  thumbnailPreview: string;
}

export default function AdminBlogsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingBlogs, setIsFetchingBlogs] = useState(false);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogCategories, setBlogCategories] = useState<BlogCategory[]>([]);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [deleteBlogId, setDeleteBlogId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    content: "",
    author: "Admin",
    category: "",
    thumbnail: null,
    thumbnailPreview: "",
  });

  // Fetch blogs and categories on component mount
  useEffect(() => {
    fetchBlogs();
    fetchBlogCategories();
  }, []);

  const fetchBlogs = async () => {
    try {
      setIsFetchingBlogs(true);
      const response = await fetch("/api/blogs");
      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to load blogs");
    } finally {
      setIsFetchingBlogs(false);
    }
  };

  const fetchBlogCategories = async () => {
    try {
      setIsFetchingCategories(true);
      const response = await fetch("/api/blog-categories");
      if (!response.ok) {
        throw new Error("Failed to fetch blog categories");
      }
      const data = await response.json();
      setBlogCategories(data);
    } catch (error) {
      console.error("Error fetching blog categories:", error);
      toast.error("Failed to load blog categories");
    } finally {
      setIsFetchingCategories(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleInputChange = (field: keyof BlogFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      // Create preview URL
      const preview = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });

      setFormData((prev) => ({
        ...prev,
        thumbnail: file,
        thumbnailPreview: preview,
      }));
    }
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.title.trim()) {
      toast.error("Blog title is required");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Blog content is required");
      return;
    }

    if (!formData.thumbnail && !editingBlog) {
      toast.error("Blog thumbnail image is required");
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("author", formData.author);
      formDataToSend.append("category", formData.category);

      if (editingBlog) {
        formDataToSend.append("id", editingBlog._id);
      }

      // Append thumbnail file if provided
      if (formData.thumbnail) {
        formDataToSend.append("thumbnail", formData.thumbnail);
      }

      const url = "/api/blogs";
      const method = editingBlog ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Failed to save blog");
        return;
      }

      toast.success(
        editingBlog
          ? "Blog updated successfully!"
          : "Blog created successfully!",
      );

      // Refresh blogs and reset form
      fetchBlogs();
      resetForm();
      setIsModalOpen(false);
      setEditingBlog(null);
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save blog",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      author: blog.author,
      category: blog.category?._id || "",
      thumbnail: null,
      thumbnailPreview: blog.thumbnail || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteBlogId) return;

    try {
      const response = await fetch(`/api/blogs?id=${deleteBlogId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to delete blog");
      }

      toast.success("Blog deleted successfully!");
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete blog",
      );
    } finally {
      setDeleteBlogId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      author: "Admin",
      category: "",
      thumbnail: null,
      thumbnailPreview: "",
    });
    setEditingBlog(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeThumbnail = () => {
    setFormData((prev) => ({
      ...prev,
      thumbnail: null,
      thumbnailPreview: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-2">
            Manage your blog content and articles
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {blogs.length} blog post{blogs.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Blogs Grid */}
      {isFetchingBlogs ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Loading blog posts...</span>
        </div>
      ) : blogs.length === 0 ? (
        <div className="bg-white rounded-lg border p-8 text-center">
          <p className="text-gray-600">No blog posts yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Click the + button to add your first blog post
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Blog Thumbnail */}
              <div className="aspect-video bg-gray-100 overflow-hidden">
                {blog.thumbnail ? (
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Eye className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Blog Info */}
              <div className="p-4">
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {blog.category?.name || "Uncategorized"}
                  </span>
                </div>

                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                  {blog.title}
                </h3>

                <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                  {blog.content.substring(0, 150)}...
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    <span>{blog.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {blog.content.length > 300 ? "Long read" : "Quick read"}
                  </span>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(blog)}
                      className="h-8 px-3"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteBlogId(blog._id)}
                      className="h-8 px-3"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hover Plus Icon Button */}
      <Button
        onClick={() => {
          resetForm();
          setIsModalOpen(true);
        }}
        size="icon-lg"
        className="group fixed right-8 bottom-8 rounded-full bg-[#141718] text-white shadow-lg hover:bg-black transition-all duration-200"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <Plus className="size-5" />
        )}
        <span className="pointer-events-none absolute right-14 rounded-md bg-[#141718] px-3 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
          Add a new blog post
        </span>
      </Button>

      {/* Add/Edit Blog Modal */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingBlog ? "Edit Blog Post" : "Add New Blog Post"}
            </DialogTitle>
            <DialogDescription>
              {editingBlog
                ? "Update blog post information."
                : "Fill in the blog post information to add a new article."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#141718]">
                Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="10 Home Decor Tips for Modern Living"
                disabled={isLoading}
              />
            </div>

            {/* Author */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#141718]">
                Author
              </label>
              <Input
                value={formData.author}
                onChange={(e) => handleInputChange("author", e.target.value)}
                placeholder="Admin"
                disabled={isLoading}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#141718]">
                Category (optional)
              </label>
              <Select
                value={formData.category || "no-category"}
                onValueChange={(value) =>
                  handleInputChange(
                    "category",
                    value === "no-category" ? "" : value,
                  )
                }
                disabled={isLoading || isFetchingCategories}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-category">
                    <span className="text-gray-400">No category</span>
                  </SelectItem>
                  {isFetchingCategories ? (
                    <SelectItem value="loading" disabled>
                      Loading categories...
                    </SelectItem>
                  ) : blogCategories.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No categories found
                    </SelectItem>
                  ) : (
                    blogCategories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Manage categories in the{" "}
                <a
                  href="/admin/categories"
                  className="text-blue-600 hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open("/admin/categories", "_blank");
                  }}
                >
                  Categories section
                </a>
              </p>
            </div>

            {/* Thumbnail */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#141718]">
                  Thumbnail Image {!editingBlog && "*"}
                </label>
                {formData.thumbnailPreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeThumbnail}
                    className="h-6 px-2 text-xs"
                  >
                    Remove
                  </Button>
                )}
              </div>

              {!formData.thumbnailPreview ? (
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#141718] file:text-white hover:file:bg-black"
                  disabled={isLoading}
                />
              ) : (
                <div className="relative">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={formData.thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeThumbnail}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              <p className="text-xs text-gray-500">
                Recommended size: 800x450px (JPG, PNG, WebP, max 5MB)
              </p>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#141718]">
                Content *
              </label>
              <Textarea
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Write your blog content here..."
                rows={8}
                disabled={isLoading}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                {formData.content.length} characters
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingBlog ? "Updating..." : "Creating..."}
                </>
              ) : editingBlog ? (
                "Update Blog"
              ) : (
                "Add Blog"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteBlogId}
        onOpenChange={(open) => !open && setDeleteBlogId(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this blog post? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteBlogId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Blog
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
