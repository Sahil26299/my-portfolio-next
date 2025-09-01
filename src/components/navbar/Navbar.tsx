"use client";
import * as React from "react";
import { Download, Moon, Sun } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Image from "next/image";
import { profilePic } from "@/public";

function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      title={theme === "dark" ? "Switch to light" : "Switch to dark"}
      size={"icon"}
      className="shadow"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}

export default function Navbar() {
  return (
    <NavigationMenu
      viewport={false}
      className="primary-background w-full max-w-full justify-between h-[50px] px-4 shadow dark:border-b dark:border-bg-secondary-dark sticky top-0 z-10"
    >
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-content primary-background hover:bg-bg-secondary text-md-1">
            Profile
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-bg-secondary dark:bg-bg-secondary-dark custom-border-color">
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] p-0 ">
              <li className="row-span-3 lg:border-r lg:custom-border-color">
                <NavigationMenuLink asChild>
                  <div className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md">
                    <section className="mx-2 text-md font-medium flex flex-col gap-2 items-center">
                      <div className="h-24 w-24 rounded-full overflow-hidden">
                        <Image
                          src={profilePic}
                          alt="Profile pic"
                          className="h-full object-contain"
                        />
                      </div>
                      Sahil Lokhande
                    </section>
                    <p className="text-muted-foreground text-sm leading-tight self-center flex items-center gap-2">
                      <span>Fullstack AI</span>•
                      <a
                        className="h-5 w-5"
                        download={true}
                        target="_blank"
                        href={`${location.href}files/sahilLokhandeCV.pdf`}
                      >
                        <Download size={16} />
                      </a>
                    </p>
                  </div>
                </NavigationMenuLink>
              </li>
              <li className="text-sm pl-2" title="Introduction">
                <strong>Introduction</strong>
                <br />
                Fullstack AI Developer located in Pune, India 📌
              </li>
              <li className="text-sm pl-2" title="Technologies">
                <strong>Technologies</strong>
                <br />
                React Js | Next Js | React Native | Git | Docker | AWS-EC2 |
                Linux / Ubuntu
              </li>
              <li className="text-sm pl-2" title="Vision">
                <strong>Vision</strong>
                <br />
                Full-stack + AI developer | Leverage LLMs in frontend to build
                AI agents and deliver great user experiences.
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
      <ThemeToggleButton />
    </NavigationMenu>
  );
}
