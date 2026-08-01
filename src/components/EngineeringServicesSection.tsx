import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Box,
  BriefcaseBusiness,
  Calculator,
  Check,
  ChevronDown,
  Clock3,
  Cog,
  DraftingCompass,
  Factory,
  Fan,
  FileCheck2,
  Gauge,
  Layers3,
  Lightbulb,
  Ruler,
  ScanLine,
  Sparkles,
  Thermometer,
  Wind,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { usePortfolio } from "@/hooks/usePortfolio";
import SectionHeading from "./SectionHeading";

const iconAliases: Record<string, LucideIcon> = {
  activity: Activity,
  analysis: Activity,
  box: Box,
  chart: BarChart3,
  calculator: Calculator,
  cad: DraftingCompass,
  cog: Cog,
  design: DraftingCompass,
  drafting: DraftingCompass,
  factory: Factory,
  fan: Fan,
  gauge: Gauge,
  manufacturing: Factory,
  layers: Layers3,
  lightbulb: Lightbulb,
  ruler: Ruler,
  scan: ScanLine,
  simulation: Activity,
  thermal: Thermometer,
  thermometer: Thermometer,
  wind: Wind,
  workflow: Workflow,
  wrench: Wrench,
};

const iconKeywords: Array<[string[], LucideIcon]> = [
  [["cfd", "fluid", "flow", "aerodynamic"], Wind],
  [["thermal", "heat", "temperature"], Thermometer],
  [["hvac", "ventilation", "cooling"], Fan],
  [["cad", "design", "draft", "modeling", "drawing"], DraftingCompass],
  [["fea", "simulation", "stress", "analysis"], Activity],
  [["manufactur", "fabrication", "production"], Factory],
  [["maintenance", "reliability", "repair"], Wrench],
  [["quality", "inspection", "testing", "validation"], Gauge],
  [["piping", "process", "workflow"], Workflow],
  [["calculation", "sizing", "estimate"], Calculator],
  [["prototype", "3d"], Box],
  [["dimension", "tolerance", "measurement"], Ruler],
];

const INITIAL_SERVICE_LIMIT = 6;

const getServiceIcon = (icon: string, title: string, category: string) => {
  const normalizedIcon = icon.trim().toLowerCase().replace(/[\s_-]+/g, " ");
  const exactIcon = iconAliases[normalizedIcon] ?? iconAliases[normalizedIcon.split(" ")[0]];
  if (exactIcon) return exactIcon;

  const searchableText = `${normalizedIcon} ${title} ${category}`.toLowerCase();
  return (
    iconKeywords.find(([keywords]) =>
      keywords.some((keyword) => searchableText.includes(keyword))
    )?.[1] ?? Cog
  );
};

const EngineeringServicesSection = () => {
  const { engineeringServices } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAllServices, setShowAllServices] = useState(false);

  const visibleServices = useMemo(
    () =>
      (engineeringServices ?? [])
        .filter((service) => service.is_visible !== false)
        .sort((a, b) => a.sort_order - b.sort_order),
    [engineeringServices]
  );

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          visibleServices.map((service) => service.category.trim()).filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b)),
    [visibleServices]
  );

  const selectedCategory =
    activeCategory === "All" || categories.includes(activeCategory)
      ? activeCategory
      : "All";

  const filteredServices = useMemo(
    () =>
      selectedCategory === "All"
        ? visibleServices
        : visibleServices.filter(
            (service) => service.category === selectedCategory
          ),
    [selectedCategory, visibleServices]
  );

  const displayedServices = showAllServices
    ? filteredServices
    : filteredServices.slice(0, INITIAL_SERVICE_LIMIT);
  const hasMoreServices = filteredServices.length > INITIAL_SERVICE_LIMIT;

  const selectCategory = (category: string) => {
    setActiveCategory(category);
    setShowAllServices(false);
  };

  if (visibleServices.length === 0) return null;

  return (
    <section id="services" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading label="Mechanical Expertise" title="Engineering Services" />

        <div
          className="mb-8 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter services by category"
        >
          {["All", ...categories].map((category) => {
            const isActive = selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => selectCategory(category)}
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

        <motion.div
          id="services-grid"
          layout
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          {displayedServices.map((service, index) => {
            const ServiceIcon = getServiceIcon(
              service.icon || "",
              service.title,
              service.category
            );
            const capabilities = service.capabilities ?? [];
            const tools = service.tools ?? [];
            const standards = service.standards ?? [];
            const deliverables = service.deliverables ?? [];

            return (
              <motion.article
                layout
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                viewport={{ once: true, amount: 0.15 }}
                className={`card-surface relative flex h-full flex-col overflow-hidden p-6 ${
                  service.is_featured ? "border-primary/40" : ""
                }`}
              >
                {service.is_featured && (
                  <div className="absolute right-0 top-0 rounded-bl-xl border-b border-l border-primary/20 bg-primary/10 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-primary">
                    <span className="inline-flex items-center gap-1.5">
                      <Sparkles size={10} aria-hidden="true" /> Featured
                    </span>
                  </div>
                )}

                <div
                  className={`flex items-start gap-4 ${
                    service.is_featured ? "pr-16" : ""
                  }`}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-[0_0_18px_hsl(var(--primary)/0.08)]">
                    <ServiceIcon size={21} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-primary">
                      {service.category || "General Engineering"}
                    </p>
                    <h3 className="font-display text-base font-semibold leading-snug text-foreground">
                      {service.title}
                    </h3>
                  </div>
                </div>

                <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>

                {(service.engagement_type || service.turnaround) && (
                  <dl className="mt-5 grid grid-cols-2 gap-2">
                    {service.engagement_type && (
                      <div className="rounded-lg border border-border/70 bg-background/40 p-3">
                        <dt className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                          <BriefcaseBusiness size={11} className="text-primary" aria-hidden="true" />
                          Engagement
                        </dt>
                        <dd className="mt-1 text-xs font-medium text-foreground">
                          {service.engagement_type}
                        </dd>
                      </div>
                    )}
                    {service.turnaround && (
                      <div className="rounded-lg border border-border/70 bg-background/40 p-3">
                        <dt className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                          <Clock3 size={11} className="text-primary" aria-hidden="true" />
                          Turnaround
                        </dt>
                        <dd className="mt-1 text-xs font-medium text-foreground">
                          {service.turnaround}
                        </dd>
                      </div>
                    )}
                  </dl>
                )}

                {capabilities.length > 0 && (
                  <div className="mt-5">
                    <h4 className="font-mono text-[10px] uppercase tracking-wider text-foreground/80">
                      Capabilities
                    </h4>
                    <ul className="mt-2 space-y-2">
                      {capabilities.map((capability, capabilityIndex) => (
                        <li
                          key={`${service.id}-capability-${capabilityIndex}`}
                          className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"
                        >
                          <Check size={12} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                          <span>{capability}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {tools.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-1.5" aria-label="Tools and software">
                    {tools.map((tool, toolIndex) => (
                      <span
                        key={`${service.id}-tool-${toolIndex}`}
                        className="rounded-full border border-border bg-background/60 px-2.5 py-1 font-mono text-[10px] text-primary"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                )}

                {standards.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-mono text-[10px] uppercase tracking-wider text-foreground/80">
                      Standards
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-1.5" aria-label="Engineering standards">
                      {standards.map((standard, standardIndex) => (
                        <span
                          key={`${service.id}-standard-${standardIndex}`}
                          className="rounded-md border border-primary/20 bg-primary/5 px-2.5 py-1 font-mono text-[10px] text-muted-foreground"
                        >
                          {standard}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {deliverables.length > 0 && (
                  <details className="group/deliverables mt-auto pt-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                      <span className="inline-flex items-center gap-2">
                        <FileCheck2 size={13} className="text-primary" aria-hidden="true" />
                        Typical deliverables
                      </span>
                      <ChevronDown
                        size={14}
                        aria-hidden="true"
                        className="text-muted-foreground transition-transform group-open/deliverables:rotate-180"
                      />
                    </summary>
                    <ul className="mt-3 space-y-2 border-l border-primary/20 pl-4">
                      {deliverables.map((deliverable, deliverableIndex) => (
                        <li
                          key={`${service.id}-deliverable-${deliverableIndex}`}
                          className="text-xs leading-relaxed text-muted-foreground"
                        >
                          {deliverable}
                        </li>
                      ))}
                    </ul>
                  </details>
                )}

                {service.cta_url && (
                  <a
                    href={service.cta_url}
                    target={service.cta_url.startsWith("http") ? "_blank" : undefined}
                    rel={service.cta_url.startsWith("http") ? "noreferrer" : undefined}
                    className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {service.cta_label || "Discuss this service"}
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                )}
              </motion.article>
            );
          })}
        </motion.div>

        {hasMoreServices && (
          <motion.div
            layout
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 flex justify-center"
          >
            <button
              type="button"
              aria-controls="services-grid"
              aria-expanded={showAllServices}
              onClick={() => setShowAllServices((current) => !current)}
              className="group inline-flex min-w-48 items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-6 py-3 text-sm font-semibold text-primary transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {showAllServices
                ? "Show fewer services"
                : `View all ${filteredServices.length} services`}
              <ChevronDown
                size={16}
                aria-hidden="true"
                className={`transition-transform duration-300 ${
                  showAllServices ? "rotate-180" : "group-hover:translate-y-0.5"
                }`}
              />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default EngineeringServicesSection;
