import { ChatForm } from "../components/ChatForm";
import { ChatMessage } from "../components/ChatMessage";

export default function Chat() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <h1 className="text-4xl font-bold">Chat Page</h1>
      <ChatMessage />
      <ChatForm />
    </main>
  );
}
