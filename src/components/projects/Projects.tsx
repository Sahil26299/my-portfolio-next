"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink, Code2, Layers, Quote } from "lucide-react";
import {
  details,
  getSessionStorageItem,
  keys,
  setSessionStorageItem,
} from "@/src/utilities";
import Image from "next/image";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { chatLimit } from "../ChatPopover/ChatPopover";

interface Project {
  id: string;
  title: string;
  description: string;
  links: {
    live: string;
    github: string;
  };
  image?: string;
  technologies: string[];
  features: string[];
  prompt: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function Projects() {
  const projects = (details as any).projects || [];
  const [disablePrompts, setDisablePrompts] = useState(false);

  useEffect(() => {
    const handleSessionChange = () => {
      const currentChatCount = getSessionStorageItem(keys.CURRENT_CHATS_DONE);
      setDisablePrompts(currentChatCount === chatLimit);
    };
    window.addEventListener("sessionStorageUpdated", handleSessionChange);

    return () => {
      window.removeEventListener("sessionStorageUpdated", handleSessionChange);
    };
  }, []);

  const handleAskAssistant = (prompt: string) => {
    setSessionStorageItem(keys.SUBMIT_USER_PROMPT_FROM_OUTSIDE, {
      from: "projects",
      prompt,
    });
  };

  console.log(projects, "projects");

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      className="flex flex-wrap items-center justify-center lg:gap-6 md:gap-4 gap-2 w-full mt-8 "
    >
      {projects.map((project: Project) => (
        <ContextMenu key={project.id}>
          <ContextMenuTrigger className="xl:min-w-[450px] lg:min-w-[350px] md:min-w-[300px] min-w-[240px] flex flex-col flex-1" >
            <motion.div
              variants={cardVariants}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              className="flex w-full h-full"
            >
              <Card className="flex flex-col w-full h-full secondary-background backdrop-blur-sm custom-border-color border hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="sm:pb-4 pb-0 sm:px-6 px-3" >
                  <div className="flex justify-between items-start w-full">
                    <div className="p-2 bg-purple text-white rounded-lg mb-4">
                      <Code2 className="lg:w-6 lg:h-6 sm:w-5 sm:h-5 w-4 h-4" />
                    </div>
                    <div className="flex lg:gap-3 sm:gap-4 gap-2">
                      {project.links.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                          title="View Code"
                        >
                          <Github className="lg:w-5 lg:h-5 w-4 h-4" />
                        </a>
                      )}
                      {project.links.live && (
                        <a
                          href={project.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="Live Demo"
                        >
                          <ExternalLink className="lg:w-5 lg:h-5 w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  <a
                    href={project.links.live}
                    className="block w-full sm:h-[200px] h-[160px] relative mb-3"
                  >
                    <Image
                      src={project?.image || ""}
                      alt={project.title}
                      width={440}
                      height={200}
                      className="h-full w-full object-cover object-top rounded-lg border border-slate-800 mx-auto "
                    />
                  </a>
                  <CardTitle className="lg:text-lg-1 md:text-md text-md-1 font-bold custom-text-primary mt-3">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="custom-text-secondary sm:text-md-1 text-xs sm:line-clamp-3 line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4 sm:pb-4 pb-0 sm:px-6 px-3">
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Layers className="w-3 h-3" /> Tech Stack
                    </h4>
                    <div className="flex-wrap gap-2 sm:flex hidden">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="text-xs bg-blue/10 text-blue font-medium dark:bg-blue/20 dark:text-blue-300"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 4 && (
                        <Badge
                          variant="outline"
                          className="text-xs custom-border-color"
                        >
                          +{project.technologies.length - 4}
                        </Badge>
                      )}
                    </div>
                    <div className="sm:hidden flex flex-wrap gap-1">
                      {project.technologies.slice(0, 2).map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="text-xs bg-blue/10 text-blue font-medium dark:bg-blue/20 dark:text-blue-300"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 4 && (
                        <Badge
                          variant="outline"
                          className="text-xs custom-border-color"
                        >
                          +{project.technologies.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t custom-border-color">
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Key Features
                    </h4>
                    <ul className="list-disc list-inside text-sm custom-text-secondary space-y-1">
                      {project.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="line-clamp-1">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </ContextMenuTrigger>
          <ContextMenuContent className="border-none secondary-background-converse">
            <ContextMenuItem
              onClick={() => handleAskAssistant(project.prompt)}
              disabled={disablePrompts}
              className="custom-text-primary-converse hover:bg-dark_grey/10 dark:hover:border-dark_grey/20 hover:underline cursor-pointer md:w-full w-[240px]"
            >
              <Quote size={16} className="text-purple" /> Ask more about{" "}
              {project.title} to assistant?{" "}
              {disablePrompts ? "Sorry your limit reached!" : ""}
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))}
    </motion.div>
  );
}
