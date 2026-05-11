"use client";

import { Navbar } from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft, Share2, Bookmark } from "lucide-react";
import Link from "next/link";
import { useGetBlogByIdQuery } from "@/store/slice/apiSlice";
import { useParams } from "next/navigation";

export default function BlogPostPage() {
  const params = useParams();

  const { data, isLoading } = useGetBlogByIdQuery({ id: params?.slug });

  const post = data?.data ?? {};
  console.log({ post });

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("URL copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  if (isLoading) {
    return <p>loading blog</p>;
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="pt-12 text-center pb-12">
                <p className="text-foreground/60 mb-6">Article not found</p>
                <Link href="/blog">
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blog
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
        <article className="max-w-3xl mx-auto">
          {/* Back Button */}
          <Link
            href="/blog"
            className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <Card className="mb-8">
            <CardContent className="pt-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary/10 text-primary">
                    {post.category}
                  </Badge>
                  <span className="text-sm text-foreground/60">
                    {post.readTime}
                  </span>
                </div>

                <h1 className="text-4xl font-bold text-foreground leading-tight">
                  {post.title}
                </h1>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-6 text-sm text-foreground/60">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={copyUrl}
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-transparent"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                    {/* <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-transparent"
                    >
                      <Bookmark className="w-4 h-4" />
                      Save
                    </Button> */}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <div className="mb-8 rounded-lg overflow-hidden bg-muted h-96">
            <img
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Content */}
          <Card>
            <CardContent className="pt-8">
              <div className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground/80 prose-strong:text-foreground prose-a:text-primary">
                {post?.content
                  ?.split("\n\n")
                  .map((paragraph: string, index: number) => {
                    if (paragraph.startsWith("##")) {
                      return (
                        <h2
                          key={index}
                          className="text-2xl font-bold text-foreground mt-6 mb-3"
                        >
                          {paragraph.replace("## ", "")}
                        </h2>
                      );
                    } else if (paragraph.startsWith("- ")) {
                      return (
                        <ul
                          key={index}
                          className="list-disc list-inside space-y-2 text-foreground/80 my-4"
                        >
                          {paragraph
                            .split("\n")
                            .map((item: string, i: number) => (
                              <li key={i}>{item.replace("- ", "")}</li>
                            ))}
                        </ul>
                      );
                    } else if (paragraph) {
                      return (
                        <p
                          key={index}
                          className="text-foreground/80 leading-relaxed my-4"
                        >
                          {paragraph}
                        </p>
                      );
                    }
                  })}
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="mt-8 bg-primary text-white border-0">
            <CardContent className="pt-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Ready to Ship?</h3>
                <p className="text-white/90 mb-6">
                  Get started with SHIPGATE today for fast, reliable shipping.
                </p>
                <Link href="/calculator">
                  <Button className="bg-white text-primary hover:bg-white/90">
                    Calculate Your Shipping Cost
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Related Articles */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Related Articles
            </h3>
            {/* <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(blogPosts)
                .slice(0, 3)
                .filter(([slug]) => slug !== params.slug)
                .map(([slug, relatedPost]) => (
                  <Link key={slug} href={`/blog/${slug}`}>
                    <Card className="hover:shadow-lg transition-shadow h-full cursor-pointer">
                      <CardContent className="pt-4">
                        <Badge className="bg-primary/10 text-primary mb-2">
                          {relatedPost.category}
                        </Badge>
                        <h4 className="font-semibold text-foreground line-clamp-2">
                          {relatedPost.title}
                        </h4>
                        <p className="text-xs text-foreground/60 mt-2">
                          {relatedPost.readTime}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div> */}
          </div>
        </article>
      </main>
    </>
  );
}
