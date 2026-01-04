"use client";

import type React from "react";

import { motion, Variants } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Code,
  Zap,
  Users,
  Database,
  Palette,
  TabletSmartphone,
  Container,
  Github,
  Quote,
} from "lucide-react";
import {
  details,
  getSessionStorageItem,
  keys,
  setSessionStorageItem,
} from "@/src/utilities";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useEffect, useState } from "react";
import { chatLimit } from "../ChatPopover/ChatPopover";

const containerVariants = {
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

const getProficiencyLabel = (proficiency: number) => {
  if (proficiency >= 90) return "Expert";
  if (proficiency >= 80) return "Advanced";
  if (proficiency >= 60) return "Intermediate";
  return "Beginner";
};

const getSkillIcon = (skill: string) => {
  if (skill === "reactnative") {
    return <TabletSmartphone className="sm:w-6 sm:h-6 w-4 h-4" />;
  } else if (skill === "tailwind") {
    return <Palette className="sm:w-6 sm:h-6 w-4 h-4" />;
  } else if (skill === "nodejs") {
    return <Database className="sm:w-6 sm:h-6 w-4 h-4" />;
  } else if (skill === "git") {
    return <Github className="sm:w-6 sm:h-6 w-4 h-4" />;
  } else if (skill === "docker") {
    return <Container className="sm:w-6 sm:h-6 w-4 h-4" />;
  } else if (skill === "collaboration") {
    return <Users className="sm:w-6 sm:h-6 w-4 h-4" />;
  } else if (skill === "nextjs") {
    return <Zap className="sm:w-6 sm:h-6 w-4 h-4" />;
  } else {
    return <Code className="sm:w-6 sm:h-6 w-4 h-4" />;
  }
};

const getProficiencyColor = (proficiency: number) => {
  if (proficiency >= 90) return "text-green-600 dark:text-green-400";
  if (proficiency >= 80) return "text-blue-600 dark:text-blue-400";
  if (proficiency >= 60) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
};

export default function SkillSetCards() {
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
      from: "skills",
      prompt,
    });
  };
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 md:gap-6 sm:gap-4 gap-2 w-full md:mt-8 sm:mt-6 mt-4"
    >
      {details.skills.map((skill) => (
        <ContextMenu key={skill.id}>
          <ContextMenuTrigger>
            <motion.div
              variants={cardVariants}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              className="select-none h-full"
              whileTap={{ scale: 0.98 }}
            >
              <Card className="h-full lg:min-w-[200px] sm:min-w-[240px] min-w-[120px] secondary-background backdrop-blur-sm custom-border-color border hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="sm:pb-4 pb-0 sm:px-6 px-3">
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`p-2 rounded-lg ${skill.color} text-white sm:flex hidden`}
                    >
                      {getSkillIcon(skill.id)}
                    </div>
                    <CardTitle className={`text-[14px] font-bold custom-text-primary sm:hidden flex items-center gap-2`}>
                      {getSkillIcon(skill.id)}
                      {skill.name}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className="text-xs custom-text-secondary sm:flex hidden"
                    >
                      {skill.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg-1 font-bold custom-text-primary sm:flex hidden">
                    {skill.name}
                  </CardTitle>
                  <CardDescription className="custom-text-secondary sm:line-clamp-6 line-clamp-2">
                    {skill.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="sm:space-y-4 space-y-2 sm:px-6 px-3">
                  {/* Proficiency Section */}
                  <div className="space-y-2">
                    <div className="hidden sm:flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Proficiency
                      </span>
                      <span
                        className={`text-sm font-semibold ${getProficiencyColor(
                          skill.proficiency
                        )}`}
                      >
                        {getProficiencyLabel(skill.proficiency)}
                      </span>
                    </div>
                    <div className="relative sm:block hidden">
                      <Progress value={skill.proficiency} className="h-2" />
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.proficiency}%` }}
                        transition={{
                          duration: 1,
                          delay: 0.5,
                          ease: "easeOut",
                        }}
                        className="absolute top-0 left-0 h-2 bg-gradient-to-r from-blue to-purple rounded-full"
                      />
                    </div>
                    <span
                      className={`text-xs sm:text-slate-500 sm:dark:text-slate-400 ${getProficiencyColor(
                        skill.proficiency
                      )}`}
                    >
                      {skill.proficiency}% proficiency
                    </span>
                  </div>

                  {/* Experience & Projects */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-slate-500 sm:flex hidden" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Experience
                        </p>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {skill.experience}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Code className="w-4 h-4 text-slate-500 sm:flex hidden" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Projects
                        </p>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {skill.projects}+
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </ContextMenuTrigger>
          <ContextMenuContent className="border-none secondary-background-converse">
            <ContextMenuItem
              onClick={() => handleAskAssistant(skill.prompt)}
              disabled={disablePrompts}
              className="custom-text-primary-converse hover:bg-dark_grey/10 dark:hover:border-dark_grey/20 hover:underline cursor-pointer md:w-full w-[240px]"
            >
              <Quote size={16} className="text-purple" /> Ask more about{" "}
              {skill.name}({skill.category}) to assistant?{" "}
              {disablePrompts ? "Sorry your limit reached!" : ""}
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))}
    </motion.div>
  );
}
