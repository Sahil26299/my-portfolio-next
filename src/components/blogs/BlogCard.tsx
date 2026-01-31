import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock } from "lucide-react";
import { IBlog } from "@/lib/models/Blog";
import dayjs from "dayjs";

interface BlogCardProps {
  blog: IBlog;
}

const BlogCard = ({ blog }: BlogCardProps) => {
  return (
    <Link
      href={`/blogs/${blog.slug || blog._id}`}
      className="block transition-transform hover:scale-[1.02]"
    >
      <Card className="h-full flex flex-col overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
        {blog.coverImage && (
          <div className="w-full h-48 overflow-hidden">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex flex-wrap gap-2 mb-2">
            {blog.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <CardTitle className="line-clamp-2 text-xl">{blog.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground line-clamp-3 text-sm">
            {blog.excerpt}
          </p>
        </CardContent>
        <CardFooter className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-3 h-3" />
            <span>{dayjs(blog.createdAt).format("MMM D, YYYY")}</span>
          </div>
          {/* Estimated read time could be calculated from content length */}
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{Math.ceil(blog.content.length / 1000)} min read</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default BlogCard;
