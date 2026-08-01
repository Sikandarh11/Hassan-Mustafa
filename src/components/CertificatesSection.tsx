import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { usePortfolio } from "@/hooks/usePortfolio";
import SectionHeading from "./SectionHeading";

const getIssuerColor = (issuer: string) => {
  let hash = 0;
  for (let i = 0; i < issuer.length; i++) hash = issuer.charCodeAt(i) + ((hash << 5) - hash);
  const hue = 170 + (hash % 40);
  return `hsl(${hue}, 70%, 50%)`;
};

const CertificatesSection = () => {
  const { certificates } = usePortfolio();

  // Don't render if no certificates
  if (certificates.length === 0) return null;

  // Bento grid pattern: alternate between wide (span-2) and narrow (span-1)
  const getSpan = (index: number, total: number) => {
    // Row 1: 2 wide cards, Row 2: 4 standard, Row 3: 2 wide, etc.
    const rowPattern = Math.floor(index / 4); // cycle every 4
    const posInCycle = index % 4;
    if (rowPattern % 2 === 0 && posInCycle < 2) return "md:col-span-2";
    return "";
  };

  return (
    <section id="certifications" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading label="Credentials" title="Certifications" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {certificates.map((c, i) => {
            const cert = c as any;
            const issuerColor = cert.issuer_color || (c.issuer ? getIssuerColor(c.issuer) : "hsl(var(--primary))");
            const Wrapper = c.link ? "a" : "div";
            const wrapperProps = c.link ? { href: c.link, target: "_blank", rel: "noreferrer" } : {};

            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                viewport={{ once: true }}
                className={getSpan(i, certificates.length)}
              >
                <Wrapper
                  {...(wrapperProps as any)}
                  className="card-surface p-5 block h-full relative group cursor-pointer hover:border-primary/30 hover:bg-[#0d1f35] transition-all"
                >
                  {c.link && (
                    <ExternalLink size={12} className="absolute top-4 right-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                  <p className="text-sm font-medium text-foreground font-body">{c.name}</p>
                  {c.issuer && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: issuerColor }} />
                      <span className="text-xs text-muted-foreground font-body">{c.issuer}</span>
                    </div>
                  )}
                  {cert.year && <p className="text-[10px] text-muted-foreground font-mono mt-1">{cert.year}</p>}
                </Wrapper>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CertificatesSection;
