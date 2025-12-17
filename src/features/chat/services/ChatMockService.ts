import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { ChatMessageDto } from "../types/ChatMessage";
import { IchatTransport } from "../core/IChatTransport";

export class ChatMockService implements IchatTransport {
  private connection: HubConnection | null = null;
  private chatId: string | null = null;

  async connect(chatId: string, onMessage: (msg: ChatMessageDto) => void): Promise<void> {
    this.chatId = chatId;

    this.connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5000/hubs/chat")
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    this.connection.on("ReceiveMessage", (message: ChatMessageDto) => {
      if (message.chatId === this.chatId) {
        onMessage(message);
      }
    });

    try {
      await this.connection.start();
      console.log("SignalR Connected");


      this.startMockMessages(onMessage);
    } catch (err) {
      console.error("SignalR connection failed:", err);
    }
  }

  async sendMessage(content: string): Promise<ChatMessageDto | null> {
    if (!this.connection || !this.chatId) return null;

    const localMsg: ChatMessageDto = {
      id: `local-${Date.now()}`,
      chatId: this.chatId,
      sender: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    // send to backend when ready:
    // await this.connection.invoke("SendMessage", this.chatId, content);

    return localMsg;
  }

  async disconnect(): Promise<void> {
    await this.connection?.stop();
  }

  private startMockMessages(push: (msg: ChatMessageDto) => void) {
    setInterval(() => {
      if (!this.chatId) return;

      const fakeAssistant: ChatMessageDto = {
        id: `assistant-${Date.now()}`,
        chatId: this.chatId!,
        sender: "assistant",
        content: "This is a mock AI response.",
        timestamp: new Date().toISOString(),
      };

      push(fakeAssistant);
    }, 4000);
  }
}
