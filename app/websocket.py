import json
from fastapi import WebSocket, WebSocketDisconnect
from app.modelo import asl_model
from app.config import NUM_LANDMARKS

async def websocket_handler(websocket: WebSocket):
    """Maneja el flujo de comunicación WebSocket recibiendo landmarks y retornando predicciones."""
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            try:
                message = json.loads(data)
            except json.JSONDecodeError:
                await websocket.send_json({"error": "Formato JSON invalido"})
                continue

            landmarks = message.get("landmarks")
            if not isinstance(landmarks, list) or len(landmarks) != NUM_LANDMARKS:
                await websocket.send_json({"error": f"Se esperan {NUM_LANDMARKS} landmarks"})
                continue

            try:
                landmarks = [float(x) for x in landmarks]
            except (ValueError, TypeError):
                await websocket.send_json({"error": "Todos los landmarks deben ser numericos"})
                continue

            letra, confianza = asl_model.predict(landmarks)
            await websocket.send_json({
                "letra": letra,
                "confianza": round(confianza, 4)
            })
    except WebSocketDisconnect:
        pass
    except Exception as e:
        try:
            await websocket.close()
        except Exception:
            pass
