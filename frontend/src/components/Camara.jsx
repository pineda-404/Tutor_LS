import { useRef, useEffect } from "react";
import { useMediaPipe } from "../hooks/useMediaPipe";
import { useWebSocket } from "../hooks/useWebSocket";

export function Camera({ onPrediction }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  const { prediction, connected, sendLandmarks } = useWebSocket(
    import.meta.env.VITE_WS_URL
  );

  const { detect, ready } = useMediaPipe((flat, landmarks) => {
    sendLandmarks(flat);
    drawLandmarks(landmarks);
  });

  useEffect(() => {
    if (prediction) onPrediction(prediction);
  }, [prediction]);

  useEffect(() => {
    async function startCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      loop();
    }

    function loop() {
      detect(videoRef.current, performance.now());
      rafRef.current = requestAnimationFrame(loop);
    }

    if (ready) startCamera();
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
    };
  }, [ready]);

  function drawLandmarks(landmarks) {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    landmarks.forEach((p) => {
      ctx.beginPath();
      ctx.arc(
        p.x * canvasRef.current.width,
        p.y * canvasRef.current.height,
        4, 0, 2 * Math.PI
      );
      ctx.fillStyle = "#00ff88";
      ctx.fill();
    });
  }

  return (
    <div style={{ position: "relative" }}>
      <video ref={videoRef} style={{ width: "100%" }} muted />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ position: "absolute", top: 0, left: 0, width: "100%" }}
      />
      {!connected && <p>Conectando al servidor...</p>}
    </div>
  );
}
