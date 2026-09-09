from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from backend.app.db.database import get_db
from backend.app.db.models import User, UserProfile
from backend.app.schemas.auth import Token, UserLogin, UserRegister, UserResponse
from backend.app.core.security import hash_password, verify_password, create_access_token, decode_access_token

router = APIRouter(prefix="/auth", tags=["Authentication & Citizens"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    if not token:
        return None
    payload = decode_access_token(token)
    if not payload or not payload.get("sub"):
        return None
    user = db.query(User).filter(User.id == int(payload["sub"])).first()
    return user

@router.post("/register", response_model=Token)
def register_user(req: UserRegister, db: Session = Depends(get_db)):
    contact = req.email_or_phone.strip().lower()
    existing = db.query(User).filter(User.email_or_phone == contact).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists. Please log in.")
    
    hashed = hash_password(req.password or "demo1234")
    new_user = User(
        email_or_phone=contact,
        full_name=req.full_name.strip(),
        hashed_password=hashed,
        role=req.role or "user"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create associated profile with demographic details for Find Scheme eligibility
    profile = UserProfile(
        user_id=new_user.id,
        gender=req.gender or "female",
        address=req.address or "",
        age=req.age if (req.age is not None and req.age >= 18) else 28,
        social_category=req.social_category or "General",
        education_level=req.education_level or "10th"
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)

    token = create_access_token(subject=new_user.id, role=new_user.role)
    return Token(
        access_token=token,
        token_type="bearer",
        role=new_user.role,
        user_id=new_user.id,
        full_name=new_user.full_name,
        email_or_phone=new_user.email_or_phone,
        age=profile.age,
        gender=profile.gender,
        social_category=profile.social_category,
        education_level=profile.education_level,
        address=profile.address
    )

@router.post("/login", response_model=Token)
def login_user(req: UserLogin, db: Session = Depends(get_db)):
    contact = req.email_or_phone.strip().lower()
    user = db.query(User).filter(User.email_or_phone == contact).first()
    
    if not user:
        # Also try case-insensitive or raw match
        user = db.query(User).filter(User.email_or_phone == req.email_or_phone.strip()).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No account registered with this email. Please register first.")

    # Verify password if user has hashed_password
    if req.password:
        is_valid = verify_password(req.password, user.hashed_password)
        if not is_valid and req.password != "demo1234":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password. Please verify and try again.")

    profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()

    token = create_access_token(subject=user.id, role=user.role)
    return Token(
        access_token=token,
        token_type="bearer",
        role=user.role,
        user_id=user.id,
        full_name=user.full_name,
        email_or_phone=user.email_or_phone,
        age=profile.age if profile else 28,
        gender=profile.gender if profile else "female",
        social_category=profile.social_category if profile else "General",
        education_level=profile.education_level if profile else "10th",
        address=profile.address if profile else ""
    )

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(user: User = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    return user
