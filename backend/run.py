import os
import sys

# Ensure root workspace is in python path
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

if __name__ == "__main__":
    import uvicorn
    print("=" * 60)
    print(" Starting UdyamSetu Intelligence Backend (FastAPI v2.1)...")
    print(" Interactive Swagger API Docs: http://127.0.0.1:8000/docs")
    print(" Health & Benchmarks:          http://127.0.0.1:8000/api/health")
    print("=" * 60)
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
