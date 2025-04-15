
export type MessageType = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};
