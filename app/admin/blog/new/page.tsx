"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, UploadCloud } from "lucide-react";
import Link from "next/link";
import { useCreateBlogMutation } from "@/store/slice/apiSlice";

const categories = [
  "Packaging",
  "Shipping Guide",
  "Customs",
  "Tutorial",
  "Insurance",
  "Pricing",
];

interface FormData {
  Title: string;
  Category: string;
  Author: string;
  Excerpt: string;
  Content: string;
  ReadTime: string;
  Date: string;
  Image: File | null;
}

export default function NewBlogArticlePage() {
  const [createBlog, { isLoading }] = useCreateBlogMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    Title: "",
    Category: "Shipping Guide",
    Author: "",
    Excerpt: "",
    Content: "",
    ReadTime: "",
    Date: new Date().toISOString(),
    Image: null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, Image: file }));
    setErrors((prev) => ({ ...prev, Image: "" }));
    setImagePreview(URL.createObjectURL(file));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.Title.trim()) newErrors.Title = "Title is required";
    if (!formData.Author.trim()) newErrors.Author = "Author is required";
    if (!formData.Excerpt.trim()) newErrors.Excerpt = "Excerpt is required";
    if (!formData.Content.trim()) newErrors.Content = "Content is required";
    if (!formData.ReadTime.trim()) newErrors.ReadTime = "Read time is required";
    if (!formData.Image) newErrors.Image = "Featured image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || !formData.Image) return;

    try {
      await createBlog({
        Title: formData.Title,
        Category: formData.Category,
        Author: formData.Author,
        Excerpt: formData.Excerpt,
        Content: formData.Content,
        ReadTime: formData.ReadTime,
        Date: formData.Date,
        Image: formData.Image,
      }).unwrap();

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
    } catch {
      // error handled in the mutation's onQueryStarted
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/blog">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Create New Article
          </h1>
          <p className="text-foreground/70 mt-1">
            Write and publish a new blog article
          </p>
        </div>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <p className="text-green-800">Article saved successfully!</p>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Article Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Title
                </label>
                <Input
                  type="text"
                  name="Title"
                  value={formData.Title}
                  onChange={handleChange}
                  placeholder="Enter article title"
                  className="h-11"
                />
                {errors.Title && (
                  <p className="text-xs text-red-500 mt-1">{errors.Title}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category
                  </label>
                  <select
                    name="Category"
                    value={formData.Category}
                    onChange={handleChange}
                    className="w-full h-11 px-3 py-2 rounded-lg border border-border bg-white text-foreground"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Author
                  </label>
                  <Input
                    type="text"
                    name="Author"
                    value={formData.Author}
                    onChange={handleChange}
                    placeholder="Author name"
                    className="h-11"
                  />
                  {errors.Author && (
                    <p className="text-xs text-red-500 mt-1">{errors.Author}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Read Time
                </label>
                <Input
                  type="text"
                  name="ReadTime"
                  value={formData.ReadTime}
                  onChange={handleChange}
                  placeholder="e.g. 5 min read"
                  className="h-11"
                />
                {errors.ReadTime && (
                  <p className="text-xs text-red-500 mt-1">{errors.ReadTime}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Excerpt */}
          <Card>
            <CardHeader>
              <CardTitle>Excerpt</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                name="Excerpt"
                value={formData.Excerpt}
                onChange={handleChange}
                placeholder="Brief summary of the article (shown in blog listing)"
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-border text-foreground placeholder:text-foreground/40"
              />
              {errors.Excerpt && (
                <p className="text-xs text-red-500 mt-1">{errors.Excerpt}</p>
              )}
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                name="Content"
                value={formData.Content}
                onChange={handleChange}
                placeholder={`Write your article content here. Supports markdown.\n\n## Headers\n- Bullet points\n**Bold text**`}
                rows={12}
                className="w-full px-3 py-2 rounded-lg border border-border text-foreground placeholder:text-foreground/40 font-mono text-sm"
              />
              {errors.Content && (
                <p className="text-xs text-red-500 mt-1">{errors.Content}</p>
              )}
              <p className="text-xs text-foreground/60 mt-2">
                Supports markdown formatting
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 text-foreground/50 hover:border-primary hover:text-primary transition-colors"
              >
                <UploadCloud className="w-6 h-6" />
                <span className="text-sm">
                  {formData.Image
                    ? formData.Image.name
                    : "Click to upload image"}
                </span>
              </button>
              {errors.Image && (
                <p className="text-xs text-red-500">{errors.Image}</p>
              )}
              {imagePreview && (
                <div className="w-full h-40 bg-muted rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Publish */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="pt-2">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-white gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? "Saving..." : "Save Article"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
