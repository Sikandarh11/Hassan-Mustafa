import { useState, useMemo } from "react";
import { Github, ExternalLink } from "lucide-react";
import { usePortfolio } from "@/hooks/usePortfolio";
import SectionHeading from "./SectionHeading";

const ProjectsSection = () => {
  const { projects } = usePortfolio();
  const [activeFilter, setActiveFilter] = useState("All");
  const [showAll, setShowAll] = useState(false);

  const visibleProjects = useMemo(
    () =>
      projects
        .filter((p) => p.is_visible !== false)
        .sort((a, b) => a.sort_order - b.sort_order),
    [projects]
  );

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    visibleProjects.forEach((p) => {
      (p.tech_stack || []).forEach((t) => tags.add(t));
    });
    return ["All", ...Array.from(tags).sort()];
  }, [visibleProjects]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return visibleProjects;
    return visibleProjects.filter((project) =>
      (project.tech_stack || []).includes(activeFilter)
    );
  }, [activeFilter, visibleProjects]);

  const displayedProjects = useMemo(() => {
    const shouldLimitToSix = activeFilter === "All" && !showAll;
    return shouldLimitToSix ? filteredProjects.slice(0, 6) : filteredProjects;
  }, [activeFilter, filteredProjects, showAll]);

  if (visibleProjects.length === 0) return null;

  return (
    <section id="projects" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading label="Portfolio" title="Projects" />

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setActiveFilter(tag);
                setShowAll(false);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 border ${
                activeFilter === tag
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}
        >
          {displayedProjects.map((project) => {
            const hasGithub = project.github_url && project.github_url.trim() !== "";
            const hasLive = project.live_url && project.live_url.trim() !== "";
            const isPrivate = !hasGithub && !hasLive;

            return (
              <article
                key={project.id}
                className="flex flex-col rounded-2xl bg-card border border-border overflow-hidden transition-all duration-300 hover:border-primary hover:shadow-[0_0_24px_hsl(var(--primary)/0.13)]"
                style={{
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                {/* Image Area */}
                <div className="h-[200px] flex-shrink-0">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.alt_text || project.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-card to-background">
                      <span className="font-display text-5xl text-primary">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="flex flex-col flex-1 p-5">
                  <div className="mb-2">
                    <span className="inline-flex items-center px-2 py-0.5 text-[11px] rounded-full border border-border text-muted-foreground">
                      Index #{project.sort_order}
                    </span>
                  </div>
                  <h3 className="text-foreground font-semibold text-base mb-2 font-body">
                    {project.title}
                  </h3>
                  <p
                    className="text-muted-foreground text-sm leading-relaxed font-body"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {project.description}
                  </p>

                  {/* Tech Badges */}
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {project.tech_stack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-0.5 text-[11px] rounded-full bg-background border border-border text-primary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Row */}
                  <div className="flex flex-wrap gap-2 mt-auto pt-4">
                    {hasGithub && (
                      <a
                        href={project.github_url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs text-primary border border-primary rounded-md bg-transparent hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                      >
                        <Github size={12} /> GitHub
                      </a>
                    )}
                    {hasLive && (
                      <a
                        href={project.live_url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs text-primary border border-primary rounded-md bg-transparent hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                      >
                        <ExternalLink size={12} /> Live Demo
                      </a>
                    )}
                    {isPrivate && (
                      <span className="inline-flex items-center px-3.5 py-1.5 text-xs text-muted-foreground border border-border rounded-md cursor-default">
                        Private
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {activeFilter === "All" && !showAll && filteredProjects.length > 6 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowAll(true)}
              className="px-6 py-2 rounded-md text-sm font-medium border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
            >
              View All
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
