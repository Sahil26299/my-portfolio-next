"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Calendar,
  TrendingUp,
  Award,
  Code2,
  Target,
  Lightbulb,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"; // ES 2015
import { details } from "@/src/utilities";

dayjs.extend(relativeTime);

interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  period: string;
  location: string;
  companyType: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  achievements: string;
  companyImpact: {
    metric: string;
    improvement: string;
    description: string;
  };
  personalGrowth: {
    skills: string[];
    leadership: string;
    challenges: string;
  };
  teamSize: string;
  projects: number;
}

const experiences: Experience[] = [
  {
    id: "current",
    company: "Pyrack",
    role: "Senior Frontend Developer",
    duration: `${dayjs("2023-09-04").fromNow(true)}`,
    period: "Sept 2023 - Present",
    location: "Pune, India",
    companyType: "AI Startup",
    description:
      "Leading development of enterprise-grade web applications and mentoring junior developers in a fast-paced startup environment.",
    responsibilities: [
      "Architected and developed scalable React/Next.js applications.",
      "Led a team of 5 developers in implementing new product features",
      "Optimized application performance resulting in 40% faster load times",
      "Established code review processes and development best practices",
    ],
    technologies: [
      "React",
      "Next.js",
      "TypeScript",
      "Redux toolkit (RTK)",
      "AWS",
      "Docker",
    ],
    achievements:
      "Enhanced team productivity by implementing linting rules, establishing consistent project structures, and initiating regular team syncs to ensure smooth collaboration. Proactively contributed across multiple projects, introduced test cases to reduce production issues, and laid the groundwork for scalable development.",
    companyImpact: {
      metric: "Revenue Growth",
      improvement: "+25%",
      description:
        "New features and performance improvements contributed to significant revenue increase and customer retention",
    },
    personalGrowth: {
      skills: [
        "Team Leadership",
        "System Architecture",
        "Performance Optimization",
        "Mentoring",
      ],
      leadership:
        "Transitioned from individual contributor to team lead, managing project timelines and technical decisions",
      challenges:
        "Learned to balance technical debt with feature delivery while maintaining code quality standards",
    },
    teamSize: "5 developers",
    projects: 15,
  },
  {
    id: "previous",
    company: "Mobiloitte Technologies",
    role: "React Native Developer",
    duration: "1.2 years",
    period: "April 2022 - June 2023",
    location: "Pune, India",
    companyType: "IT Services & Consulting",
    description:
      "Developed responsive mobile applications for diverse clients ranging from startups to large scale MNCs.",
    responsibilities: [
      "Built 6+ client mobile applications using React Native and modern its modern tools like Redux Toolkit (RTK), Firebase and Payment gateways",
      "Collaborated with UX/UI designers to implement pixel-perfect designs",
      "Integrated third-party APIs and payment systems",
      "Maintained and updated legacy codebases",
    ],
    technologies: [
      "React native",
      "Redux toolkit (RTK)",
      "JavaScript",
      "Firebase",
      "REST APIs",
      "Razorpay / Stripe",
    ],
    achievements:
      "Gained valuable exposure to mobile application development, including app behavior and architectural patterns, contributing to both industry-standard practices and my personal professional growth.",
    companyImpact: {
      metric: "Client Retention",
      improvement: "+15%",
      description:
        "Mid-High quality deliverables and technical expertise led to increased client retention and referrals",
    },
    personalGrowth: {
      skills: [
        "UI development",
        "API Integration",
        "Client Communication",
        "Project Management",
        "Cross-platform Compatibility",
      ],
      leadership:
        "Learned to communicate technical concepts to non-technical stakeholders effectively",
      challenges:
        "Adapted to working with diverse tech stacks and tight deadlines while maintaining quality",
    },
    teamSize: "6 developers",
    projects: 8,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants: any = {
  hidden: {
    opacity: 0,
    x: -50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function ExperienceSection() {
  return (
    <div className="w-full mt-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative"
      >
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue via-purple to-green-500 hidden md:block" />

        <div className="space-y-8">
          {details.experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              variants={cardVariants}
              //   whileHover={{ scale: 1.01 }}
              className="relative group"
            >
              {/* Timeline Dot */}
              <div className="absolute left-6 top-8 w-4 h-4 bg-blue rounded-full border-4 border-white dark:border-slate-800 shadow-lg hidden md:block z-10" />
              <div className="group-hover:animate-ping absolute left-6 top-8 w-4 h-4 bg-blue rounded-full border-4 border-white dark:border-slate-800 shadow-lg hidden md:block z-10" />

              <Card className="hover:scale-[1.01] ml-0 md:ml-16 secondary-background backdrop-blur-sm custom-border-color hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue text-white rounded-lg">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg-1 font-bold custom-text-primary">
                          {exp.role}
                        </CardTitle>
                        <p className="text-md font-semibold text-blue-600 dark:text-blue-400">
                          {exp.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="text-xs custom-border-color"
                      >
                        <Calendar className="w-3 h-3 mr-1" />
                        {exp.period}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-xs bg-dark_grey/10 dark:bg-dark_grey/20"
                      >
                        {exp.companyType}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="custom-text-secondary text-base">
                    {exp.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Key Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {exp.duration}
                      </p>
                      <p className="text-xs custom-text-secondary">Duration</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {exp.projects}
                      </p>
                      <p className="text-xs custom-text-secondary">Projects</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {exp.teamSize}
                      </p>
                      <p className="text-xs custom-text-secondary">Team Size</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                        {exp.location}
                      </p>
                      <p className="text-xs custom-text-secondary">Location</p>
                    </div>
                  </div>

                  {/* Responsibilities */}
                  <div>
                    <h4 className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                      <Target className="w-4 h-4 mr-2" />
                      Key Responsibilities
                    </h4>
                    <ul className="space-y-2">
                      {exp.responsibilities.map((resp, idx) => (
                        <li
                          key={idx}
                          className="flex items-start space-x-2 text-sm custom-text-secondary"
                        >
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h4 className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                      <Code2 className="w-4 h-4 mr-2" />
                      Technologies Used
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <Badge
                          key={tech}
                          variant="outline"
                          className="text-xs custom-border-color"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div>
                    <h4 className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                      <Award className="w-4 h-4 mr-2" />
                      Key Achievements
                    </h4>
                    <span className="flex items-start space-x-2 text-sm custom-text-secondary">
                      {exp.achievements}
                    </span>
                  </div>

                  {/* Impact & Growth */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Company Impact */}
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <h4 className="flex items-center text-sm font-semibold text-green-700 dark:text-green-300 mb-2">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Company Impact
                      </h4>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                          {exp.companyImpact.improvement}
                        </span>
                        <span className="text-sm text-green-600 dark:text-green-400">
                          {exp.companyImpact.metric}
                        </span>
                      </div>
                      <p className="text-xs text-green-700 dark:text-green-300">
                        {exp.companyImpact.description}
                      </p>
                    </div>

                    {/* Personal Growth */}
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h4 className="flex items-center text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Personal Growth
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-purple-600 dark:text-purple-400">
                            Skills Gained:
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {exp.personalGrowth.skills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="outline"
                                className="text-xs bg-purple-100 dark:bg-purple custom-border-color"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-purple-700 dark:text-purple-300">
                          {exp.personalGrowth.challenges}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
