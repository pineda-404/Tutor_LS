import json
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from tensorflow import keras
from tensorflow.keras.utils import to_categorical

from ml.evaluar import evaluar_modelo, guardar_historial

BASE_DIR = Path(__file__).resolve().parent.parent
CSV_PATH = BASE_DIR / "landmarks_asl_alphabet.csv"
SALIDAS_DIR = Path(__file__).resolve().parent / "salidas"

FEATURE_COLS = [f"{c}{i}" for i in range(21) for c in ("x", "y", "z")]


def cargar_datos():
    df = pd.read_csv(CSV_PATH)
    df["label"] = df["label"].replace({"del": "delete"})

    X = df[FEATURE_COLS].values.astype(np.float32)
    y_raw = df["label"].values

    encoder = LabelEncoder()
    y_encoded = encoder.fit_transform(y_raw)
    y = to_categorical(y_encoded)

    return X, y, encoder


def crear_modelo(num_classes):
    model = keras.Sequential([
        keras.layers.Input(shape=(63,)),
        keras.layers.Dense(128, activation="relu"),
        keras.layers.Dropout(0.3),
        keras.layers.Dense(64, activation="relu"),
        keras.layers.Dropout(0.3),
        keras.layers.Dense(num_classes, activation="softmax"),
    ])
    model.compile(
        optimizer="adam",
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model


def main():
    SALIDAS_DIR.mkdir(parents=True, exist_ok=True)

    X, y, encoder = cargar_datos()
    class_names = list(encoder.classes_)
    y_idx = np.argmax(y, axis=1)

    stratify = y_idx if np.min(np.bincount(y_idx)) >= 2 else None

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=stratify
    )

    model = crear_modelo(len(class_names))

    history = model.fit(
        X_train,
        y_train,
        epochs=50,
        batch_size=32,
        validation_split=0.1,
        callbacks=[
            keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True)
        ],
    )

    guardar_historial(history)

    accuracy, _ = evaluar_modelo(model, X_test, y_test, class_names)

    model.save(SALIDAS_DIR / "modelo_asl.keras")

    class_mapping = {str(i): label for i, label in enumerate(encoder.classes_)}
    with open(SALIDAS_DIR / "mapeo_clases.json", "w", encoding="utf-8") as f:
        json.dump(class_mapping, f, indent=2)

    modelo_cargado = keras.models.load_model(SALIDAS_DIR / "modelo_asl.keras")
    pred = modelo_cargado.predict(X_test[:5], verbose=0)
    print(f"predicciones muestra: {pred.argmax(axis=1)}")

    if accuracy < 0.75:
        print("advertencia: accuracy por debajo del 75%")
    else:
        print("modelo listo")


if __name__ == "__main__":
    main()
