export function VisualizadorLetra({ prediction, target }) {
  if (!prediction) {
    return (
      <div className="letter-display-box">
        <p className="no-prediction">Esperando detección...</p>
      </div>
    );
  }

  const isMatching = prediction.letra === target;
  const confidencePercent = Math.round(prediction.confianza * 100);

  return (
    <div className={`letter-display-box ${isMatching ? "match" : "mismatch"}`}>
      <div className="prediction-info">
        <p className="prediction-label">Seña detectada:</p>
        <p className="predicted-letter">{prediction.letra}</p>
      </div>
      <div className="confidence-info">
        <div className="confidence-bar-container">
          <div
            className="confidence-bar"
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
        <p className="confidence-text">Confianza: {confidencePercent}%</p>
      </div>
      <p className="status-text">
        {isMatching ? "¡Excelente! Seña correcta" : `Haz la seña de: ${target}`}
      </p>
    </div>
  );
}
