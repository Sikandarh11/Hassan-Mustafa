import { motion } from "framer-motion";
import { Phone, Mail, Linkedin, Github, Globe, Terminal } from "lucide-react";
import { usePortfolio } from "@/hooks/usePortfolio";
import SectionHeading from "./SectionHeading";

const AboutSection = () => {
  const { profile, skills } = usePortfolio();

  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <section id="about" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading label="Background" title="About Me" />

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <p className="text-muted-foreground leading-relaxed text-lg font-body">
              {profile?.about_text || "Loading..."}
            </p>

            {/* Skills pills */}
            {categories.length > 0 && (
              <div className="mt-8 space-y-4">
                {categories.map((cat) => (
                  <div key={cat}>
                    <p className="text-xs font-mono text-primary mb-2 uppercase tracking-wider">{cat}</p>
                    <div className="flex flex-wrap gap-2">
                      {skills
                        .filter((s) => s.category === cat)
                        .map((s) => (
                          <span
                            key={s.id}
                            className="text-xs px-3 py-1 rounded-full bg-secondary border border-border/50 text-foreground font-body relative overflow-hidden group cursor-default"
                          >
                            {/* Shimmer sweep on hover */}
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" aria-hidden="true" />
                            {s.name}
                          </span>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right: terminal card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="card-surface p-5 font-mono text-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/30">
                <Terminal size={14} className="text-primary" />
                <span className="text-muted-foreground text-xs">terminal</span>
                <div className="flex gap-1.5 ml-auto">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <p><span className="text-primary">$</span> whoami</p>
                <p className="text-muted-foreground pl-2">{profile?.name || "..."}</p>
                <p><span className="text-primary">$</span> cat role.txt</p>
                <p className="text-muted-foreground pl-2">{profile?.tagline || "..."}</p>
                <p><span className="text-primary">$</span> echo $EMAIL</p>
                <p className="text-muted-foreground pl-2">{profile?.email || "..."}</p>
                <p><span className="text-primary">$</span> echo $LOCATION</p>
                <p className="text-muted-foreground pl-2">Pakistan 🇵🇰</p>
                <p className="text-primary animate-pulse">▊</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Contact row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-8 flex flex-wrap gap-6 text-sm font-body"
        >
          {profile?.phone && (
            <a href={`tel:${profile.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <Phone size={16} /> {profile.phone}
            </a>
          )}
          {profile?.email && (
            <a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <Mail size={16} /> {profile.email}
            </a>
          )}
          {profile?.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <Linkedin size={16} /> LinkedIn
            </a>
          )}
          {profile?.github && (
            <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <Github size={16} /> GitHub
            </a>
          )}
          {profile?.website && (
            <a href={`https://${profile.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <Globe size={16} /> {profile.website}
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
