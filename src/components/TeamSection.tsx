import { motion } from "framer-motion";
import { Linkedin, Mail } from "lucide-react";
import { usePortfolio } from "@/hooks/usePortfolio";
import SectionHeading from "./SectionHeading";
import { useTilt } from "@/hooks/useTilt";
import LazyImage from "./LazyImage";

const getInitials = (name: string) => name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const getInitialColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const hue = 170 + (hash % 30);
  return `hsl(${hue}, 80%, 45%)`;
};

const TeamCard = ({ member }: { member: any }) => {
  const tilt = useTilt(8);

  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="group flex flex-col items-center text-center"
      style={{ transition: "transform 0.08s linear" }}
    >
      <div className="relative mb-4">
        <div className="absolute inset-0 w-full h-full rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" aria-hidden="true">
          <div className="absolute w-2 h-2 rounded-full bg-primary" style={{ animation: "orbit-ring 3s linear infinite", top: 0, left: "50%" }} />
        </div>
        <div className="w-28 h-28 rounded-full overflow-hidden transition-all duration-300 group-hover:scale-[1.08] group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)]">
          {member.photo_url ? (
            <LazyImage src={member.photo_url} alt={member.alt_text || member.name} className="w-full h-full rounded-full" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-2xl font-bold rounded-full"
              style={{ backgroundColor: `${getInitialColor(member.name)}20`, color: getInitialColor(member.name) }}
            >
              {getInitials(member.name)}
            </div>
          )}
        </div>
      </div>
      <h3 className="font-display text-sm font-semibold text-foreground">{member.name}</h3>
      {member.role && <p className="text-xs text-muted-foreground font-body mt-1">{member.role}</p>}
      <div className="flex gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {member.linkedin_url && (
          <a href={member.linkedin_url} target="_blank" rel="noreferrer" aria-label={`${member.name} LinkedIn`} className="text-muted-foreground hover:text-primary transition-colors">
            <Linkedin size={14} />
          </a>
        )}
        {member.email && (
          <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`} className="text-muted-foreground hover:text-primary transition-colors">
            <Mail size={14} />
          </a>
        )}
      </div>
    </div>
  );
};

const TeamSection = () => {
  const { teamMembers } = usePortfolio();

  // Don't render if no team members
  if (teamMembers.length === 0) return null;

  return (
    <section id="team" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading label="Collaboration" title="Meet The Team" />
        <div className="flex flex-wrap justify-center gap-12 md:gap-16">
          {teamMembers.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <TeamCard member={m} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
