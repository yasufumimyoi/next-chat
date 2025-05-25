"use client";

import useSWR from "swr";
import { useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
};

type MessageStatus = {
  isUpdating: boolean;
  lastMessageId: number;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const ChatMessage = () => {
  const [lastUpdateTime, setLastUpdateTime] = useState<string>("");
  const [hasNewData, setHasNewData] = useState(false);
  const [isWaitingForAI, setIsWaitingForAI] = useState(false);
  const [lastMessageId, setLastMessageId] = useState<number>(0);

  const {
    data: messagesData,
    error: messagesError,
    isLoading: messagesLoading,
    isValidating: messagesValidating,
    mutate: mutateMessages,
  } = useSWR<{
    messages: Message[];
  }>("/api/messages", fetcher, {
    refreshInterval: isWaitingForAI ? 1000 : 0, // AI待ち中のみポーリング
  });

  const { data: statusData } = useSWR<MessageStatus>(
    "/api/messages/status",
    fetcher,
    {
      refreshInterval: 1000,
    }
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messagesData) {
      const currentTime = new Date().toLocaleTimeString();
      setLastUpdateTime(currentTime);
      setHasNewData(true);
      const timer = setTimeout(() => {
        setHasNewData(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [messagesData]);

  useEffect(() => {
    if (statusData) {
      const wasWaiting = isWaitingForAI;
      setIsWaitingForAI(statusData.isUpdating);

      // AIの処理が完了したタイミングでメッセージを再取得
      if (wasWaiting && !statusData.isUpdating) {
        mutateMessages();
      }

      // 新しいメッセージIDを記録
      if (statusData.lastMessageId > lastMessageId) {
        setLastMessageId(statusData.lastMessageId);
      }
    }
  }, [statusData, isWaitingForAI, lastMessageId, mutateMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messagesData?.messages]);

  if (messagesLoading) return <div>Loading...</div>;
  if (messagesError) return <div>Error loading messages</div>;

  return (
    <div className="w-full max-w-2xl h-[500px] flex flex-col">
      <div className="flex-1 overflow-y-auto relative">
        {messagesData?.messages.map((message) => (
          <div key={message.id} className="p-4 border-b">
            <div className="font-bold">{message.sender}</div>
            <div>{message.text}</div>
            <div className="text-sm text-gray-500">{message.timestamp}</div>
          </div>
        ))}
        {isWaitingForAI && (
          <div className="p-4 border-b bg-gray-50">
            <div className="font-bold">AI</div>
            <div className="flex items-center gap-2">
              <div className="animate-pulse">考え中</div>
              <div className="flex gap-1">
                <span className="animate-bounce delay-0">.</span>
                <span className="animate-bounce delay-100">.</span>
                <span className="animate-bounce delay-200">.</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
        <div className="absolute bottom-0 right-0 bg-gray-100 px-2 py-1 text-sm text-gray-500 rounded-tl">
          {isWaitingForAI ? (
            "AIが返答を生成中..."
          ) : messagesValidating && hasNewData ? (
            "更新中..."
          ) : (
            <span>最終更新: {lastUpdateTime}</span>
          )}
        </div>
      </div>
    </div>
  );
};
