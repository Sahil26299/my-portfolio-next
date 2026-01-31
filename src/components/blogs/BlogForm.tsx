"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, X, ImageIcon } from "lucide-react";
import BlogEditor from "./BlogEditor";
import { IBlog } from "@/lib/models/Blog";

interface BlogFormProps {
  initialData?: Partial<IBlog>;
  isEditing?: boolean;
}

export default function BlogForm({
  initialData,
  isEditing = false,
}: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form States
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [isPublished, setIsPublished] = useState(
    initialData?.isPublished || false
  );

  // Auto-generate slug from title if creating new
  useEffect(() => {
    if (!isEditing && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
  }, [title, isEditing]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const blogData = {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      tags,
      isPublished,
    };

    try {
      const url =
        isEditing && initialData?._id
          ? `/api/blogs/${initialData._id}`
          : "/api/blogs";

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin/blogs");
        router.refresh();
      } else {
        alert(data.error || "Failed to save blog");
      }
    } catch (error) {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-center sticky top-20 z-10 bg-bg-primary/80 backdrop-blur-md p-4 rounded-xl shadow-lg border-none">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          {isEditing ? "Edit Blog" : "Create New Blog"}
        </h1>
        <div className="flex gap-4">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="gap-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 shadow-md border-none text-white"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isEditing ? "Update" : "Publish/Save"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <Label className="text-lg font-semibold text-content">Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              required
              className="text-lg font-medium border-none shadow-md secondary-background focus-visible:ring-purple-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-lg font-semibold text-content">
              Content (Tiptap Editor)
            </Label>
            <BlogEditor content={content} onChange={setContent} />
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <Card className="border-none shadow-xl secondary-background">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="published" className="text-lg font-semibold">
                  Published
                </Label>
                <Switch
                  id="published"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label className="font-semibold">Slug</Label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="url-friendly-slug"
              required
              className="border-none shadow-md secondary-background focus-visible:ring-purple-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Excerpt</Label>
            <Textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short summary for SEO and cards"
              className="min-h-[100px] border-none shadow-md secondary-background focus-visible:ring-purple-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Cover Image URL</Label>
            <div className="flex gap-2">
              <Input
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
                className="border-none shadow-md secondary-background focus-visible:ring-purple-500"
              />
            </div>
            {coverImage && (
              <div className="mt-2 rounded-xl overflow-hidden shadow-lg aspect-video relative">
                <img
                  src={coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Tags</Label>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Press Enter to add tag"
              className="border-none shadow-md secondary-background focus-visible:ring-purple-500"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => removeTag(tag)}
                >
                  {tag} <X className="w-3 h-3" />
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
