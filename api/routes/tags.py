from fastapi import HTTPException, Depends, status, APIRouter
from sqlalchemy.orm import Session

from api.api_schemas import GenericTagResponse
from api.database_queries import get_user_tags
from api.database_access import get_db
from api.utils.security import get_current_user

tags_router = APIRouter(prefix='/api/tags')


@tags_router.get('/my', status_code=status.HTTP_200_OK)
def get_my_tags(
    session: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    tags = get_user_tags(session=session, user_id=current_user.user_id)
    return GenericTagResponse(tags=tags)