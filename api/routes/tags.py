from math import ceil
from fastapi import Depends, status, APIRouter
from sqlalchemy.orm import Session
from typing import List

from api.api_schemas import TagFilterParams, GenericTagDTO, PaginatedResponse
from api.database_queries import get_tags_filtered, set_tag_available
from api.database_access import get_db
from api.utils.security import get_current_user, get_current_admin
from api.database_models import Users, Solicitation

tags_router = APIRouter(prefix='/api/tags')

def map_tags_to_dto(solicitations: List[Solicitation]) -> List[GenericTagDTO]:
    return [
        GenericTagDTO(
            tag_type=sol.solicited_tag_type, 
            tag_id=sol.solicitation_id,      
            vehicle_plate=sol.vehicle.plate if sol.vehicle else None,
            current_user_email=sol.user.email if sol.user else None,
            current_username =sol.user.name if sol.user else None,
            end_date=sol.end_date
        ) for sol in solicitations
    ]

@tags_router.get('/my', status_code=status.HTTP_200_OK, response_model=PaginatedResponse[GenericTagDTO])
def get_my_tags(
    filters: TagFilterParams = Depends(),
    session: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    tags, total = get_tags_filtered(session=session, filters=filters, user_id=current_user.user_id)
    
    mapped_tags = map_tags_to_dto(tags)
    total_pages = ceil(total / filters.size) if filters.size > 0 else 0

    return PaginatedResponse(
        data=mapped_tags,
        total=total,
        page=filters.page,
        size=filters.size,
        pages=total_pages
    )

@tags_router.get('/', status_code=status.HTTP_200_OK, response_model=PaginatedResponse[GenericTagDTO])
def get_all_tags(
    filters: TagFilterParams = Depends(),
    session: Session = Depends(get_db),
    current_user: Users = Depends(get_current_admin)
):
    tags, total = get_tags_filtered(session=session, filters=filters, user_id=None)
    
    mapped_tags = map_tags_to_dto(tags)
    total_pages = ceil(total / filters.size) if filters.size > 0 else 0

    return PaginatedResponse(
        data=mapped_tags,
        total=total,
        page=filters.page,
        size=filters.size,
        pages=total_pages
    )
    
@tags_router.patch('/return/{tag_id}', status_code=status.HTTP_200_OK)
def return_tag(
    tag_id: int,
    session: Session = Depends(get_db),
    current_user: Users = Depends(get_current_admin)
):
    set_tag_available(session=session, tag_id=tag_id, available=True)
    
    return {"message": "Tag returned successfully."}