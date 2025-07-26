import { useState, useEffect, useRef } from "react";
import "./TypeWriterStyles.css";
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
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(false);
  // const chatCursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (useTypeWriter) {
      if (currentIndex < botResponse.length) {
        setShowCursor(true);
        const timeout = setTimeout(() => {
          setCurrentText((prevText) => prevText + botResponse[currentIndex]);
          setCurrentIndex((prevIndex) => prevIndex + 1);
          // if (chatCursorRef.current) {
          //   chatCursorRef.current.scrollIntoView({ behavior: "smooth" });
          // }
        }, delay);

        return () => clearTimeout(timeout);
      } else {
        setTimeout(() => {
          handleAnimationFinished && handleAnimationFinished();
          setShowCursor(false);
        }, 1000);
      }
    } else {
      setCurrentText(botResponse);
    }
  }, [currentIndex, delay, botResponse]);
  return (
    <>
      <span className={textClass}>
        {currentText}
        {showCursor && (
          <span
            // ref={chatCursorRef}
            className={`cursorAnimation text-md-1 font-md`}
          >
            |
          </span>
        )}
      </span>
    </>
  );
}

export default TypeWriterUI;
