from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
from sklearn.metrics import (
    ConfusionMatrixDisplay,
    accuracy_score,
    classification_report,
    confusion_matrix,
)

BASE_DIR = Path(__file__).resolve().parent
SALIDAS_DIR = BASE_DIR / "salidas"


def guardar_historial(history, ruta=None):
    if ruta is None:
        ruta = SALIDAS_DIR / "historial_entrenamiento.png"

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))

    ax1.plot(history.history["loss"], label="train")
    ax1.plot(history.history["val_loss"], label="val")
    ax1.set_title("Loss")
    ax1.legend()

    ax2.plot(history.history["accuracy"], label="train")
    ax2.plot(history.history["val_accuracy"], label="val")
    ax2.set_title("Accuracy")
    ax2.legend()

    plt.tight_layout()
    plt.savefig(ruta, dpi=150)
    plt.close()


def evaluar_modelo(model, X_test, y_test, class_names, y_pred=None):
    if y_pred is None:
        y_pred = np.argmax(model.predict(X_test, verbose=0), axis=1)

    y_true = np.argmax(y_test, axis=1) if y_test.ndim > 1 else y_test
    accuracy = accuracy_score(y_true, y_pred)
    labels = list(range(len(class_names)))
    reporte = classification_report(
        y_true, y_pred, target_names=class_names, labels=labels, zero_division=0
    )

    print(f"accuracy test: {accuracy:.4f}")
    print(reporte)

    reporte_path = SALIDAS_DIR / "reporte_clasificacion.txt"
    with open(reporte_path, "w", encoding="utf-8") as f:
        f.write(f"accuracy: {accuracy:.4f}\n\n")
        f.write(reporte)

    cm = confusion_matrix(y_true, y_pred, labels=labels)
    disp = ConfusionMatrixDisplay(cm, display_labels=class_names)
    fig, ax = plt.subplots(figsize=(16, 14))
    disp.plot(ax=ax, cmap="Blues", xticks_rotation=90)
    plt.tight_layout()
    plt.savefig(SALIDAS_DIR / "matriz_confusion.png", dpi=150)
    plt.close()

    return accuracy, y_pred
