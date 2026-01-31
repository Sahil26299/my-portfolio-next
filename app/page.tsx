"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import ChatPopover from "@/src/components/ChatPopover/ChatPopover";
import { ThemeProvider } from "@/src/components/hoc/ThemeProvider";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Navbar from "@/src/components/navbar/Navbar";
import ProfilePage from "@/src/components/profilePage/ProfilePage";
import Footer from "@/src/components/footer/Footer";
import { chatRecords, getSessionStorageItem, keys } from "@/src/utilities";

export default function Page() {
  const [openSideBar, setOpenSideBar] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [openChatPopover, setOpenChatPopover] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");
  const [chatRecords, setChatRecords] = useState<chatRecords[]>([]);
  const scrollingRef = useRef<HTMLDivElement | null>(null);

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
  
  const handleScrollToBottom = useCallback(() => {
    if (scrollingRef?.current) {
      scrollingRef.current.scrollTo({
        top: 9999,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    console.log(scrollingRef?.current,'scrollingRef?.current', openChatPopover, "openChatPopover");
    if (openChatPopover) {
      // Use requestAnimationFrame to ensure the ref is attached after component mount
      requestAnimationFrame(() => {
        if (scrollingRef?.current) {
          handleScrollToBottom();
        }
      });
    }
  }, [openChatPopover, handleScrollToBottom]);

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
      if (jsonResponse?.status === 200 && jsonResponse?.data?.length === 0) {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const chatListmemoized = useMemo(() => {
    return [...chatRecords];
  }, [chatRecords]);

  const handleUpdateChatRecords = useCallback(
    (newValue: chatRecords[]) => {
      setChatRecords(newValue);
    },
    [chatRecords, userPrompt]
  );
  const handleUpdateOpenChatPopover = useCallback(
    (newValue: boolean) => {
      setOpenChatPopover(newValue);
    },
    [chatRecords]
  );
  const handleUpdateUserPrompt = useCallback(
    (newValue: string) => {
      setUserPrompt(newValue);
    },
    [chatRecords]
  );

  if (!mounted) {
    return null; // Or render a loading skeleton
  }

  return (
    // <ThemeProvider attribute={"class"} defaultTheme="dark">
      <SidebarProvider className="primary-background" open={openSideBar}>
        <main className="w-full">
          <section className="relative">
            <Navbar />
            <ProfilePage />
            <ChatPopover
              openChatPopover={openChatPopover}
              userPrompt={userPrompt}
              chatRecords={chatListmemoized}
              handleUpdateChatRecords={handleUpdateChatRecords}
              handleUpdateOpenChatPopover={handleUpdateOpenChatPopover}
              handleUpdateUserPrompt={handleUpdateUserPrompt}
              scrollingRef={scrollingRef}
              handleScrollToBottom={handleScrollToBottom}
            />
          </section>
          <Footer />
        </main>
      </SidebarProvider>
    // </ThemeProvider>
  );
}
