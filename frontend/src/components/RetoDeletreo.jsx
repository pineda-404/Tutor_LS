import { useState, useEffect } from "react";

const WORDS = ["HOLA", "MUNDO", "SENAS", "TUTOR", "GRAFICA", "REACT", "AMIGO"];
const HOLD_FRAMES = 15;

export function RetoDeletreo({ prediction }) {
  const [word, setWord] = useState("");
  const [letterIndex, setLetterIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [holdCount, setHoldCount] = useState(0);

  useEffect(() => {
    selectNewWord();
  }, []);

  useEffect(() => {
    if (!word) return;
    const currentLetter = word[letterIndex];

    if (prediction && prediction.letra === currentLetter && prediction.confianza > 0.75) {
      setHoldCount((prev) => {
        const nextVal = prev + 1;
        if (nextVal >= HOLD_FRAMES) {
          advanceLetter();
          return 0;
        }
        return nextVal;
      });
    } else {
      setHoldCount(0);
    }
  }, [prediction, word, letterIndex]);

  function selectNewWord(currentWord = "") {
    const filtered = WORDS.filter((w) => w !== currentWord);
    const randomWord = filtered[Math.floor(Math.random() * filtered.length)];
    setWord(randomWord);
    setLetterIndex(0);
    setHoldCount(0);
  }

  function advanceLetter() {
    setLetterIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex >= word.length) {
        setScore((s) => s + 10);
        selectNewWord(word);
        return 0;
      }
      return nextIndex;
    });
  }

  const currentLetter = word ? word[letterIndex] : "";
  const holdPercent = (holdCount / HOLD_FRAMES) * 100;

  return (
    <div className="challenge-display">
      <div className="score-badge">Puntos: {score}</div>
      <div className="word-container">
        {word.split("").map((l, i) => (
          <span
            key={i}
            className={`word-letter ${
              i < letterIndex ? "done" : i === letterIndex ? "current" : "pending"
            }`}
          >
            {l}
          </span>
        ))}
      </div>
      <div className="instruction-box">
        <p className="instruction-label">Haz la seña de:</p>
        <p className="target-letter-large">{currentLetter}</p>
      </div>
      <div className="hold-progress-container">
        <div className="hold-progress-bar" style={{ width: `${holdPercent}%` }} />
      </div>
      <p className="hold-label">Mantén la postura: {Math.round(holdPercent)}%</p>
    </div>
  );
}
