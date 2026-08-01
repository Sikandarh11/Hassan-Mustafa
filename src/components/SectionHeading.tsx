import { motion } from "framer-motion";

interface SectionHeadingProps {
  label: string;
  title: string;
}

const SectionHeading = ({ label, title }: SectionHeadingProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
    viewport={{ once: true }}
    className="mb-12"
  >
    <p className="label-text mb-3 text-primary">{label}</p>
    <h2 className="font-display text-3xl sm:text-4xl font-semibold text-foreground relative inline-block">
      {title}
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.2, 0, 0, 1] }}
        viewport={{ once: true }}
        className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary origin-left"
      />
    </h2>
  </motion.div>
);

export default SectionHeading;
