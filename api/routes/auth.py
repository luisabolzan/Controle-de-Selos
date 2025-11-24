from fastapi import HTTPException, Depends, status, APIRouter
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from api.database_queries import check_user_exists
from api.api_schemas import TokenDTO
from api.utils.security import verify_password, create_access_token

auth_router = APIRouter(prefix='/auth')

@auth_router.post("/token", response_model=TokenDTO)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # OAuth2PasswordRequestForm expects 'username' and 'password'
    user = check_user_exists(form_data.username)
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User Not Found",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    elif not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalide Credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )
        
    token = create_access_token(data=user.email)
    return TokenDTO(token, "bearer")