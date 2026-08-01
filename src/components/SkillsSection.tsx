import { motion } from "framer-motion";
import { usePortfolio } from "@/hooks/usePortfolio";
import SectionHeading from "./SectionHeading";
import SkillIcon from "./SkillIcon";


const SkillsSection = () => {
  const { skills } = usePortfolio();

  if (skills.length === 0) return null;

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  // Sort categories for consistent display
  const categoryOrder = [
    "Mechanical Design",
    "CAD & Drafting",
    "Simulation & Analysis",
    "Manufacturing",
    "Engineering Standards",
    "Product Development",
    "Technical Skills",
    "Tools",
    "Other",
  ];
  const sortedCategories = Object.keys(groupedSkills).sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a);
    const bIndex = categoryOrder.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return (
    <section id="skills" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading label="Engineering Toolkit" title="Skills" />

        <div className="space-y-12">
          {sortedCategories.map((category, catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: catIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-sm font-mono text-primary mb-4 uppercase tracking-wider">
                {category}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {groupedSkills[category].map((skill, i) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.03 }}
                      viewport={{ once: true }}
                      className="group card-surface p-4 flex flex-col items-center gap-2 hover:border-primary/50 transition-all"
                    >
                      <SkillIcon name={skill.name} />
                      <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground transition-colors text-center">
                        {skill.name}
                      </span>
                    </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
