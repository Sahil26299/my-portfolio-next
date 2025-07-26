"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bot, CircleUser, Send, User, X } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import style from "./ChatPopover.module.css";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  formSubmitEventType,
  GenericObjectInterface,
  inputChangeEventType,
} from "@/src/utilities";
import { openSans, poppins } from "@/src/utilities/themes/font";

interface chatRecords {
  user: "user" | "bot";
  message: string;
  isLoading: boolean;
}

const MessageComponent = ({ user, message, isLoading }: chatRecords) => {
  if (user === "bot") {
    return (
      <div
        className={`flex relative p-2 gap-2 ${style.chatMessageInAnimation}`}
      >
        <Bot
          size={24}
          strokeWidth={1.75}
          className={`sticky top-2 flex flex-col h-fit`}
        />
        <span
          className={`text-black min-w-[75px] min-h-[35px] ${
            isLoading ? "animate-pulse" : ""
          }
       text-md-1 rounded-md bg-light_grey border-dark_grey/20 border p-2 flex flex-col justify-center max-w-[90%]`}
        >
          {message}
        </span>
      </div>
    );
  } else {
    return (
      <div
        className={`flex relative p-2 gap-2 ${style.chatMessageInAnimation}`}
      >
        <span className="text-md-1 font-semibold sticky top-2 flex flex-col h-fit">
          You
        </span>
        <span className="text-white text-md-1 rounded-md bg-blue p-2 flex flex-col justify-center max-w-[90%]">
          {message}
        </span>
      </div>
    );
  }
};

const ChatPopover = () => {
  const [openChatPopover, setOpenChatPopover] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");
  const [chatRecords, setChatRecords] = useState<chatRecords[]>([]);
  const [streaming, setStreaming] = useState(false);
  const scrollingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollingRef?.current) {
      scrollingRef?.current.scrollTo({
        top: scrollingRef?.current?.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatRecords]);

  const handleSubmitPrompt = (ev: formSubmitEventType) => {
    ev.preventDefault();
    setUserPrompt("");
    setChatRecords((prev) => [
      ...prev,
      { message: userPrompt, isLoading: false, user: "user" },
      //   { message: "", isLoading: true, user: "bot" },
    ]);
    setTimeout(() => {
      setChatRecords((prev) => [
        ...prev,
        //   { message: userPrompt, isLoading: false, user: "user" },
        { message: "", isLoading: true, user: "bot" },
      ]);
      submitPromptAPI(userPrompt);
    }, 1000);
  };

  const submitPromptAPI = async (message: string = userPrompt) => {
    try {
      const response: GenericObjectInterface = await fetch(
        "http://localhost:11434/api/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "mistral",
            prompt: message,
            stream: true,
          }),
        }
      );
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let result = "";

      while (true) {
        setStreaming(true);
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        // Optional: parse chunk to get actual message if it's JSON line-delimited
        result += chunk;
        console.log("Chunk:", JSON.parse(chunk)?.response); // Or update React state here
        setChatRecords((prev) => [
          ...prev?.slice(0, prev?.length - 1),
          {
            ...prev[prev?.length - 1],
            isLoading: false,
            message: `${prev[prev?.length - 1]?.message}${
              JSON.parse(chunk)?.response
            }`,
          },
        ]);
      }
      setStreaming(false);
    } catch (error) {}
  };

  /**
   * Among last 2 messages check which one contains isLoading true
   */
  const disableSubmit = useMemo(() => {
    return (
      chatRecords
        ?.reverse()
        ?.slice(0, 2)
        ?.find((el) => el?.isLoading) !== undefined ||
      userPrompt === "" ||
      streaming
    );
  }, [chatRecords, streaming, userPrompt]);

  console.log(disableSubmit, "disableSubmit");

  return (
    <Popover open={openChatPopover} onOpenChange={setOpenChatPopover}>
      <Tooltip defaultOpen open={openChatPopover ? false : undefined}>
        <TooltipTrigger asChild>
          <PopoverTrigger className="fixed bottom-10 right-10 cursor-pointer">
            <div className="border-b border-r border-blue pt-px pl-px relative">
              <Bot size={56} className="border border-purple text-content dark:text-content-dark" />

              {!openChatPopover && (
                <div
                  className={`h-[4px] w-[8px] bg-purple absolute left-[10px] -bottom-[4px] ${style.glichBox1}`}
                />
              )}
              {!openChatPopover && (
                <div
                  className={`h-[4px] w-[8px] bg-blue absolute right-[12px] -top-[2px] ${style.glichBox2}`}
                />
              )}
            </div>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent className={`mr-10 ${poppins.className}`}>
          <p className="font-medium">In a hurry? Let me help.</p>
        </TooltipContent>
      </Tooltip>
      <PopoverContent
        className={`mr-10 h-[75svh] w-[28vw] min-w-[350px] px-2 py-1 flex flex-col bg-bg-primary-dark dark:bg-bg-primary ${openSans.className}`}
      >
        <div className="h-[45px] flex flex-col border-b border-dark_grey dark:border-light_grey py-2 select-none">
          <section className="flex items-center justify-between">
            <section className="flex items-center gap-2">
              <Bot size={24} className="text-blue" />
              <h4 className="font-semibold text-bg-primary dark:text-bg-primary-dark">
                Assistant!
              </h4>
            </section>
            <Button
              size={"icon"}
              className="h-[25px] w-[25px]"
              variant={"ghost"}
              onClick={() => setOpenChatPopover(false)}
            >
              <X size={18} />
            </Button>
          </section>
        </div>
        <div
          ref={scrollingRef}
          className="flex flex-col h-full overflow-y-auto py-3 gap-2"
        >
          {chatRecords?.map((record: chatRecords, index: number) => (
            <MessageComponent key={index} {...record} />
          ))}
        </div>
        <form
          onSubmit={handleSubmitPrompt}
          className="h-[50px] border-t border-dark_grey dark:border-light_grey flex items-center pl-2"
        >
          <input
            name="prompt"
            id="prompt"
            className="h-full w-[90%] outline-none border-none text-md-1 text-bg-primary dark:text-bg-primary-dark"
            value={userPrompt}
            placeholder="Enter your prompt"
            onChange={(ev: inputChangeEventType) =>
              setUserPrompt(ev.target.value)
            }
          />
          <Button disabled={disableSubmit} size={"icon"} variant={"ghost"}>
            <Send
              size={48}
              strokeWidth={2}
              className={`${!disableSubmit ? "text-green" : "text-dark_grey"}`}
            />
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default ChatPopover;
