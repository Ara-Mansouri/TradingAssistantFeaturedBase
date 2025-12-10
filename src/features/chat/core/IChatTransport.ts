
import { ChatMessageDto, ChatStatus } from "../types/ChatMessage";


export interface IchatTransport 
{
    connect (chatId : string ,onMessage : (msg : ChatMessageDto) => void ) : Promise<void>;
    disconnect() : Promise<void>;
    sendMessage (content : string ) : Promise<ChatMessageDto | null>;
    onStatusChanged?(handler: (status: ChatStatus) => void): void;
}