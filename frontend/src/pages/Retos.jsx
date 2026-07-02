import { useState } from "react";
import { Link } from "react-router-dom";
import { Camara } from "../components/Camara";
import { RetoDeletreo } from "../components/RetoDeletreo";

export function Retos() {
  const [prediction, setPrediction] = useState(null);

  return (
    <div className="page-container">
      <header className="page-header">
        <Link to="/" className="btn-back">← Volver</Link>
        <h2>Modo Retos</h2>
      </header>
      <div className="content-layout">
        <div className="camera-panel">
          <Camara onPrediction={setPrediction} />
        </div>
        <div className="sidebar-panel">
          <RetoDeletreo prediction={prediction} />
        </div>
      </div>
    </div>
  );
}
