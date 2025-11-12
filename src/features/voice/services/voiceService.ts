import { createVoiceHubConnection } from "./voiceHubClient";
import * as signalR from "@microsoft/signalr";

const SESSION_ID = "room1";  
const USERNAME = "User1";         

export class VoiceService {
  private connection: signalR.HubConnection;
  private recorder: MediaRecorder | null = null;
  private sequence = 0;
  private joined = false;


  constructor()
  {
    this.connection = createVoiceHubConnection();

    this.connection.onreconnecting(() => 
    {
      console.warn(" Reconnecting...");
    });

    this.connection.onreconnected(async () => 
    {
      console.warn(" Reconnected, joining session again…");
      await this.joinSession();
    });
  }

 
  async connect(onTextResponse: 
    (text: string) => void, 
    onStatusChange: (status: string) => void ,
     onSessionReady: (ready: boolean) => void ) 
  {
    this.connection.on("Connected", (id: any) => 
    {
      console.log(" Server says connected:", id);
    });

  this.connection.on("Connected", (id: any) => 
    {
      onStatusChange(`Connected: ${id}`);
    });


    this.connection.onreconnecting(() =>
    {
      onStatusChange("Reconnecting…");
      onSessionReady(false);   
    });

    this.connection.onreconnected(async () => 
    {
      onStatusChange("Reconnected!");
      await this.joinSession();

    });
    
    this.connection.on("JoinedSession", (sessionId: string) => 
      {
      console.log(" Joined session", sessionId);
      this.joined = true;
      onSessionReady(true);
      onStatusChange("Joined session");
      onSessionReady(true); 
    });

    this.connection.on("SessionParticipants", (list: any[]) => 
    {
      console.log("Participants:", list);
    });

    this.connection.on("UserJoined", (user: any) => 
    {
      console.log(" UserJoined:", user);
    });

    this.connection.on("UserLeft", (user: any) => 
    {
      console.log(" UserLeft:", user);
    });

    this.connection.on("RecordingStarted", (data: any) => 
    {
      console.log(" RecordingStarted:", data);
      onStatusChange(`Recording started by ${data.startedBy}`);
    });

    this.connection.on("AudioChunkReceived", (data: any) =>
    {
      console.log(" AudioChunkReceived", data);
    });

    this.connection.on("RecordingStopped", (data : any) => 
    {
      console.log(" RecordingStopped:", data);
      onTextResponse(data?.text ?? "No response");
      onStatusChange("Stopped");
    });

    await this.connection.start();
    onStatusChange("Connected");
    await this.joinSession();
  }

  private async joinSession() 
  {
    if (this.connection.state !== signalR.HubConnectionState.Connected) return;

    await this.connection.invoke("JoinAudioSession", SESSION_ID, USERNAME);

    this.joined = true;
    console.log(` Joined audio session as ${USERNAME}`);
  }


  async startRecording(onStatusChange: (s: string) => void) {
    if (!this.joined) await this.joinSession();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 2,
          sampleRate: 44100,
          sampleSize: 1411,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      this.recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      this.recorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          const buf = await event.data.arrayBuffer();
          const base64 = this.arrayBufferToBase64(buf);

          await this.connection.invoke("StreamAudioChunk", SESSION_ID,
           {
            Data: base64,
            Timestamp: Date.now(),
            Sequence: this.sequence++,
            ChunkType: "audio",
          });
        }
      };

      this.recorder.start(500);

      await this.connection.invoke("StartRecording", SESSION_ID);
      onStatusChange("Recording…");

    } catch (err) {
      console.error(" Mic error:", err);
      onStatusChange("Mic access denied");
    }
  }

  async stopRecording(onStatusChange: (s: string) => void) {
    console.log(this.recorder?.state);
    if (this.recorder && this.recorder.state !== "inactive") 
    {
       this.recorder.stop();
       this.recorder.stream.getTracks().forEach(track => track.stop());
    }
    onStatusChange("Stopping…");

    await this.connection.invoke("StopRecording", SESSION_ID);
  }

  async leaveSession() {
    try {
      console.log(" Leaving session…");



      // if (this.recorder) 
      // {
      //   if (this.recorder.state !== "inactive") this.recorder.stop();
      //   this.recorder = null;
      // }

      // if (this.micStream) {
      //   this.micStream.getTracks().forEach((t) => t.stop());
      //   this.micStream = null;
      // }

      await this.connection.invoke("LeaveAudioSession", SESSION_ID);
      this.joined = false;
      console.log(" Left session");


      await this.connection.stop();
      console.log(" Disconnected from hub");

    } catch (err) {
      console.error(" leaveSession error:", err);
    }
  }

  private arrayBufferToBase64(buffer: ArrayBuffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  async disconnect() {
    await this.connection.stop();
  }
}
