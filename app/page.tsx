"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import ChatPopover from "@/src/components/ChatPopover/ChatPopover";
import { ThemeProvider } from "@/src/components/hoc/ThemeProvider";
import SidebarComponent from "@/src/components/Sidebar/Sidebar";
import React, { useCallback, useState } from "react";
import Navbar from "@/src/components/navbar/Navbar";

export default function page() {
  const [openSideBar, setOpenSideBar] = useState(false);

  const handleToggleSidebar = useCallback((value: boolean) => {
    setOpenSideBar(value);
  }, []);

  return (
    <ThemeProvider>
      <SidebarProvider className="bg-background" open={openSideBar}>
        <SidebarComponent
          handleToggleSidebar={handleToggleSidebar}
          sidebarState={openSideBar}
        />
        <main className="w-full bg-background">
          <Navbar />
          <ChatPopover />
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
}
