from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from passlib.context import CryptContext
from dotenv import load_dotenv
from os import getenv
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from ..database_access import get_db
from ..database_models import Users
from ..database_queries import check_user_exists

load_dotenv()

SECRET_KEY = getenv("SECRET_KEY")
ALGORITHM = getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_HOURS = float(getenv("ACCESS_TOKEN_EXPIRE_HOURS"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='api/auth/token')

def verify_password(plain:str, hashed:str):
    return pwd_context.verify(plain, hashed)

def get_password_hash(password:str):
    return pwd_context.has(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, ALGORITHM)
    return encoded_jwt

def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
) -> Users:
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="User is not authenticated",
        headers={"WWW-Authenticate": "Bearer"}
    )
    
    token = request.cookies.get("access_token")
    if not token:
        raise credentials_exception
    
    if token.startswith("Bearer "):
        token = token[len("Bearer "):]
    
    try:
        payload = jwt.decode(token=token, key=SECRET_KEY, algorithms=[ALGORITHM])
        email:str = payload.get("sub")
        
        if email is None:
            raise credentials_exception
    except JWTError as e:
        print("JWT Error Detail: ", e)
        raise credentials_exception
    
    user = check_user_exists(email, db)
    
    if user is None:
        raise credentials_exception
    
    return user

def get_current_admin(
    current_user: Users = Depends(get_current_user)
) -> Users:
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User does not have enough privileges"
        )
    return current_user