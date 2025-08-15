"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import ChatPopover from "@/src/components/ChatPopover/ChatPopover";
import { ThemeProvider } from "@/src/components/hoc/ThemeProvider";
import { useCallback, useEffect, useState } from "react";
import Navbar from "@/src/components/navbar/Navbar";
import ProfilePage from "@/src/components/profilePage/ProfilePage";
import Footer from "@/src/components/footer/Footer";

export default function Page() {
  const [openSideBar, setOpenSideBar] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    handleFetchData();
  }, []);
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

  /**
   * This API call will check if vectors are present in the store, if not then it will add vectors in the store.
   * Else it will do nothing just return.
   */
  const handleFetchData = async () => {
    try {
      const response = await fetch("/api/initialize-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const jsonResponse = await response.json();
      // const parsedResponse = JSON.parse(response);
      console.log(jsonResponse, "jsonResponse");
      if (jsonResponse?.status === 200 && jsonResponse?.data?.length === 0) {
      }
    } catch (error) {
      console.log(error);
    }
  };

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
