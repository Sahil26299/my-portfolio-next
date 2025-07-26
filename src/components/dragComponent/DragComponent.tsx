"use client";

// import * as motion from "framer-motion";
import { motion } from "framer-motion";
import { useState } from "react";
export default function DragComponent({ className }: { className: string }) {
  const [activeDirection, setActiveDirection] = useState<"x" | "y" | null>(
    null
  );
console.log(activeDirection,'activeDirection');

  return (
    <section className={className}>
      <section className={"relative"}>
        <Line direction="x" activeDirection={activeDirection} />
        <Line direction="y" activeDirection={activeDirection} />
        <motion.div
          drag
          dragDirectionLock
          onDirectionLock={(direction: any) => setActiveDirection(direction)}
          onDragEnd={() => setActiveDirection(null)}
          dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
          dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
          dragElastic={0.2}
          whileDrag={{ cursor: "grabbing" }}
          style={box}
          className="cursor-grab"
        />
      </section>
    </section>
  );
}

function Line({
  direction,
  activeDirection,
}: {
  direction: "x" | "y";
  activeDirection: "x" | "y" | null;
}) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: activeDirection === direction ? 1 : 0.3 }}
      transition={{ duration: 0.1 }}
      style={{ ...line, rotate: direction === "y" ? 90 : 0 }}
    />
  );
}

/**
 * ==============   Styles   ================
 */

const box: React.CSSProperties = {
  width: 50,
  height: 50,
  border: "1px solid #f5f5f5",
  position: "absolute",
  left: 125,
  top: -25
};

const line: React.CSSProperties = {
  width: 300,
  height: 1,
  borderTop: "1px dashed #f5f5f5",
  position: "absolute",
};
