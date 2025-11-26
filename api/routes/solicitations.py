from sqlalchemy.orm import Session
from math import ceil
from api.api_schemas import PaginatedResponse, ServiceTagDTO, ServiceTagSolicitationDTO, SolicitationDTO, SolicitationApproval, SolicitationFilterParams, EventualTagDTO, EventualTagSolicitationDTO
from api.database_queries import create_service_tag_solicitation, get_solicitations_filtered, set_solicitation_approval_status, create_eventual_tag_solicitation
from api.database_models import Users
from api.utils.security import get_current_user, get_current_admin
from api.database_access import get_db

from fastapi import APIRouter, Depends, HTTPException, status

solicitations_router = APIRouter(prefix='/api/solicitations')

@solicitations_router.post('/service', status_code= status.HTTP_201_CREATED)
def add_service_solicitation(
    solicitation_data: ServiceTagDTO,
    session: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    try:
        solicitation = ServiceTagSolicitationDTO(
            user_id=current_user.user_id,
            vehicle_id=solicitation_data.vehicle_id,
            start_date=solicitation_data.start_date,
            end_date=solicitation_data.end_date
        )
        create_service_tag_solicitation(solicitation, session)
        return {"message": "Solicitation Created Successfully"}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@solicitations_router.get('/', response_model=PaginatedResponse[SolicitationDTO])
def get_solicitations(
    filters: SolicitationFilterParams = Depends(), 
    session: Session = Depends(get_db),
    current_user: Users = Depends(get_current_admin)
):

    items, total = get_solicitations_filtered(session, filters)
    total_pages = ceil(total / filters.size) if filters.size > 0 else 0
    
    return PaginatedResponse(
        data=items,
        total=total,
        page=filters.page,
        size=filters.size,
        pages=total_pages
    )

@solicitations_router.patch('/{solicitation_id}', status_code= status.HTTP_200_OK)
def update_solicitation_status(
    solicitation_id: int, body: SolicitationApproval,
    session: Session = Depends(get_db),
    current_user: Users = Depends(get_current_admin)
):
    try:
        set_solicitation_approval_status(solicitation_id, body.approval, session=session)
        return {"message": "Status Updated Successfully"}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@solicitations_router.post('/eventual', status_code= status.HTTP_201_CREATED)
def add_eventual_solicitation(
    solicitation_data: EventualTagDTO,
    session: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    try:
        solicitation = EventualTagSolicitationDTO(
            user_id=current_user.user_id,
            start_date=solicitation_data.start_date,
            end_date=solicitation_data.end_date,
            driver=solicitation_data.driver,
            vehicle=solicitation_data.vehicle
        )
        create_eventual_tag_solicitation(solicitation, session)
        return {"message": "Eventual Solicitation Created Successfully"}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))