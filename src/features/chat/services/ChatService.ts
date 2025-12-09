import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { ChatMessageDto } from "../types/ChatMessage";


export class ChatService
{
    private connection :HubConnection | null = null;
    private chatId : string | null = null;
    async connect(chatId : string , onMessage : (msg : ChatMessageDto) => void )
    { 
        //TO DO : CHANGE FOR ACTUAL HUB
      this.connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5000/hubs/chat")
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

       this.connection.on("ReceiveMessage", (message: ChatMessageDto) =>
        {
         if (message.chatId === this.chatId) 
            {
             onMessage(message);
            }
        });
     try {
      await this.connection.start();
      console.log("SignalR Connected (Mock Mode)");

      // 🔥 فعلاً چون بک‌اند نداری، پیام‌های Mock تولید می‌کنیم
      this.startMockMessages(onMessage);

    } catch (err) {
      console.error("SignalR connection failed:", err);
    }
    }   
async sendMessage(content: string) 
{
    if (!this.connection || !this.chatId) return;

    const fakeUserMsg: ChatMessageDto = {
      id: `local-${Date.now()}`,
      sender: "user",
      content,
      timestamp: new Date().toISOString(),
      chatId: this.chatId,
    };


    // await this.connection.invoke("SendMessage", this.chatId, content);


    return fakeUserMsg;
}


  async disconnect() {
    await this.connection?.stop();
  }
  private startMockMessages(push: (msg: ChatMessageDto) => void) {
    setInterval(() => {
      if (!this.chatId) return;

      const fakeAssistantMsg: ChatMessageDto = {
        id: `assistant-${Date.now()}`,
        chatId: this.chatId!,
        sender: "assistent",
        content: "This is a mock AI response via fake SignalR stream.",
        timestamp: new Date().toISOString(),
      };

      push(fakeAssistantMsg);
    }, 5000);
  }


}