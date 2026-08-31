import { motion } from "motion/react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Animate when scrolled into view instead of on mount. */
  onScroll?: boolean;
}

const EASE = [0.22, 0.61, 0.36, 1] as const;

/** Staggered fade + rise, per the design system's single orchestrated page load. */
export function Reveal({ children, delay = 0, className = "", onScroll = true }: RevealProps) {
  const transition = { duration: 0.52, delay, ease: EASE };
  if (!onScroll) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
