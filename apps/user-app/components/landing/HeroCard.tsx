import { cn } from "@repo/ui/lib/utils";
import { motion } from "motion/react";

interface HeroCardProps {
  title: string;
  subtitle?: string;
  color: string;
  icon?: React.ReactNode;
  className?: string;
}

export function HeroCard({ title, subtitle, color, icon, className }: HeroCardProps) {
  return (
    <motion.div
      className={cn("xl:p-4 p-2 md:p-3 rounded-xl shadow-lg", color, className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start space-x-2">
        {icon && <div className="mt-1">{icon}</div>}
        <div>
          <h3 className="font-semibold text-sm">{title}</h3>
          {subtitle && <p className="text-xs mt-1 opacity-80">{subtitle}</p>}
        </div>
      </div>
    </motion.div>
  );
}
