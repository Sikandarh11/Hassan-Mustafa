import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { ArrowRight, Download } from "lucide-react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useCountUp } from "@/hooks/useCountUp";
import { useTilt } from "@/hooks/useTilt";
import ParticleCanvas from "./ParticleCanvas";
import LazyImage from "./LazyImage";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const HeroPhoto = ({ src, alt }: { src: string; alt: string }) => {
  const tilt = useTilt(10);

  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="relative flex items-center justify-center"
      style={{
        transformOrigin: "top center",
        animation: "dangle 1.4s cubic-bezier(0.36,0.07,0.19,0.97) 2",
        transition: "transform 0.08s linear",
      }}
    >
      {/* Orbiting ring */}
      <div
        className="absolute w-[110%] h-[110%] rounded-full border border-primary/50 pointer-events-none"
        style={{ animation: "orbit-ring 8s linear infinite" }}
        aria-hidden="true"
      />
      {/* Outer ring */}
      <div className="rounded-full p-[6px]" style={{ border: "2px solid hsl(var(--primary) / 0.4)" }}>
        {/* Inner ring */}
        <div
          className="rounded-full overflow-hidden"
          style={{
            border: "2px solid hsl(var(--primary))",
            boxShadow: "0 0 60px hsl(var(--primary) / 0.4)",
          }}
        >
          <LazyImage src={src} alt={alt} className="w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full" />
        </div>
      </div>
      {/* Floating tech badges */}
      {["Mechatronics Engineer","Robotics & Automation","Embedded Design","Control Systems"].map((tech, i) => (
        <span
          key={tech}
          className="absolute text-[10px] font-mono px-2 py-0.5 rounded-full bg-card border border-primary/30 text-primary pointer-events-none"
          style={{
            top: `${[10, 75, 85, 20][i]}%`,
            left: `${[-2, 0, 78, 80][i]}%`,
            animation: `float-badge ${3 + i * 0.7}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }}
          aria-hidden="true"
        >
          {tech}
        </span>
      ))}
    </div>
  );
};

const StatCard = ({ value, label }: { value: string; label: string }) => {
  const counter = useCountUp(value);
  const tilt = useTilt(5);

  return (
    <div
      ref={(el) => {
        // Assign both refs
        (counter.ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
        (tilt.ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="card-surface p-5 relative overflow-hidden group cursor-default"
      style={{ borderBottom: "3px solid hsl(var(--primary))", transition: "transform 0.08s linear" }}
    >
      {/* Conic shimmer on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-[0.06] transition-opacity pointer-events-none"
        style={{
          background: "conic-gradient(from 0deg, transparent, hsl(var(--primary) / 0.3), transparent)",
          animation: "spin-conic 3s linear infinite",
        }}
        aria-hidden="true"
      />
      <p className="font-display text-2xl font-bold text-primary">{counter.value}</p>
      <p className="text-sm text-muted-foreground font-body mt-1">{label}</p>
    </div>
  );
};

const HeroSection = () => {
  const { profile, heroStats, typewriterLines, loading } = usePortfolio();

  const visibleStats = heroStats.filter((s) => (s as any).is_visible !== false);

  const sequence =
    typewriterLines.length > 0
      ? typewriterLines.flatMap((l) => [l.text, 2000])
      : ["Building Production AI Systems", 2000, "LLM & Agentic Workflows", 2000];

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden hex-grid-bg">
      <ParticleCanvas />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(180_100%_42%/0.08),transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left text */}
          <div>
            <motion.p
              {...fadeUp}
              transition={{ duration: 0.5, delay: 2.1 }}
              className="label-text mb-4 text-primary tracking-[0.05em]"
            >
              {profile?.tagline || "AI Engineer · ML Researcher"}
            </motion.p>
            <motion.h1
              {...fadeUp}
              transition={{ duration: 0.5, delay: 2.2 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]"
            >
              {profile?.name || "Hafiz Muhammad Hassan Mustafa"}
            </motion.h1>
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, delay: 2.3 }}
              className="mt-6 h-8 font-mono text-lg text-primary"
            >
              {!loading && (
                <TypeAnimation sequence={sequence} repeat={Infinity} speed={50} cursor={true} />
              )}
            </motion.div>
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, delay: 2.4 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium glow-primary glow-primary-hover transition-all font-body hover:scale-[1.02]"
              >
                View My Work <ArrowRight size={16} />
              </a>
              {profile?.resume_url && (
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-primary/40 text-primary font-medium hover:bg-primary/10 transition-all font-body hover:scale-[1.02]"
                >
                  <Download size={16} /> Download Resume
                </a>
              )}
            </motion.div>
          </div>

          {/* Right photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 2.5 }}
            className="flex justify-center lg:justify-end lg:translate-x-[8rem]"
          >
            {profile?.photo_url ? (
              <HeroPhoto src={profile.photo_url} alt={profile.name || "Profile photo"} />
            ) : (
              <div className="w-64 h-64 rounded-full bg-card border-2 border-primary/30 flex items-center justify-center">
                <span className="font-display text-4xl text-primary">
                  {(profile?.name || "Hafiz Muhammad Hassan Mustafa").split(" ").map((w) => w[0]).join("")}
                </span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.7 }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {visibleStats.map((s) => (
            <StatCard key={s.id} value={s.value} label={s.label} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
