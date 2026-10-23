
import { useState } from "react";

export default function ScreenPermission() {
  const [stream, setStream] = useState(null);
  const [status, setStatus] = useState("Screen sharing not started");

  const startScreenShare = async () => {
    try {
      const mediaStream =
        await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });

      setStream(mediaStream);
      setStatus("Screen sharing is active");

      // Detect when the candidate stops sharing
      mediaStream.getVideoTracks()[0].onended = () => {
        setStream(null);
        setStatus("Screen sharing stopped");
      };
    } catch (error) {
      setStatus("Screen permission denied or cancelled");
      console.error(error);
    }
  };

  const stopScreenShare = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setStatus("Screen sharing stopped");
    }
  };

  return (
    <div>
      <h2>Proctored Exam - Screen Permission</h2>

      <p>{status}</p>

      {!stream ? (
        <button onClick={startScreenShare}>
          Allow Screen Sharing
        </button>
      ) : (
        <button onClick={stopScreenShare}>
          Stop Screen Sharing
        </button>
      )}
    </div>
  );
}
