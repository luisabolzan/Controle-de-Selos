from api.api_schemas import ServiceTagDTO, ServiceTagSolicitationDTO, ResponseDTO, SolicitationDTO, SolicitationApproval
from api.database_queries import create_service_tag_solicitation, get_all_solicitations, set_solicitation_approval_status
from api.database_models import Users
from api.utils.security import get_current_user
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
def get_solicitations(current_user: Users = Depends(get_current_user),
                      session=Depends(get_db)) -> ResponseDTO[list[SolicitationDTO]]:
    try:
        if not current_user.is_admin: 
            raise ValueError
        result = get_all_solicitations(session=session)
        return success_response(data=result)
    except ValueError as e:
        print(f"Erro ao obter solicitações: {e}")
        return failed_response(message=str(e))

@solicitations_router.patch('/{solicitation_id}')
def update_solicitation_status(solicitation_id: int, body: SolicitationApproval,
                               session=Depends(get_db),
                               current_user: Users = Depends(get_current_user)) -> ResponseDTO[None]:
    try:
        if not current_user.is_admin:
            raise ValueError
        result = set_solicitation_approval_status(solicitation_id, body.approval, session=session)
        return success_response(data=None)
    except ValueError as e:
        print(f"Erro ao atualizar solicitação: {e}")
        return failed_response(message=str(e))