import { useEffect, useRef, useState } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export function useMediaPipe(onLandmarks) {
  const landmarkerRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );
      landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 1,
      });
      setReady(true);
    }
    init();
  }, []);

  function detect(videoEl, timestampMs) {
    if (!landmarkerRef.current || !ready) return;
    const result = landmarkerRef.current.detectForVideo(videoEl, timestampMs);
    if (result.landmarks && result.landmarks.length > 0) {
      const flat = result.landmarks[0].flatMap((p) => [p.x, p.y, p.z]);
      onLandmarks(flat, result.landmarks[0]);
    }
  }

  return { detect, ready };
}
