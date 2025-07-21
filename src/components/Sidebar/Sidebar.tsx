"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  handleToggleSidebar: (key: boolean) => void;
  sidebarState: boolean;
}

function SidebarComponent({ handleToggleSidebar, sidebarState }: SidebarProps) {
  return (
    <Sidebar collapsible="icon" className="bg-background border-none">
      <SidebarHeader className="h-[45px] py-0 flex flex-row items-center border-none">
        <section className="flex items-center w-full justify-between">
          <Button
            size={"icon"}
            className="h-[35px] w-[35px]"
            onClick={() => handleToggleSidebar(!sidebarState)}
          >
            {sidebarState ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
          </Button>
        </section>
      </SidebarHeader>
      <SidebarSeparator className="mx-0" />
      <SidebarContent></SidebarContent>
      <SidebarSeparator className="mx-0" />
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}

export default SidebarComponent;
