from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from app.modelo import asl_model
from app.websocket import websocket_handler

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Carga los recursos del modelo al iniciar el servidor."""
    asl_model.load()
    yield

app = FastAPI(title="Tutor LS Backend", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "ok"}

@app.get("/health")
async def health():
    return {"model_loaded": asl_model.class_mapping is not None}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket_handler(websocket)
