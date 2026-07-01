export function GuiaAbecedario({ letter }) {
  const imageUrl = `https://raw.githubusercontent.com/sitepoint-editors/asl-alphabet/master/assets/images/${letter.toLowerCase()}.png`;

  return (
    <div className="alphabet-guide-box">
      <h3>Referencia ASL</h3>
      <div className="image-wrapper">
        <img
          src={imageUrl}
          alt={`Seña para la letra ${letter}`}
          className="guide-image"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div className="fallback-text">
          Seña: <strong>{letter}</strong>
        </div>
      </div>
    </div>
  );
}
