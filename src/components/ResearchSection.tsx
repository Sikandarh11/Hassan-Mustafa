import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { usePortfolio } from "@/hooks/usePortfolio";
import SectionHeading from "./SectionHeading";

const statusStyles: Record<string, string> = {
  published: "bg-green-500/10 text-green-400 shadow-[0_0_8px_rgba(34,197,94,0.3)]",
  in_review: "bg-amber-500/10 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.3)]",
  patent: "bg-primary/10 text-primary shadow-[0_0_8px_hsl(var(--primary)/0.3)]",
  in_progress: "bg-muted text-muted-foreground shadow-none",
};

const ResearchSection = () => {
  const { research } = usePortfolio();

  return (
    <section id="research" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading label="Publications" title="Research" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {research.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-60 pointer-events-none" style={{ animation: "perimeter-glow 3s linear infinite" }} aria-hidden="true" />
              <article className="card-surface p-6 h-full flex flex-col">
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-mono uppercase w-fit mb-3 ${statusStyles[r.status || "in_progress"]}`}>
                  {(r.status || "in_progress").replace("_", " ")}
                </span>
                <h3 className="font-display text-sm font-semibold text-foreground mb-2">{r.title}</h3>
                <p className="text-sm text-muted-foreground font-body flex-1">{r.description}</p>
                {r.link && (
                  <a href={r.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mt-3">
                    <ExternalLink size={12} /> View Paper
                  </a>
                )}
              </article>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResearchSection;
