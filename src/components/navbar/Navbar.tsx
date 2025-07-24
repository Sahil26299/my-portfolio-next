"use client";
import * as React from "react";
import Link from "next/link";
import {
  CircleCheckIcon,
  CircleHelpIcon,
  CircleIcon,
  Download,
  Moon,
  Sun,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Image from "next/image";
import { profilePic } from "@/public";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      title={theme}
      size={"icon"}
      className=""
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}

export default function Navbar() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null; // Or render a loading skeleton
  }
  return (
    <NavigationMenu
      viewport={false}
      className="w-full max-w-full justify-between h-[50px] px-4 shadow in-dark:shadow-none"
    >
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-content bg-bg_primary hover:bg-bg_secondary text-md-1">
            Profile
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-bg_secondary border-dark_grey/10 dark:border-red">
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] p-0 ">
              <li className="row-span-3 border-r border-dark_grey/10 ">
                <NavigationMenuLink asChild>
                  <div
                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                  >
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
                      <span>Software developer</span>• 
                      <Button size="icon" className="h-5 w-5">
                        <Download size={16} />
                      </Button>
                    </p>
                  </div>
                </NavigationMenuLink>
              </li>
              <li className="text-sm pl-2" title="Introduction">
                <strong>Introduction</strong><br />
                Frontend Software Engineer located in Pune, India 📌
              </li>
              <li className="text-sm pl-2" title="Technologies">
                <strong>Technologies</strong><br />
                HTML | CSS | JS | TS | React Js | Next Js | React Native
              </li>
              <li className="text-sm pl-2" title="Vision">
                <strong>Vision</strong><br />
                Full-stack + AI developer | Leverage LLMs in frontend to build AI agents and deliver great user experiences.
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
      <ThemeToggleButton />
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
