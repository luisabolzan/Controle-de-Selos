from fastapi import HTTPException, Depends, Response, status, APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from os import getenv

from api.database_queries import check_user_exists
from api.api_schemas import ResponseDTO
from api.utils.security import verify_password, create_access_token
from api.database_access import get_db

load_dotenv()
env = getenv("ENV", "dev")

auth_router = APIRouter(prefix='/api/auth')

@auth_router.post("/", response_model=ResponseDTO)
def login(response:Response, form_data: OAuth2PasswordRequestForm = Depends(), session:Session = Depends(get_db)):
    # OAuth2PasswordRequestForm expects 'username' and 'password'
    user = check_user_exists(form_data.username, session=session)
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User Not Found",
            headers={"WWW-Authenticate": "Bearer"}
        )

    if not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    token = create_access_token(data={"sub": user.email})
    response.set_cookie(
        key="access_token",
        value=f"Bearer {token}",
        httponly=True,
        secure=env == "prod", 
        samesite="lax",
        max_age= 60 * 60 * 48 # 48h 
    )
    
    return ResponseDTO(message="Login successful", success=True, data={"isAdmin": user.is_admin})