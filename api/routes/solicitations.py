from api.api_schemas import ServiceTagSolicitationDTO, ResponseDTO, SolicitationDTO, SolicitationApproval
from api.database_queries import create_service_tag_solicitation, get_all_solicitations, set_solicitation_approval_status
from api.database_models import Users
from api.utils.security import get_current_user

from fastapi import APIRouter, Depends

solicitations_router = APIRouter(prefix='/solicitations')

def success_response(data: any) -> ResponseDTO:
    return ResponseDTO(success=True, data=data, message="success")

def failed_response(message: str) -> ResponseDTO:
    return ResponseDTO(success=False, message=message, data=None)

@solicitations_router.post('/api/solicitations/service')
def add_service_solicitation(
    solicitation: ServiceTagSolicitationDTO,
    current_user: Users = Depends(get_current_user)) -> ResponseDTO[None]:
    print(solicitation)
    try:
        solicitation.user_id = current_user.user_id
        create_service_tag_solicitation(solicitation)
        return success_response(data=None)
    except ValueError as e:
        print(f"Erro ao criar solicitação: {e}")
        return failed_response(message=str(e))

@solicitations_router.get('/api/solicitations')
def get_solicitations(current_user: Users = Depends(get_current_user)) -> ResponseDTO[list[SolicitationDTO]]:
    try:
        if not current_user.is_admin: 
            raise ValueError
        result = get_all_solicitations()
        return success_response(data=result)
    except ValueError as e:
        print(f"Erro ao obter solicitações: {e}")
        return failed_response(message=str(e))

@solicitations_router.patch('/api/solicitations/{solicitation_id}')
def update_solicitation_status(solicitation_id: int, body: SolicitationApproval) -> ResponseDTO[None]:
    try:
        result = set_solicitation_approval_status(solicitation_id, body.approval)
        return success_response(data=None)
    except ValueError as e:
        print(f"Erro ao atualizar solicitação: {e}")
        return failed_response(message=str(e))