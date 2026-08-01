import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PageLoaderProps {
  brandInitials: string;
  onComplete: () => void;
}

const PageLoader = ({ brandInitials, onComplete }: PageLoaderProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 500);
    }, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
        >
          <div className="relative">
            {/* Spinning ring */}
            <div
              className="absolute inset-0 w-24 h-24 -m-4 rounded-full border-2 border-transparent border-t-primary"
              style={{ animation: "spin-conic 1s linear infinite" }}
            />
            {/* Initials */}
            <span className="font-display text-3xl font-bold text-primary">
              {brandInitials || "HMHM"}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;
