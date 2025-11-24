from fastapi import APIRouter
from fastapi import HTTPException, Depends, status, APIRouter
from sqlalchemy.orm import Session

from api.utils.security import get_password_hash, create_access_token
from api.api_schemas import TokenDTO, UserRegisterDTO
from api.database_queries import check_user_exists
from api.database_models import Users
from api.database_access import get_db

users_router = APIRouter(prefix='/users')

@users_router.post('/register', response_model=TokenDTO)
def register(user: UserRegisterDTO, db: Session = Depends(get_db)):
    user_exists = check_user_exists(user.email) is not None
    
    if user_exists:
        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )
        
    new_user = Users(
        password_hash=get_password_hash(user.password),
        name=user.name,
        email=user.email,
        cpf=user.cpf,
        phone_number=user.phone_number
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    token = create_access_token(new_user.email)
    return TokenDTO(token, "bearer")