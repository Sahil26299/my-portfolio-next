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
  GitPullRequestArrow,
} from "lucide-react";

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  experience: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  projects: number;
}

const skills: Skill[] = [
  {
    id: "reactnative",
    name: "React Native",
    category: "Frontend",
    proficiency: 75,
    experience: "3+ years",
    description:
      "Bringing mobile ideas to life with React Native — I build cross-platform apps that feel native and perform seamlessly.",
    icon: <TabletSmartphone className="w-6 h-6" />,
    color: "bg-cyan-500",
    projects: 8,
  },
  {
    id: "react",
    name: "React.js",
    category: "Frontend",
    proficiency: 80,
    experience: "3+ years",
    description:
      "From scalable architecture to optimized rendering, I build dynamic, high-performance web apps with React at the core.",
    icon: <Code className="w-6 h-6" />,
    color: "bg-blue",
    projects: 15,
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "Full-stack",
    proficiency: 65,
    experience: "2+ years",
    description:
      "Combining SSR, API routes, and seamless routing — I craft performant and SEO-friendly web applications using Next.js.",
    icon: <Zap className="w-6 h-6 " />,
    color: "bg-black dark:bg-white custom-text-primary-converse",
    projects: 5,
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "Language",
    proficiency: 75,
    experience: "2.5+ years",
    description:
      "Strong expertise in TypeScript for type-safe development, advanced types, generics, and building scalable applications with better developer experience.",
    icon: <Code className="w-6 h-6" />,
    color: "bg-blue",
    projects: 18,
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "Styling",
    proficiency: 92,
    experience: "2+ years",
    description:
      "Design meets code — I craft elegant, responsive UIs rapidly with Tailwind CSS, ensuring pixel precision and clean utility-first styling.",
    icon: <Palette className="w-6 h-6" />,
    color: "bg-cyan-500",
    projects: 18,
  },
  {
    id: "git",
    name: "Git",
    category: "Version Control",
    proficiency: 85,
    experience: "3+ years",
    description:
      "Version control isn't just a habit — it's second nature. I manage branches, resolve conflicts, and streamline collaboration with Git like a pro.",
    icon: <GitPullRequestArrow className="w-6 h-6 " />,
    color: "bg-black dark:bg-white custom-text-primary-converse",
    projects: 22,
  },
  {
    id: "docker",
    name: "Docker",
    category: "Containerization",
    proficiency: 65,
    experience: "2+ years",
    description:
      "I containerize applications with Docker for consistent and lightweight deployment — from dev to staging, effortlessly.",
    icon: <Container className="w-6 h-6" />,
    color: "bg-blue",
    projects: 12,
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "Backend",
    proficiency: 80,
    experience: "2+ years",
    description:
      "Solid experience in server-side JavaScript, building RESTful APIs, working with databases, authentication, and deploying scalable backend solutions.",
    icon: <Database className="w-6 h-6" />,
    color: "bg-green-600",
    projects: 3,
  },
  {
    id: "collaboration",
    name: "Team Collaboration",
    category: "Soft Skills",
    proficiency: 65,
    experience: "4+ years",
    description:
      "I thrive in collaborative environments — bridging communication, code reviews, and task ownership to drive team success",
    icon: <Users className="w-6 h-6" />,
    color: "bg-purple",
    projects: 6,
  },
];

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
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-8"
    >
      {skills.map((skill) => (
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
          <Card className="h-full secondary-background backdrop-blur-sm custom-border-color border-2 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${skill.color} text-white`}>
                  {skill.icon}
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
