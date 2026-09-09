from fastapi import APIRouter
from pydantic import BaseModel
from backend.app.services.udyam.provider import UdyamService, UdyamVerificationResult

router = APIRouter(prefix="/udyam", tags=["MSME Udyam Verification"])

class UdyamVerifyRequest(BaseModel):
    registration_number: str

@router.post("/verify", response_model=UdyamVerificationResult)
def verify_udyam_number(req: UdyamVerifyRequest):
    return UdyamService.verify_registration(req.registration_number)
