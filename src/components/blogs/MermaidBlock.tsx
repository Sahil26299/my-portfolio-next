"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
});

interface MermaidBlockProps {
  code: string;
}

const MermaidBlock: React.FC<MermaidBlockProps> = ({ code }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    const render = async () => {
      if (ref.current && code) {
        try {
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          const { svg } = await mermaid.render(id, code);
          setSvg(svg);
        } catch (error) {
          console.error("Mermaid error:", error);
          setSvg("<div class='text-red-500'>Invalid Mermaid Syntax</div>");
        }
      }
    };

    render();
  }, [code]);

  return (
    <div
      className="mermaid-block my-4 p-4 border rounded bg-background flex justify-center overflow-x-auto"
      ref={ref}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default MermaidBlock;
