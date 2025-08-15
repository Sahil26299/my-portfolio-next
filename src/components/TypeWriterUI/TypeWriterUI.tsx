import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrayOfStringType } from "@/src/utilities";
/**
 * Interface of Typewriter UI component
 */
export interface TypeWriterUIPropTypes {
  botResponse: string;
  delay: number;
  useTypeWriter?: boolean;
  handleAnimationFinished?: () => void;
  textClass?: string;
}

function TypeWriterUI({
  botResponse,
  delay,
  useTypeWriter = true,
  handleAnimationFinished,
  textClass = "text-md",
}: TypeWriterUIPropTypes) {
  const [currentText, setCurrentText] = useState<ArrayOfStringType>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (useTypeWriter) {
      const botResponseArray = botResponse?.split(" ");
      if (currentIndex < botResponseArray.length) {
        const timeout = setTimeout(() => {
          setCurrentText((prev) => [...prev, botResponseArray[currentIndex]]);
          setCurrentIndex((prevIndex) => prevIndex + 1);
        }, delay);

        return () => clearTimeout(timeout);
      } else {
        setTimeout(() => {
          if (handleAnimationFinished) {
            handleAnimationFinished();
          }
        }, 250);
      }
    }
  }, [
    handleAnimationFinished,
    useTypeWriter,
    currentIndex,
    delay,
    botResponse,
  ]);
  return (
    <>
      <span className={textClass}>
        {currentText?.map((el, ind) => (
          <motion.span
            key={`${el}-${ind}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {el}{" "}
          </motion.span>
        ))}
      </span>
    </>
  );
}

export default TypeWriterUI;
