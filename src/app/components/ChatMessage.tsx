"use client";

import useSWR from "swr";
import { useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const ChatMessage = () => {
  const [lastUpdateTime, setLastUpdateTime] = useState<string>("");
  const [hasNewData, setHasNewData] = useState(false);
  const { data, error, isLoading, isValidating } = useSWR<{
    messages: Message[];
  }>("/api/messages", fetcher, {
    refreshInterval: 3000, // 3秒ごとにポーリング
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (data) {
      const currentTime = new Date().toLocaleTimeString();
      setLastUpdateTime(currentTime);
      setHasNewData(true);
      // 3秒後にhasNewDataをfalseに戻す
      const timer = setTimeout(() => {
        setHasNewData(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [data]);

  useEffect(() => {
    scrollToBottom();
  }, [data?.messages]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading messages</div>;

  return (
    <div className="w-full max-w-2xl h-[500px] flex flex-col">
      <div className="flex-1 overflow-y-auto relative">
        {data?.messages.map((message) => (
          <div key={message.id} className="p-4 border-b">
            <div className="font-bold">{message.sender}</div>
            <div>{message.text}</div>
            <div className="text-sm text-gray-500">{message.timestamp}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
        <div className="absolute bottom-0 right-0 bg-gray-100 px-2 py-1 text-sm text-gray-500 rounded-tl">
          {isValidating && hasNewData ? (
            "更新中..."
          ) : (
            <span>最終更新: {lastUpdateTime}</span>
          )}
        </div>
      </div>
    </div>
  );
};
