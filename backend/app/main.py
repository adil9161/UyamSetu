from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.core.logging import logger
from backend.app.db.database import engine, Base
from backend.ingestion.index_builder import get_scheme_index

# Routers
from backend.app.routers.health import router as health_router
from backend.app.routers.auth import router as auth_router
from backend.app.routers.schemes import router as schemes_router
from backend.app.routers.matching import router as matching_router
from backend.app.routers.ai import router as ai_router
from backend.app.routers.applications import router as applications_router
from backend.app.routers.governance import router as governance_router
from backend.app.routers.demo import router as demo_router
from backend.app.routers.udyam import router as udyam_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing UdyamSetu Intelligence Backend v2.1...")
    
    # 1. Initialize Database Tables
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables verified.")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")

    # 2. Warm up Scheme Index & Rule Pipeline
    try:
        index = get_scheme_index()
        logger.info(f"Scheme Intelligence Layer ready with {len(index.schemes)} schemes indexed.")
    except Exception as e:
        logger.error(f"Error initializing Scheme Index: {e}")

    yield

    logger.info("UdyamSetu Intelligence Backend shutting down gracefully.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=(
        "**UdyamSetu Intelligence Platform (Smart India Hackathon 2026)**\n\n"
        "Statutory Deterministic Rule Engine + Multi-Factor Scoring + Grounded Hybrid RAG.\n\n"
        "- **Zero-Hallucination Matching**: Hard statutory rules strictly separated from AI explanations.\n"
        "- **Grounded Citations**: Real-time evidence linking to official ministry circulars and gazettes.\n"
        "- **Low-Latency In-Memory Retrieval**: Optimized for instant hackathon demonstrations."
    ),
    version="2.1.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permissive in local dev for smooth Vite frontend testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers under API prefix
for prefix in ["/api", "/api/v1"]:
    app.include_router(health_router, prefix=prefix)
    app.include_router(auth_router, prefix=prefix)
    app.include_router(schemes_router, prefix=prefix)
    app.include_router(matching_router, prefix=prefix)
    app.include_router(ai_router, prefix=prefix)
    app.include_router(applications_router, prefix=prefix)
    app.include_router(governance_router, prefix=prefix)
    app.include_router(udyam_router, prefix=prefix)

app.include_router(demo_router) # Handles both /api/demo/profiles and /admin/demo/reset

@app.get("/")
def root():
    return {
        "service": "UdyamSetu Intelligence Engine",
        "status": "online",
        "docs_url": "/docs",
        "sih_year": "2026",
        "tier": "National Welfare & MSME Scheme Gateway"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
