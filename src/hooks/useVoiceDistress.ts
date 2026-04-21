import { useEffect, useRef } from "react";
import { Audio } from "expo-av";

export default function useVoiceDistress(triggerSOS: () => void) {

  const recordingRef = useRef<Audio.Recording | null>(null);
  const isRunning = useRef(false);
  const lastSOS = useRef(0);

  const SOS_COOLDOWN = 60000; // 1 minute
  const RECORD_TIME = 8000;   // 8 seconds

  useEffect(() => {

    start();

    return () => {
      console.log("🛑 Voice system stopped");
      isRunning.current = false;
      stopRecording();
    };

  }, []);


  const start = async () => {

    if (isRunning.current) return;

    try {

      const permission = await Audio.requestPermissionsAsync();

      if (!permission.granted) {
        console.log("🎤 Microphone permission denied");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true
      });

      isRunning.current = true;

      console.log("🎤 Voice monitoring started");

      loop();

    } catch (e) {

      console.log("Voice permission error:", e);

    }

  };


  const loop = async () => {

    if (!isRunning.current) return;

    try {

      const recording = new Audio.Recording();
      recordingRef.current = recording;

      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      await recording.startAsync();

      console.log("🎤 Listening...");

      setTimeout(async () => {

        if (!isRunning.current) return;

        await recording.stopAndUnloadAsync();

        const uri = recording.getURI();

        console.log("🎤 Recorded:", uri);

        await analyze(uri);

        loop(); // continue loop

      }, RECORD_TIME);

    } catch (err) {

      console.log("Recording error:", err);

      setTimeout(loop, 4000);

    }

  };


  const analyze = async (uri: string | null) => {

  if (!uri) return;

  try {

    const formData = new FormData();

    formData.append("file", {
      uri,
      name: "speech.m4a",
      type: "audio/m4a"
    } as any);

    formData.append("model", "whisper-1");

    const response = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer YOUR_OPENAI_KEY`
        },
        body: formData
      }
    );

    const data = await response.json();

    const transcript = data.text?.toLowerCase() || "";

    console.log("🗣 Transcript:", transcript);

    const distressWords = [
      "help",
      "save me",
      "emergency",
      "bachao",
      "madad"
    ];

    const detected = distressWords.some(word =>
      transcript.includes(word)
    );

    if (detected) {

      console.log("🚨 VOICE DISTRESS DETECTED");

      triggerSOS();

    }

  } catch (err) {

    console.log("Speech analysis error:", err);

  }

};


  const stopRecording = async () => {

    try {

      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        recordingRef.current = null;
      }

    } catch {}

  };

}