import { NextResponse } from "next/server";

type Message = {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
};

// 仮のメッセージデータ
let messages: Message[] = [
  {
    id: 1,
    text: "こんにちは",
    sender: "user",
    timestamp: "2023-01-01 12:00:00",
  },
  {
    id: 2,
    text: "こんばんは",
    sender: "assistant",
    timestamp: "2023-01-01 12:00:00",
  },
];

export async function GET() {
  return NextResponse.json({ messages });
}

export async function POST(request: Request) {
  const { message } = await request.json();
  messages.push(message);
  return NextResponse.json({ messages });
}
