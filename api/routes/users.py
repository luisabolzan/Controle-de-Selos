from fastapi import HTTPException, Depends, status, APIRouter
from sqlalchemy.orm import Session

from api.utils.security import get_password_hash
from api.api_schemas import UserRegisterDTO
from api.database_queries import check_user_exists
from api.database_models import Users
from api.database_access import get_db

users_router = APIRouter(prefix='/api/users')

@users_router.post('/register', status_code=status.HTTP_201_CREATED)
def register(user: UserRegisterDTO, db: Session = Depends(get_db)):
    user_exists = check_user_exists(user.username, db) is not None
     
    if user_exists:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='User already exists')

    new_user = Users(
        password_hash=get_password_hash(user.password),
        name=user.username,
        email=user.username + '@inf.ufrgs.br',
        is_admin=False
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "User registered successfully"}