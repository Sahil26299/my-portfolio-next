import { profilePic } from "@/public";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import TypeWriterUI from "../TypeWriterUI/TypeWriterUI";
import SkillSetCards from "../skillSetCard/SkillSetCard";
import ExperienceSection from "../experienceSet/ExperienceSet";
import GradientButton from "../gradientButton/GradientButton";
import dayjs from "dayjs";
import { details } from "@/src/utilities";

function ProfilePage() {
  return (
    <div className="">
      <section
        id="about"
        className="flex flex-col items-center justify-center h-[calc(100vh-50px)] "
      >
        <section className="flex items-center gap-6 relative">
          <Image
            src={profilePic}
            alt="Profile pic"
            className="h-96 w-96 object-cover rounded-xl overflow-hidden"
          />
          <a
            href="https://maps.app.goo.gl/uc4KFEsGDKYhZHScA"
            target="_blank"
            className="text-green-500 absolute top-2 left-65 text-md-1 bg-dark_grey/80 px-2 py-1 rounded-sm font-medium flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full group-hover:animate-ping" />
            </div>{" "}
            <span className="text-white">Pune, India</span>
          </a>
          <section className="flex flex-col gap-2">
            <section className="custom-text-secondary font-medium flex items-center gap-2 text-md-1 border-b border-light_grey max-w-fit">
              <motion.a
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                href={`mailto:${details.email}`}
              >
                {details.email}
              </motion.a>{" "}
              •{" "}
              <motion.a
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                href={`tel:${details.phone}`}
              >
                {details.phone}
              </motion.a>{" "}
              •{" "}
              <motion.a
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                href={details.linkedin}
              >
                LinkedIn
              </motion.a>
            </section>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue to-purple bg-clip-text text-transparent">
              Sahil Lokhande
            </h2>
            <TypeWriterUI
              botResponse="Frontend Developer Pioneering Interfaces with AI"
              delay={50}
              textClass="uppercase italic custom-text-secondary font-medium text-md"
            />
            <section className="flex items-center gap-2 mt-2">
              <GradientButton />
            </section>
          </section>
        </section>
      </section>
      <section className="flex flex-col items-center p-8 gap-24">
        <section id="skills" className="w-3/5 flex flex-col items-center py-10">
          <h4 className="text-lg font-semibold custom-text-primary">
            My Skills & Expertise
          </h4>
          <span className="custom-text-secondary text-center text-md-1">
            A comprehensive overview of my technical skills, proficiency levels,
            and hands-on experience
          </span>
          <SkillSetCards />
        </section>
        <section
          id="experience"
          className="w-3/5 flex flex-col items-center py-10"
        >
          <h4 className="text-lg font-semibold custom-text-primary">
            Professional Experience
          </h4>
          <span className="custom-text-secondary text-center text-md-1">
            My journey through different companies, the impact I've made, and
            how each experience has shaped my professional growth
          </span>
          <ExperienceSection />
        </section>

        <section className="pt-10 pb-20 w-3/5 text-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
            Ready to Work Together?
          </h2>
          <p className="text-md text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Download my resume to learn more about my experience, or get in
            touch to discuss your next project.
          </p>
          <GradientButton className="mb-8" />
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Last updated: {dayjs().format("MMMM DD, YYYY")}
          </div>
        </section>
      </section>
    </div>
  );
}

export default ProfilePage;
