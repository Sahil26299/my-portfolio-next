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
import { Lightbulb } from "lucide-react";
import { isMobile } from "react-device-detect";

function ProfilePage() {
  return (
    <div className="">
      <section
        id="about"
        className="flex flex-col items-center justify-center h-[calc(100svh-50px)] "
      >
        <section className="flex items-center md:flex-row flex-col gap-6 relative">
          <Image
            src={profilePic}
            alt="Profile pic"
            className="xl:h-96 xl:w-96 lg:h-84 lg:w-84 md:h-64 md:w-64 sm:h-84 sm:w-84 h-60 w-60 object-cover rounded-xl overflow-hidden"
          />
          <a
            href="https://maps.app.goo.gl/uc4KFEsGDKYhZHScA"
            target="_blank"
            className="text-green-500 absolute xl:top-2 xl:left-65 lg:top-2 lg:left-55 md:top-2 md:left-38 sm:top-2 sm:left-62 top-2 left-53 text-md-1 bg-dark_grey/80 px-2 py-1 rounded-sm font-medium flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full group-hover:animate-ping" />
            </div>{" "}
            <span className="text-white lg:text-md-1 md:text-sm sm:text-md-1 text-sm">
              Pune, India
            </span>
          </a>
          <section className="flex flex-col md:text-left md:items-start items-center text-center gap-2 px-3">
            <section className="custom-text-secondary font-medium flex items-center gap-2 lg:text-md-1 sm:text-sm text-[11px] border-b border-light_grey max-w-fit">
              <motion.a
                target="_blank"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                href={`mailto:${details.email}`}
              >
                {details.email}
              </motion.a>{" "}
              •{" "}
              <motion.a
                target="_blank"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                href={`tel:${details.phone}`}
              >
                {details.phone}
              </motion.a>{" "}
              •{" "}
              <motion.a
                target="_blank"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                href={details.linkedin}
              >
                LinkedIn
              </motion.a>
            </section>
            <h2 className="lg:text-2xl sm:text-xl text-[36px] font-bold bg-gradient-to-r from-blue to-purple bg-clip-text text-transparent">
              Sahil Lokhande
            </h2>
            <TypeWriterUI
              botResponse="Frontend Developer Pioneering Interfaces with AI"
              delay={50}
              textClass="uppercase italic custom-text-secondary font-medium lg:text-md text-md-1"
            />
            <section className="flex items-center gap-2 mt-2">
              <GradientButton />
            </section>
          </section>
        </section>
      </section>
      <section className="flex flex-col items-center p-8 gap-24">
        <section
          id="skills"
          className="lg:w-3/5 w-4/5 flex flex-col items-center py-10"
        >
          <h4 className="text-lg font-semibold custom-text-primary text-center">
            My Skills & Expertise
          </h4>
          <span className="custom-text-secondary text-center text-md-1">
            A comprehensive overview of my technical skills, proficiency levels,
            and hands-on experience
          </span>
          <span className="custom-text-secondary text-center text-md-1 flex items-center gap-1">
            <Lightbulb size={16} className="text-yellow-400 animate-pulse" />
            Tip:{" "}
            {isMobile
              ? `Tap and hold (or right click for PC)`
              : `Right click (or tap and hold if using mobile)`}{" "}
            on any skill card to know more about it.
          </span>
          <SkillSetCards />
        </section>
        <section
          id="experience"
          className="lg:w-3/5 w-4/5 flex flex-col items-center py-10"
        >
          <h4 className="text-lg text-center font-semibold custom-text-primary">
            Professional Experience
          </h4>
          <span className="custom-text-secondary text-center text-md-1">
            My journey through different companies, the impact I´ve made, and
            how each experience has shaped my professional growth
          </span>
          <span className="custom-text-secondary text-center text-md-1 flex items-center gap-1">
            <Lightbulb size={16} className="text-yellow-400 animate-pulse" />
            Tip:{" "}
            {isMobile
              ? `Tap and hold (or right click for PC)`
              : `Right click (or tap and hold if using mobile)`}{" "}
            on any experience card to know more about it.
          </span>
          <ExperienceSection />
        </section>

        <section className="pt-10 pb-20 lg:w-3/5 w-4/5 text-center">
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
