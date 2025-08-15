"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Linkedin,
  Github,
  ArrowUp,
  Code,
  Briefcase,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { details } from "@/src/utilities";

const socialLinks = [
  {
    name: "LinkedIn",
    icon: <Linkedin className="w-5 h-5" />,
    url: details.linkedin,
    color: "hover:bg-blue-100 hover:text-blue-700",
  },
  {
    name: "GitHub",
    icon: <Github className="w-5 h-5" />,
    url: details.github,
    color: "hover:text-gray-900 hover:bg-gray-50",
  },
  {
    name: "Email",
    icon: <Mail className="w-5 h-5" />,
    url: `mailto:${details.email}`,
    color: "hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20",
  },
  {
    name: "Phone",
    icon: <Phone className="w-5 h-5" />,
    url: `tel:${details.phone}`,
    color:
      "hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20",
  },
];

const navigationLinks = [
  {
    name: "About",
    icon: <User className="w-4 h-4" />,
    href: "#about",
  },
  {
    name: "Skills",
    icon: <Code className="w-4 h-4" />,
    href: "#skills",
  },
  {
    name: "Experience",
    icon: <Briefcase className="w-4 h-4" />,
    href: "#experience",
  },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white w-full">
      {/* Main Footer Content */}
      <div className="w-3/4 mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue to-purple bg-clip-text text-transparent">
              Sahil lokhande
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Passionate full-stack developer creating innovative web/mobile
              solutions. Turning ideas into reality through clean code and
              thoughtful design.
            </p>
            <div className="flex items-center space-x-2 text-sm custom-text-secondary">
              <div className="w-2 h-2 bg-green-400 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
              </div>
              <span>Available for new opportunities</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4 pl-8"
          >
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <nav className="space-y-2">
              {navigationLinks.map((link) => (
                <motion.button
                  key={link.name}
                  onClick={() =>
                    link.name === "About"
                      ? scrollToTop()
                      : scrollToSection(link.href)
                  }
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors duration-200 group"
                >
                  <span className="group-hover:text-blue-400 transition-colors duration-200">
                    {link.icon}
                  </span>
                  <span>{link.name}</span>
                </motion.button>
              ))}
            </nav>
          </motion.div>

          {/* Contact & Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-white">
              Connect With Me
            </h4>
            <div className="flex items-center flex-wrap w-[240px] gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target={
                    social.name !== "Email" && social.name !== "Phone"
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    social.name !== "Email" && social.name !== "Phone"
                      ? "noopener noreferrer"
                      : undefined
                  }
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 rounded-lg transition-all duration-200 flex items-center justify-center ${social.color}`}
                  title={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-2 pt-4">
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>{details.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <Phone className="w-4 h-4 text-green-400" />
                <span>{details.phone}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-3/4 mx-auto border-t border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-sm text-slate-400"
            >
              <p>
                © {new Date().getFullYear()} Sahil Lokhande. All rights
                reserved.
                <span className="ml-2">
                  Built with ❤️ using Fullstack + AI in just 1 day
                </span>
              </p>
            </motion.div>

            {/* Back to Top Button */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Button
                onClick={scrollToTop}
                variant="outline"
                size="sm"
                className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200"
              >
                <ArrowUp className="w-4 h-4 mr-2" />
                Back to Top
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
    </footer>
  );
}
