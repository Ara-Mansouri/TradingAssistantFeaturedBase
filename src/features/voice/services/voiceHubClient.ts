import * as signalR from "@microsoft/signalr";

export function createVoiceHubConnection() {
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://trading.liara.run/audioHub")
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

  return connection;
}
