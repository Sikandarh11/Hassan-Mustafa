import { motion } from "framer-motion";
import { useMemo } from "react";
import { usePortfolio } from "@/hooks/usePortfolio";
import SectionHeading from "./SectionHeading";

const ExperienceSection = () => {
  const { experiences } = usePortfolio();

  const orderedExperiences = useMemo(
    () => [...experiences].sort((a, b) => a.sort_order - b.sort_order),
    [experiences]
  );

  return (
    <section id="experience" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading label="Career" title="Experience" />

        <div className="relative">
          {/* Self-drawing timeline line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-primary/40 origin-top"
          />

          {orderedExperiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`relative flex items-start mb-12 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
            >
              {/* Pulsing dot */}
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background z-10 mt-2 animate-pulse-glow" />
              <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                <article className="card-surface p-6">
                  <span className="font-mono text-xs text-primary">
                    {exp.date_start}{exp.date_end ? ` – ${exp.date_end}` : ""}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-foreground mt-1">{exp.role}</h3>
                  <p className="text-sm text-muted-foreground font-body">{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {exp.bullets.map((b, bi) => (
                        <li key={bi} className="text-sm text-muted-foreground font-body">• {b}</li>
                      ))}
                    </ul>
                  )}
                  {exp.link && (
                    <a
                      href={exp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 px-3 py-1 text-xs text-primary border border-primary rounded-md bg-transparent hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                    >
                      View Certificate →
                    </a>
                  )}
                </article>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
