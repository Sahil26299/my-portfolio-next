"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink, Code2, Layers } from "lucide-react";
import { details } from "@/src/utilities";
import Image from "next/image";

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
  console.log(projects, "projects");

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      className="flex items-center justify-evenly gap-6 w-full mt-8"
    >
      {projects.map((project: Project) => (
        <motion.div
          key={project.id}
          variants={cardVariants}
          whileHover={{
            scale: 1.02,
            transition: { duration: 0.2 },
          }}
          className="flex w-[480px]"
        >
          <Card className="flex flex-col w-full secondary-background backdrop-blur-sm custom-border-color border hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex justify-between items-start w-full">
                <div className="p-2 bg-purple text-white rounded-lg mb-4">
                  <Code2 className="w-6 h-6" />
                </div>
                <div className="flex gap-3">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                      title="View Code"
                    >
                      <Github className="w-5 h-5" />
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
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
              <a href={project.links.live}>
                <Image
                    src={project?.image || ""}
                    alt={project.title}
                    width={440}
                    height={200}
                    className="w-[440px] h-[200px] object-cover object-top rounded-lg border border-slate-800 mx-auto "
                />
              </a>
              <CardTitle className="text-lg-1 font-bold custom-text-primary mt-3">
                {project.title}
              </CardTitle>
              <CardDescription className="custom-text-secondary line-clamp-3">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Layers className="w-3 h-3" /> Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
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
      ))}
    </motion.div>
  );
}
