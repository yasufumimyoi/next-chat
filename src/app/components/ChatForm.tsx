"use client";
import { useActionState } from "react";
import { sendMessage } from "../actions/sendMessage";

export const ChatForm = () => {
  const [action, formData] = useActionState(sendMessage, "");
  return (
    <div>
      <form action={action}>
        <input
          className="border-2 border-gray-300 rounded-md p-2"
          type="text"
          name="message"
        />
        <button className="bg-blue-500 text-white p-2 rounded-md" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};
