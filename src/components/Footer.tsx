import { Github, Linkedin, Mail, Globe } from "lucide-react";
import { usePortfolio } from "@/hooks/usePortfolio";

const Footer = () => {
  const { profile } = usePortfolio();
  const year = new Date().getFullYear();
  const name = profile?.name || "Hafiz Muhammad Hassan Mustafa";

  return (
    <footer className="border-t border-primary/10 py-8" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground font-body">
          © {year} {name} · All rights reserved
        </p>
        <div className="flex items-center gap-4">
          {profile?.github && (
            <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-primary transition-colors"><Github size={18} /></a>
          )}
          {profile?.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin size={18} /></a>
          )}
          {profile?.email && (
            <a href={`mailto:${profile.email}`} aria-label="Email" className="text-muted-foreground hover:text-primary transition-colors"><Mail size={18} /></a>
          )}
          {profile?.website && (
            <a href={`https://${profile.website}`} target="_blank" rel="noreferrer" aria-label="Website" className="text-muted-foreground hover:text-primary transition-colors"><Globe size={18} /></a>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
