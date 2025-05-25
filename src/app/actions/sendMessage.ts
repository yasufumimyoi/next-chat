"use server";

export const sendMessage = async (message: string) => {
  console.log(message);
  return "Message sent";
};
