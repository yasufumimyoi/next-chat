"use client";

import { useSWRConfig } from "swr";

type Message = {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
};

export const ChatForm = () => {
  const { mutate } = useSWRConfig();

  const handleSubmit = async (formData: FormData) => {
    const text = formData.get("message") as string;
    if (!text) return;

    const newMessage: Message = {
      id: Date.now(),
      text,
      sender: "user",
      timestamp: new Date().toLocaleString(),
    };

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: newMessage }),
      });

      mutate("/api/messages");
      const form = document.querySelector("form");
      if (form) form.reset();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="w-full max-w-2xl mt-4">
      <form action={handleSubmit}>
        <div className="flex gap-2">
          <input
            className="flex-grow border-2 border-gray-300 rounded-md p-2"
            type="text"
            name="message"
            placeholder="メッセージを入力..."
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            type="submit"
          >
            送信
          </button>
        </div>
      </form>
    </div>
  );
};
