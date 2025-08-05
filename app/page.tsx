"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import ChatPopover from "@/src/components/ChatPopover/ChatPopover";
import { ThemeProvider } from "@/src/components/hoc/ThemeProvider";
import SidebarComponent from "@/src/components/Sidebar/Sidebar";
import React, { useCallback, useEffect, useState } from "react";
import Navbar from "@/src/components/navbar/Navbar";
import ProfilePage from "@/src/components/profilePage/ProfilePage";
import Footer from "@/src/components/footer/Footer";
// import Footer from "@/src/components/footer/Footer";

export default function page() {
  const [openSideBar, setOpenSideBar] = useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleMouseUp = () => {
      if (window) {
        const selectedText = window.getSelection()?.toString();
        console.log(selectedText, "selectedText");
      }
    };
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [mounted]);

  const handleToggleSidebar = useCallback((value: boolean) => {
    setOpenSideBar(value);
  }, []);

  if (!mounted) {
    return null; // Or render a loading skeleton
  }
  return (
    <ThemeProvider attribute={"class"} defaultTheme="dark">
      <SidebarProvider className="primary-background" open={openSideBar}>
        {/* <SidebarComponent
          handleToggleSidebar={handleToggleSidebar}
          sidebarState={openSideBar}
        /> */}
        <main className="w-full relative">
          {/* <DragComponent className="absolute top-40 left-20 z-0" /> */}
          <Navbar />
          <ProfilePage />
          <ChatPopover />
          <Footer />
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
}
