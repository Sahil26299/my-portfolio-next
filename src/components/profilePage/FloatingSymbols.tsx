import React from "react";
import { motion } from "framer-motion";

const FloatingSymbols = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
      {/* React Fragment / Code Tag - Top Left */}
      <motion.div
        className="absolute top-12 left-10 text-4xl font-mono font-bold text-cyan-400/20"
        animate={{
          y: [0, 20, 0],
          rotate: [0, 5, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        &lt;/&gt;
      </motion.div>

      {/* Curly Braces - Bottom Right */}
      <motion.div
        className="absolute bottom-24 right-12 text-6xl font-mono font-bold text-fuchsia-500/15"
        animate={{
          y: [0, -30, 0],
          rotate: [-10, 10, -10],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        &#123; &#125;
      </motion.div>

      {/* Array Brackets - Top Right */}
      <motion.div
        className="absolute bottom-48 left-36 text-5xl font-mono font-bold text-yellow-400/15"
        animate={{
          x: [0, -20, 0],
          y: [0, 10, 0],
          rotate: [5, -5, 5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        [ ]
      </motion.div>

      {/* Console Log - Bottom Left */}
      {/* <motion.div
        className="absolute bottom-32 left-20 text-xl font-mono font-bold text-green-400/20"
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        console.log()
      </motion.div> */}

      {/* Arrow Function - Middle Left */}
      {/* <motion.div
        className="absolute top-1/2 left-8 text-3xl font-mono font-bold text-purple-400/15"
        animate={{
          x: [0, 15, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        =&gt;
      </motion.div> */}

      {/* Semicolon - Middle Right */}
      <motion.div
        className="absolute top-1/3 right-36 text-4xl font-mono font-bold text-blue-400/20"
        animate={{
          y: [0, 25, 0],
          opacity: [0.1, 0.4, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        ;
      </motion.div>

      {/* Large Background Gradient Blob for depth */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -z-10"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.08, 0.05],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default FloatingSymbols;
