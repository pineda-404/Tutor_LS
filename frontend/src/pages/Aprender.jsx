import { useState } from "react";
import { Link } from "react-router-dom";
import { Camara } from "../components/Camara";
import { VisualizadorLetra } from "../components/VisualizadorLetra";
import { GuiaAbecedario } from "../components/GuiaAbecedario";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function Aprender() {
  const [target, setTarget] = useState("A");
  const [prediction, setPrediction] = useState(null);

  const isCorrect =
    prediction?.letra === target && prediction?.confianza > 0.75;

  function nextLetter() {
    const currentIndex = LETTERS.indexOf(target);
    if (currentIndex < LETTERS.length - 1) {
      setTarget(LETTERS[currentIndex + 1]);
      setPrediction(null);
    }
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <Link to="/" className="btn-back">← Volver</Link>
        <h2>Modo Aprendizaje</h2>
      </header>
      <div className="content-layout">
        <div className="camera-panel">
          <Camara onPrediction={setPrediction} />
        </div>
        <div className="sidebar-panel">
          <GuiaAbecedario letter={target} />
          <VisualizadorLetra prediction={prediction} target={target} />
          {isCorrect && (
            <button onClick={nextLetter} className="btn btn-primary btn-block">
              Siguiente Letra →
            </button>
          )}
          <div className="letter-picker">
            {LETTERS.map((l) => (
              <button
                key={l}
                onClick={() => {
                  setTarget(l);
                  setPrediction(null);
                }}
                className={`letter-btn ${target === l ? "active" : ""}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
