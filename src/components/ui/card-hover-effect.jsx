import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState, useRef, useEffect } from "react";

export const HoverEffect = ({ items, className, selected = [], onToggle = () => {} }) => {

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const containerRef = useRef(null);

  // Detect click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setHoveredIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10",
        className
      )}
    >
      {items.map((item, idx) => (
  <div
    key={`${item?.title}-${idx}`}
    className="relative group block p-2 h-full w-full cursor-pointer"
    onMouseEnter={() => setHoveredIndex(idx)}
    onMouseLeave={() => setHoveredIndex(null)}
    onClick={() => onToggle(item.title)} // 🎯 Toggle selection
  >
    <AnimatePresence>
      {hoveredIndex === idx && (
        <motion.span
          className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-green-300/[0.8] block rounded-3xl"
          layoutId="hoverBackground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.15 } }}
          exit={{
            opacity: 0,
            transition: { duration: 0.15, delay: 0.2 },
          }}
        />
      )}
    </AnimatePresence>

    <Card icon={item.icon} isSelected={selected.includes(item.title)}>
      <CardTitle>{item.title}</CardTitle>
      <CardDescription>{item.description}</CardDescription>
    </Card>
  </div>
))}

    </div>
  );
};

export const Card = ({ className, children, icon, isSelected }) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden border transition-all duration-300 relative z-20",
        isSelected
          ? "bg-green-200 border-green-700"
          : "bg-white border-transparent group-hover:border-green-700",
        className
      )}
    >
      <div className="relative z-50">
        {icon && <div className="text-3xl text-green-800 mb-2">{icon}</div>}
        <div className="p-4">
          {children}
          {isSelected && (
            <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
              ✓ Selected
            </div>
          )}
        </div>
      </div>
    </div>
  ); // ✅ this closes the Card component correctly
};


export const CardTitle = ({ className, children }) => {
  return (
    <h4 className={cn("text-black font-bold tracking-wide mt-4", className)}>
      {children}
    </h4>
  );
};

export const CardDescription = ({ className, children }) => {
  return (
    <p
      className={cn(
        "mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
