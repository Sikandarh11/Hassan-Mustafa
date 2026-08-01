import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  Clock3,
  FileText,
  Sparkles,
} from "lucide-react";
import { usePortfolio } from "@/hooks/usePortfolio";
import SectionHeading from "./SectionHeading";

const formatPublishedDate = (value?: string | null) => {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const BlogSection = () => {
  const { blogPosts } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState("All");

  const visiblePosts = useMemo(
    () =>
      (blogPosts ?? [])
        .filter(
          (post) => post.is_visible !== false && post.is_published === true
        )
        .sort((a, b) => {
          const featuredDifference =
            Number(b.is_featured === true) - Number(a.is_featured === true);
          if (featuredDifference !== 0) return featuredDifference;

          if (a.sort_order !== b.sort_order) {
            return a.sort_order - b.sort_order;
          }

          const aPublished = a.published_at
            ? new Date(a.published_at).getTime()
            : 0;
          const bPublished = b.published_at
            ? new Date(b.published_at).getTime()
            : 0;
          return bPublished - aPublished;
        }),
    [blogPosts]
  );

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          visiblePosts.map((post) => post.category.trim()).filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b)),
    [visiblePosts]
  );

  const selectedCategory =
    activeCategory === "All" || categories.includes(activeCategory)
      ? activeCategory
      : "All";

  const filteredPosts = useMemo(
    () =>
      selectedCategory === "All"
        ? visiblePosts
        : visiblePosts.filter(
            (post) => post.category === selectedCategory
          ),
    [selectedCategory, visiblePosts]
  );

  if (visiblePosts.length === 0) return null;

  return (
    <section id="blog" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading label="Engineering Notes" title="Blog" />

        <div
          className="mb-8 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter blog posts by category"
        >
          {["All", ...categories].map((category) => {
            const isActive = selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post, index) => {
            const publishedDate = formatPublishedDate(post.published_at);
            const tags = post.tags ?? [];

            return (
              <motion.article
                layout
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                viewport={{ once: true, amount: 0.15 }}
                className={`card-surface relative flex h-full flex-col overflow-hidden ${
                  post.is_featured ? "border-primary/40" : ""
                }`}
              >
                {post.cover_image_url && (
                  <div className="relative aspect-[16/9] overflow-hidden border-b border-border/70 bg-background">
                    <img
                      src={post.cover_image_url}
                      alt={`Cover for ${post.title}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-card/60 via-transparent to-transparent"
                    />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-primary">
                      {post.category || "Engineering"}
                    </span>
                    {post.is_featured && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-primary">
                        <Sparkles size={10} aria-hidden="true" />
                        Featured
                      </span>
                    )}
                    {post.post_type && (
                      <span className="rounded-full border border-border bg-background/60 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                        {post.post_type}
                      </span>
                    )}
                    {post.difficulty && post.difficulty !== "All levels" && (
                      <span className="rounded-full border border-border bg-background/60 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                        {post.difficulty}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-lg font-semibold leading-snug text-foreground">
                    {post.title}
                  </h3>

                  {(publishedDate || post.reading_time_minutes) && (
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] text-muted-foreground">
                      {publishedDate && (
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays size={12} className="text-primary" aria-hidden="true" />
                          <time dateTime={post.published_at || undefined}>
                            {publishedDate}
                          </time>
                        </span>
                      )}
                      {post.reading_time_minutes && (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 size={12} className="text-primary" aria-hidden="true" />
                          {post.reading_time_minutes} min read
                        </span>
                      )}
                    </div>
                  )}

                  {post.excerpt && (
                    <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>
                  )}

                  {tags.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-1.5" aria-label="Article tags">
                      {tags.map((tag, tagIndex) => (
                        <span
                          key={`${post.id}-tag-${tagIndex}`}
                          className="rounded-full border border-border bg-background/60 px-2.5 py-1 font-mono text-[10px] text-muted-foreground"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto pt-5">
                    {post.content && (
                      <details className="group/content">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                          <span className="inline-flex items-center gap-2">
                            <FileText size={13} className="text-primary" aria-hidden="true" />
                            Read full article
                          </span>
                          <ChevronDown
                            size={14}
                            aria-hidden="true"
                            className="text-muted-foreground transition-transform group-open/content:rotate-180"
                          />
                        </summary>
                        <div className="mt-4 whitespace-pre-line border-l border-primary/20 pl-4 font-body text-sm leading-relaxed text-muted-foreground">
                          {post.content}
                        </div>
                      </details>
                    )}

                    {post.external_url && (
                      <a
                        href={post.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          post.content ? "mt-4" : ""
                        }`}
                      >
                        Read on external site
                        <ArrowUpRight size={13} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;
