import { profilePic } from "@/public";
import { MapPin } from "lucide-react";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import TypeWriterUI from "../TypeWriterUI/TypeWriterUI";
import { Button } from "@/components/ui/button";
import SkillSetCards from "../skillSetCard/SkillSetCard";
import ExperienceSection from "../experienceSet/ExperienceSet";

function ProfilePage() {
  return (
    <div className="">
      <section className="flex flex-col items-center justify-center h-[calc(100vh-50px)] ">
        <section className="flex items-center gap-6 relative">
          <Image
            src={profilePic}
            alt="Profile pic"
            className="h-96 w-96 object-cover rounded-xl overflow-hidden"
          />
          <a
            href="https://maps.app.goo.gl/uc4KFEsGDKYhZHScA"
            target="_blank"
            className="text-green-500 absolute top-2 left-65 text-md-1 bg-dark_grey/80 px-2 py-1 rounded-sm font-medium flex items-center gap-1 cursor-pointer group"
          >
            <MapPin size={16} className="group-hover:animate-bounce" />{" "}
            <span className="text-white">Pune, India</span>
          </a>
          <section className="flex flex-col gap-2">
            <section className="custom-text-secondary font-medium flex items-center gap-2 text-md-1 border-b border-light_grey max-w-fit">
              <motion.a
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                href="mailto:sahillokhande94@gmail.com"
              >
                sahillokhande94@gmail.com
              </motion.a>{" "}
              •{" "}
              <motion.a
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                href="tel:+91 9175098814"
              >
                +91 9175098814
              </motion.a>{" "}
              •{" "}
              <motion.a
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                href="www.linkedin.com/in/sahillokhande26"
              >
                LinkedIn
              </motion.a>
            </section>
            <h2 className="text-2xl font-bold">Sahil Lokhande</h2>
            <TypeWriterUI
              botResponse="Frontend Developer Pioneering Interfaces with AI"
              delay={50}
              textClass="uppercase italic custom-text-secondary font-medium text-md"
            />
            <section className="flex items-center gap-2 mt-2">
              <a
                download={true}
                href="http://localhost:3000/files/sahilLokhandeCV.pdf"
              >
                <Button variant={"gradient"} className="w-fit text-content">
                  Download CV
                </Button>
              </a>
              <Button variant={"gradient"} className="w-fit text-content">
                Contact Me
              </Button>
            </section>
          </section>
        </section>
      </section>
      <section className="flex flex-col items-center p-8 gap-24">
        <section className="w-3/5 flex flex-col items-center">
          <h4 className="text-lg font-semibold custom-text-primary">
            My Skills & Expertise
          </h4>
          <span className="custom-text-secondary text-center text-md-1">
            A comprehensive overview of my technical skills, proficiency levels,
            and hands-on experience
          </span>
          <SkillSetCards />
        </section>
        <section className="w-3/5 flex flex-col items-center">
          <h4 className="text-lg font-semibold custom-text-primary">
            Professional Experience
          </h4>
          <span className="custom-text-secondary text-center text-md-1">
            My journey through different companies, the impact I've made, and
            how each experience has shaped my professional growth
          </span>
          <ExperienceSection/>
        </section>
      </section>
    </div>
  );
}

export default ProfilePage;
