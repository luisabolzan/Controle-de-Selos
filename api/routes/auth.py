from fastapi import HTTPException, Depends, status, APIRouter
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from api.database_queries import check_user_exists
from api.api_schemas import ResponseDTO
from api.utils.security import verify_password, create_access_token

auth_router = APIRouter(prefix='/api/auth')

@auth_router.post("/", response_model=TokenDTO)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # OAuth2PasswordRequestForm expects 'username' and 'password'
    user = check_user_exists(form_data.username)
    
    if user is None or user.user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User Not Found" if user is None else "Invalid Credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    token = create_access_token(data=user.email)
    return ResponseDTO(message="Login successful", success=True, data=None)