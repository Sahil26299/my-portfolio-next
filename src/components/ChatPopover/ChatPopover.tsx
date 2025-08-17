"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bot, RefreshCw, Send, X } from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import style from "./ChatPopover.module.css";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  ArrayOfStringType,
  chatRecords,
  formSubmitEventType,
  getSessionStorageItem,
  inputChangeEventType,
  keys,
  removeSessionStorageItem,
} from "@/src/utilities";
import { poppins } from "@/src/utilities/themes/font";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import LottieAnimProvider from "../LottieProvider/LottieAnimProvider";
import { animatedLoader } from "@/src/assets";
import { motion } from "framer-motion";
import TypeWriterUI from "../TypeWriterUI/TypeWriterUI";

interface chatRecordsPropTypes extends chatRecords {
  streaming: boolean;
  index: number;
  followUpQuestions: ArrayOfStringType;
  showFollowUpQuestions: boolean;
  handleStopStreaming: () => void;
  handleRegenerateResponse?: (index: number) => void;
  handleSubmitMessage: (msg: string) => void;
  chatsTillNow: number;
}

const chatLimit = 10;

const MessageComponent = ({
  user,
  message,
  isLoading,
  isError,
  streaming,
  index,
  followUpQuestions = [],
  showFollowUpQuestions,
  handleRegenerateResponse,
  handleStopStreaming,
  handleSubmitMessage,
  chatsTillNow,
}: chatRecordsPropTypes) => {
  if (user === "bot") {
    return (
      <section className="flex flex-col">
        <section
          className={`flex relative p-2 gap-2 custom-text-primary-converse ${style.chatMessageInAnimation}`}
        >
          <Bot
            size={24}
            strokeWidth={1.75}
            className={`sticky top-2 flex flex-col h-fit mt-1`}
          />
          <span
            className={`${
              isLoading
                ? ""
                : isError
                ? "bg-red-50 text-red"
                : "bg-gradient-to-br from-blue/20 to-purple/10"
            } font-normal text-black min-w-[75px] min-h-[35px] text-md-1 rounded-md p-2 flex flex-col justify-center gap-1 max-w-[90%] ${
              style.markdownTableStyles
            }`}
          >
            {isLoading ? (
              <LottieAnimProvider
                animationFile={animatedLoader}
                height={20}
                width={50}
              />
            ) : streaming ? (
              <TypeWriterUI
                delay={50}
                botResponse={message}
                handleAnimationFinished={handleStopStreaming}
                textClass=""
              />
            ) : (
              <Markdown key={message} remarkPlugins={[remarkGfm]}>
                {message}
              </Markdown>
            )}
            {index !== 0 && message?.length > 0 && (
              <section className="w-full border-t custom-border-color mt-4 flex items-center justify-end py-2">
                <motion.button
                  disabled={streaming || chatsTillNow === chatLimit}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  className={`px-4 text-black font-medium rounded-md overflow-hidden flex items-center gap-2 ${
                    streaming || chatsTillNow === chatLimit
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  } hover:underline transition-all duration-300`}
                  style={{ position: "relative" }}
                  onClick={() =>
                    handleRegenerateResponse && handleRegenerateResponse(index)
                  }
                >
                  {/* Revealing Text */}
                  <motion.p
                    variants={{
                      rest: { opacity: 0, x: -20 },
                      hover: { opacity: 1, x: 0 },
                    }}
                    transition={{ duration: 0.3 }}
                    className="text-sm"
                  >
                    Regenerate response ?
                  </motion.p>
                  {/* Button Label */}
                  <motion.span
                    variants={{
                      rest: { opacity: 1, x: -4 },
                      hover: { opacity: 0.8, x: 0 },
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <RefreshCw size={16} />
                  </motion.span>
                </motion.button>
              </section>
            )}
          </span>
        </section>
        {!streaming &&
          showFollowUpQuestions &&
          followUpQuestions?.length > 0 && (
            <section className="flex items-center flex-wrap gap-1 p-2 border-slate-400 border border-dashed bg-amber-50">
              <span className="text-md-1 font-medium custom-text-secondary-converse">
                📌 Suggestions:
              </span>
              {followUpQuestions?.map((el, ind) => {
                return (
                  <motion.button
                    disabled={chatsTillNow === chatLimit}
                    key={el}
                    className={`px-1 text-left rounded-md text-md-1 text-black ${
                      chatsTillNow === chatLimit
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    } my-[2px]`}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 * (ind + 1) }}
                    onClick={() => handleSubmitMessage(el)}
                  >
                    <u>{el}</u>
                  </motion.button>
                );
              })}
            </section>
          )}
      </section>
    );
  } else {
    return (
      <div
        className={`mt-2 flex custom-text-primary-converse relative p-2 gap-2 ${style.chatMessageInAnimation}`}
      >
        <span className="text-md-1 font-medium sticky top-2 flex flex-col h-fit mt-1">
          You
        </span>
        <span className="text-white text-md-1 rounded-md bg-blue p-2 flex flex-col justify-center max-w-[90%]">
          {message}
        </span>
      </div>
    );
  }
};

interface ChatPopoverProps {
  openChatPopover: boolean;
  userPrompt: string;
  chatRecords: chatRecords[];
  handleUpdateOpenChatPopover: (param: boolean) => void;
  handleUpdateUserPrompt: (param: string) => void;
  handleUpdateChatRecords: (param: chatRecords[]) => void;
}
const ChatPopover = ({
  openChatPopover,
  userPrompt,
  chatRecords,
  handleUpdateChatRecords,
  handleUpdateOpenChatPopover,
  handleUpdateUserPrompt,
}: ChatPopoverProps) => {
  const [streamingIndex, setStreamingIndex] = useState(-1);
  const [followUpQuestions, setFollowUpQuestions] = useState<ArrayOfStringType>(
    []
  );
  const [showFollowUpQuestions, setShowFollowUpQuestions] = useState(false);
  const scrollingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleSessionChange = () => {
      const updatedValue = getSessionStorageItem(
        keys.SUBMIT_USER_PROMPT_FROM_OUTSIDE
      );
      if (updatedValue?.from && updatedValue?.prompt !== "") {
        handleUpdateOpenChatPopover(true);
        handleSubmitPrompt(updatedValue?.prompt);
      }
    };

    const handleKeyDown = (ev: any) => {
      if (ev?.key === "Escape") {
        handleUpdateOpenChatPopover(false);
      }
    };

    window.addEventListener("sessionStorageUpdated", handleSessionChange);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("sessionStorageUpdated", handleSessionChange);
    };
  }, [chatRecords]);

  const handleScrollToBottom = () => {
    if (scrollingRef?.current) {
      scrollingRef?.current.scrollTo({
        top: scrollingRef?.current?.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (openChatPopover && chatRecords?.length === 0) {
      handleUpdateChatRecords([
        {
          message: `👋 Hi there! I’m your friendly AI assistant here to help you know more about Sahil’s work and experience as a Software developer. Ask me anything about his skills, projects, past experiences or professional journey!`,
          isLoading: false,
          isError: false,
          user: "bot",
        },
      ]);
      setStreamingIndex(0);
      setFollowUpQuestions([
        "What is Sahil’s total work experience with respect to his current and past employers?",
        "Does Sahil have experience integrating APIs or working with backend systems?",
        "Can you summarize Sahil's career journey so far?",
        "What skills make Sahil a good fit for mobile and web development projects?",
      ]);
      setShowFollowUpQuestions(true);
    }
  }, [openChatPopover, chatRecords?.length]);

  // When clicking follow-up question
  const onFollowUpClick = (prompt: string) => {
    handleSubmitPrompt(prompt);
    setFollowUpQuestions((prev) => prev?.filter((el) => el !== prompt));
  };

  // When pressing "send" manually
  const onManualSubmit = () => {
    handleSubmitPrompt(userPrompt);
  };
  const handleSubmitPrompt = useCallback(
    (prompt: string) => {
      if (!prompt.trim()) return;
      removeSessionStorageItem(keys.SUBMIT_USER_PROMPT_FROM_OUTSIDE);
      setShowFollowUpQuestions(false);
      handleUpdateUserPrompt("");

      const dummyChatRecords: chatRecords[] = [
        ...chatRecords,
        { message: prompt, isLoading: false, user: "user", isError: false },
        { message: "", isLoading: true, user: "bot", isError: false },
      ];
      // Add user message + bot placeholder in one atomic update
      handleUpdateChatRecords(dummyChatRecords);

      handleScrollToBottom();

      // API call
      submitPromptAPI(prompt, dummyChatRecords);
    },
    [chatRecords]
  );

  const submitPromptAPI = async (
    message: string = userPrompt,
    dummyChatRecords: chatRecords[] = [...chatRecords],
    indexWhileRegenerate?: number
  ) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: message,
        }),
      });

      const jsonResponse = await response.json();
      // console.log(jsonResponse, "jsonResponse?.data?.message");
      if (jsonResponse?.success) {
        if (indexWhileRegenerate) {
          handleUpdateChatRecords([
            ...dummyChatRecords?.slice(0, indexWhileRegenerate),
            {
              ...dummyChatRecords[indexWhileRegenerate],
              isLoading: false,
              message: jsonResponse?.data?.message,
              isError: false,
            },
            ...dummyChatRecords?.slice(indexWhileRegenerate + 1),
          ]);
          setStreamingIndex(indexWhileRegenerate);
        } else {
          const lastIndex = dummyChatRecords?.length - 1;
          const result = [
            ...dummyChatRecords?.slice(0, lastIndex),
            {
              ...dummyChatRecords[lastIndex],
              isLoading: false,
              message: jsonResponse?.data?.message,
              isError: false,
            },
          ];
          handleUpdateChatRecords(result);
          setStreamingIndex(lastIndex);
          handleScrollToBottom();
        }
      } else if (jsonResponse?.error?.status === 429) {
        if (indexWhileRegenerate) {
          handleUpdateChatRecords([
            ...dummyChatRecords?.slice(0, indexWhileRegenerate),
            {
              ...dummyChatRecords[indexWhileRegenerate],
              isLoading: false,
              message:
                "You’ve reached your chat limit. You’ll be able to continue chatting in about 20 minutes once your limit resets.",
              isError: true,
            },
            ...dummyChatRecords?.slice(indexWhileRegenerate + 1),
          ]);
          setStreamingIndex(indexWhileRegenerate);
        } else {
          const lastIndex = dummyChatRecords?.length - 1;
          handleUpdateChatRecords([
            ...dummyChatRecords?.slice(0, lastIndex),
            {
              ...dummyChatRecords[lastIndex],
              isLoading: false,
              message:
                "You’ve reached your chat limit. You’ll be able to continue chatting in about 20 minutes once your limit resets.",
              isError: true,
            },
          ]);
          setStreamingIndex(lastIndex);
          handleScrollToBottom();
        }
      }
    } catch (error) {
      console.log(error, "errrror");
    } finally {
    }
  };

  const handleRegenerateResponse = (index: number) => {
    setShowFollowUpQuestions(false);

    const dummyChatRecords: chatRecords[] = [
      ...chatRecords?.slice(0, index),
      { message: "", isLoading: true, user: "bot", isError: false },
      ...chatRecords?.slice(index + 1),
    ];

    handleUpdateChatRecords(dummyChatRecords);
    submitPromptAPI(chatRecords[index - 1].message, dummyChatRecords, index);
  };

  const handleStopStreaming = useCallback(() => {
    setStreamingIndex(-1);
    setShowFollowUpQuestions(true);
  }, []);

  /**
   * Among last 2 messages check which one contains isLoading true
   */
  const disableSubmit = useMemo(() => {
    return (
      [...chatRecords]
        ?.reverse()
        ?.slice(0, 2)
        ?.find((el) => el?.isLoading) !== undefined ||
      userPrompt === "" ||
      streamingIndex !== -1
    );
  }, [chatRecords, streamingIndex, userPrompt]);

  const chatsTillNow = useMemo(() => {
    console.log(chatRecords, "chatRecords");
    return Math.ceil((chatRecords?.length - 1) / 2);
  }, [chatRecords]);

  return (
    <Popover open={openChatPopover}>
      <Tooltip defaultOpen open={openChatPopover ? false : undefined}>
        <TooltipTrigger asChild>
          <PopoverTrigger
            onClick={(ev) => {
              ev.preventDefault();
              handleUpdateOpenChatPopover(!openChatPopover);
            }}
            className="sticky bottom-[3%] sm:left-[95%] left-[80%] cursor-pointer"
          >
            <div className="border-b border-r border-blue pt-px pl-px relative">
              <Bot
                size={56}
                className="border border-purple text-content dark:text-content-dark"
              />

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
        className={`sm:mr-10 mr-5 h-[80svh] sm:w-[34vw] w-[90vw] min-w-[350px] px-2 py-1 flex flex-col bg-bg-primary-dark dark:bg-bg-primary`}
      >
        <div className="h-[45px] flex flex-col border-b border-dark_grey dark:border-light_grey py-2 select-none">
          <section className="flex items-center justify-between">
            <section className="flex items-center gap-2">
              <Bot size={24} className="text-blue" />
              <h4 className="font-semibold custom-text-primary-converse">
                Ask Assistant!{" "}
                <span className="text-sm custom-text-secondary-converse italic mx-2">
                  Limit: {chatsTillNow} / {chatLimit}
                </span>
              </h4>
            </section>
            <Button
              size={"icon"}
              className="h-[25px] w-[25px] custom-text-primary-converse"
              variant={"ghost"}
              onClick={() => handleUpdateOpenChatPopover(false)}
            >
              <X size={18} />
            </Button>
          </section>
        </div>
        <div
          ref={scrollingRef}
          className={`flex flex-col h-full overflow-y-auto py-3 gap-1 custom-scrollbar`}
        >
          {chatRecords?.map((record: chatRecords, index: number) => (
            <MessageComponent
              key={index}
              index={index}
              {...record}
              streaming={streamingIndex === index}
              showFollowUpQuestions={
                index === chatRecords?.length - 1
                  ? showFollowUpQuestions
                  : false
              }
              chatsTillNow={chatsTillNow}
              handleRegenerateResponse={handleRegenerateResponse}
              handleStopStreaming={handleStopStreaming}
              followUpQuestions={followUpQuestions}
              handleSubmitMessage={onFollowUpClick}
            />
          ))}
        </div>
        <form
          onSubmit={(ev: formSubmitEventType) => {
            ev.preventDefault();
            onManualSubmit();
          }}
          className="h-[50px] border-t border-dark_grey dark:border-light_grey flex items-center pl-2"
        >
          <input
            name="prompt"
            id="prompt"
            className={`h-full w-[90%] outline-none border-none text-md-1 custom-text-primary-converse ${
              chatsTillNow === chatLimit ? "cursor-not-allowed" : ""
            }`}
            value={userPrompt}
            disabled={chatsTillNow === chatLimit}
            placeholder={
              chatsTillNow === chatLimit
                ? `Enter your prompt (Try again after sometime)`
                : "Enter your prompt"
            }
            onChange={(ev: inputChangeEventType) =>
              handleUpdateUserPrompt(ev.target.value)
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
