"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useGetBlogsQuery } from "@/store/slice/apiSlice";

export default function BlogPage() {
  const { data: blogPosts, isLoading } = useGetBlogsQuery({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts = blogPosts?.data?.filter((post: any) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(
    new Set(blogPosts?.data?.map((p: any) => p?.category)),
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-3">
              Blog & Resources
            </h1>
            <p className="text-lg text-foreground/70">
              Expert tips, guides, and updates about shipping from China to
              Nigeria
            </p>
          </div>

          {isLoading && <p>...loading blog</p>}
          {/* Search and Filter */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === null
                        ? "bg-primary text-white"
                        : "bg-white border border-border text-foreground hover:border-primary"
                    }`}
                  >
                    All Articles
                  </button>
                  {categories?.map((category: any) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? "bg-primary text-white"
                          : "bg-white border border-border text-foreground hover:border-primary"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blog Posts Grid */}
          <div className="space-y-6">
            {filteredPosts?.length > 0 ? (
              filteredPosts?.map((post: any) => (
                <Link key={post.id} href={`/blog/${post.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <div className="grid md:grid-cols-4 h-full">
                      {/* Image */}
                      <div className="relative  h-48 bg-muted overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-t-none">
                        <img
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <CardContent className="md:col-span-3 pt-6 pb-6">
                        <div className="flex flex-col justify-between h-full">
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                                {post.category}
                              </Badge>
                              <span className="text-xs text-foreground/60">
                                {post.readTime}
                              </span>
                            </div>

                            <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">
                              {post.title}
                            </h3>

                            <p className="text-foreground/70 text-sm mb-4 line-clamp-2">
                              {post.excerpt}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-foreground/60">
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {post.author}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(post.date).toLocaleDateString()}
                              </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-primary" />
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <Card>
                <CardContent className="pt-12 text-center pb-12">
                  <p className="text-foreground/60 mb-4">
                    No articles found matching your search.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory(null);
                    }}
                    variant="outline"
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Newsletter Section */}
          <Card className="mt-16 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Stay Updated
                </h3>
                <p className="text-foreground/70 mb-6 max-w-md mx-auto">
                  Subscribe to get the latest shipping tips, fee updates, and
                  exchange rate alerts.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className="h-12"
                  />
                  <Button className="bg-primary hover:bg-primary/90 text-white px-8 h-12">
                    Subscribe
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
