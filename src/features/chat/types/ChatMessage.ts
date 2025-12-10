export type ChatSender = "user" | "assistent"

export interface  ChatMessageDto 
{
    id : string ;
    chatId : string ;
    sender  : ChatSender;
    content : string ;
    timestamp : string ;
}



export interface SendMessagePayload 
{
    chatId : string ;
    content : string
}


export interface ChatHistoryResponse
{
    messages : ChatMessageDto[];
}

export enum ChatStatus {
  Connected = "connected",
  Connecting = "connecting",
  Disconnected = "disconnected",
  Error = "error",
}


