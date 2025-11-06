
import { createVoiceHubConnection } from "./voiceHubClient";
import * as signalR from "@microsoft/signalr";

const SESSION_ID = "session-demo";  
const USERNAME = "tester";         

export class VoiceService {
  private connection: signalR.HubConnection;
  private recorder: MediaRecorder | null = null;
  private sequence = 0;
  private joined = false;

  constructor() {
    this.connection = createVoiceHubConnection();

    // ✅ مدیریت reconnect شدن
    this.connection.onreconnecting(() => {
      console.warn("🔄 Reconnecting...");
    });

    this.connection.onreconnected(async () => {
      console.warn("✅ Reconnected, joining session again…");
      await this.joinSession();
    });
  }

  // ✅ اتصال + ثبت event listener ها
  async connect(
    onTextResponse: (text: string) => void,
    onStatusChange: (status: string) => void
  ) {
    // ✅ 1) eventهایی که از سمت سرور می‌آیند

    this.connection.on("Connected", (id: any) => {
      console.log("✅ Server says connected:", id);
    });

    this.connection.on("JoinedSession", (sessionId: string) => {
      console.log("✅ JoinedSession:", sessionId);
      onStatusChange("Joined session");
    });

    this.connection.on("SessionParticipants", (list: any[]) => {
      console.log("👥 Participants:", list);
    });

    this.connection.on("UserJoined", (user: any) => {
      console.log("➕ UserJoined:", user);
    });

    this.connection.on("UserLeft", (user: any) => {
      console.log("➖ UserLeft:", user);
    });

    this.connection.on("RecordingStarted", (data: any) => {
      console.log("🎙 RecordingStarted:", data);
      onStatusChange(`Recording started by ${data.startedBy}`);
    });

    this.connection.on("AudioChunkReceived", (data: any) => {
      console.log("🔊 AudioChunkReceived", data);
    });

    this.connection.on("RecordingStopped", (data: any) => {
      console.log("🛑 RecordingStopped:", data);
      onTextResponse(data?.text ?? "No response");
      onStatusChange("Stopped");
    });

    // ✅ 2) شروع اتصال
    await this.connection.start();
    onStatusChange("Connected");

    // ✅ 3) Join کردن سشن
    await this.joinSession();
  }

  // ✅ join کردن session
  private async joinSession() {
    if (this.connection.state !== signalR.HubConnectionState.Connected) return;

    await this.connection.invoke("JoinAudioSession", SESSION_ID, USERNAME);

    this.joined = true;
    console.log(`✅ Joined session as ${USERNAME}`);
  }

  // ✅ شروع ضبط
  async startRecording(onStatusChange: (s: string) => void) {
    if (!this.joined) await this.joinSession();

    // اعلام به سرور

 try 
 {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.recorder = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus",
    });

    this.sequence = 0;

    this.recorder.ondataavailable = async (event) => {
      if (event.data.size > 0) {
        const buf = await event.data.arrayBuffer();
        const base64 = this.arrayBufferToBase64(buf);

        await this.connection.invoke("StreamAudioChunk", SESSION_ID, {
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
  }
  catch(err){
  console.error('Recording failed:', err);
  }
  }

  // ✅ پایان ضبط
  async stopRecording(onStatusChange: (s: string) => void) {
    if (!this.recorder) return;

    // توقف ضبط مرورگر
    this.recorder.stop();
    this.recorder.stream.getTracks().forEach((t) => t.stop());
    this.recorder = null;
    console.log("sessionid while stop recording is : ", SESSION_ID)
    // اعلام به سرور
    await this.connection.invoke("StopRecording", SESSION_ID);
    onStatusChange("Stopping…");
  }

  private arrayBufferToBase64(buffer: ArrayBuffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  }

  async disconnect() {
    await this.connection.stop();
  }
  
}
