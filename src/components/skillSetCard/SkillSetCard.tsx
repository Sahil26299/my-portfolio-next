"use client";

import type React from "react";

import { motion } from "framer-motion";
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
} from "lucide-react";
import { details } from "@/src/utilities";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: any = {
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
    return <TabletSmartphone className="w-6 h-6" />;
  } else if (skill === "tailwind") {
    return <Palette className="w-6 h-6" />;
  } else if (skill === "nodejs") {
    return <Database className="w-6 h-6" />;
  } else if (skill === "git") {
    return <Github className="w-6 h-6" />;
  }else if (skill === "docker") {
    return <Container className="w-6 h-6" />;
  }else if (skill === "collaboration") {
    return <Users className="w-6 h-6" />;
  }else if (skill === "nextjs") {
    return <Zap className="w-6 h-6 " />;
  } else {
    return <Code className="w-6 h-6" />;
  }
};

const getProficiencyColor = (proficiency: number) => {
  if (proficiency >= 90) return "text-green-600 dark:text-green-400";
  if (proficiency >= 80) return "text-blue-600 dark:text-blue-400";
  if (proficiency >= 60) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
};

export default function SkillSetCards() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full min-w-[240px] mt-8"
    >
      {details.skills.map((skill) => (
        <motion.div
          key={skill.id}
          variants={cardVariants}
          whileHover={{
            scale: 1.02,
            transition: { duration: 0.2 },
          }}
          className="select-none"
          whileTap={{ scale: 0.98 }}
        >
          <Card className="h-full min-w-[240px] secondary-background backdrop-blur-sm custom-border-color border hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${skill.color} text-white`}>
                  {getSkillIcon(skill.id)}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {skill.category}
                </Badge>
              </div>
              <CardTitle className="text-lg-1 font-bold custom-text-primary">
                {skill.name}
              </CardTitle>
              <CardDescription className="custom-text-secondary">
                {skill.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Proficiency Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
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
                <div className="relative">
                  <Progress value={skill.proficiency} className="h-2" />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.proficiency}%` }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    className="absolute top-0 left-0 h-2 bg-gradient-to-r from-blue to-purple rounded-full"
                  />
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {skill.proficiency}% proficiency
                </span>
              </div>

              {/* Experience & Projects */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
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
                  <Code className="w-4 h-4 text-slate-500" />
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
      ))}
    </motion.div>
  );
}
