from fastapi import HTTPException, Depends, status, APIRouter
from sqlalchemy.orm import Session

from api.api_schemas import GenericTagResponse
from api.database_queries import get_user_tags
from api.database_access import get_db
from api.utils.security import get_current_user
from api.api_schemas import GenericTagDTO, GenericTagResponse
from api.database_models import Users

tags_router = APIRouter(prefix='/api/tags')


@tags_router.get('/my', status_code=status.HTTP_200_OK, response_model=GenericTagResponse)
def get_my_tags(
    session: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    solicitations = get_user_tags(session=session, user_id=current_user.user_id)
    
    mapped_tags = []
    for sol in solicitations:
        # Map fields carefully. 'solicitation_id' is used as 'tag_id' for Service Tags
        dto = GenericTagDTO(
            tag_type=sol.solicited_tag_type, 
            tag_id=sol.solicitation_id,      
            vehicle_plate=sol.vehicle.plate if sol.vehicle else None,
            current_user_email=sol.user.email if sol.user else None,
            end_date=sol.end_date
        )
        mapped_tags.append(dto)

    return GenericTagResponse(tags=mapped_tags)