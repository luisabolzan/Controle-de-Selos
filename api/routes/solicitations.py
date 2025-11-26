from sqlalchemy.orm import Session
from math import ceil
from api.api_schemas import PaginatedResponse, ServiceTagDTO, ServiceTagSolicitationDTO, ResponseDTO, SolicitationDTO, SolicitationApproval, SolicitationFilterParams
from api.database_queries import create_service_tag_solicitation, get_solicitations_filtered, set_solicitation_approval_status
from api.database_models import Users
from api.utils.security import get_current_user, get_current_admin
from api.database_access import get_db

from fastapi import APIRouter, Depends

solicitations_router = APIRouter(prefix='/api/solicitations')

def success_response(data: any) -> ResponseDTO:
    return ResponseDTO(success=True, data=data, message="success")

def failed_response(message: str) -> ResponseDTO:
    return ResponseDTO(success=False, message=message, data=None)

@solicitations_router.post('/service')
def add_service_solicitation(
    solicitation_data: ServiceTagDTO,
    session=Depends(get_db),
    current_user: Users = Depends(get_current_user)) -> ResponseDTO[None]:
    try:
        solicitation = ServiceTagSolicitationDTO(
            user_id=current_user.user_id,
            vehicle_id=solicitation_data.vehicle_id,
            start_date=solicitation_data.start_date,
            end_date=solicitation_data.end_date
        )
        create_service_tag_solicitation(solicitation, session)
        return success_response(data=None)
    except ValueError as e:
        print(f"Erro ao criar solicitação: {e}")
        return failed_response(message=str(e))

@solicitations_router.get('/')
@solicitations_router.get('/', response_model=PaginatedResponse[SolicitationDTO])
def get_solicitations(
    filters: SolicitationFilterParams = Depends(), 
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_admin)
):

    items, total = get_solicitations_filtered(db, filters)
    total_pages = ceil(total / filters.size) if filters.size > 0 else 0
    
    return PaginatedResponse(
        data=items,
        total=total,
        page=filters.page,
        size=filters.size,
        pages=total_pages
    )

@solicitations_router.patch('/{solicitation_id}')
def update_solicitation_status(
    solicitation_id: int, body: SolicitationApproval,
    session=Depends(get_db),
    current_user: Users = Depends(get_current_admin)) -> ResponseDTO[None]:
    try:
        set_solicitation_approval_status(solicitation_id, body.approval, session=session)
        return success_response(data=None)
    except ValueError as e:
        print(f"Erro ao atualizar solicitação: {e}")
        return failed_response(message=str(e))