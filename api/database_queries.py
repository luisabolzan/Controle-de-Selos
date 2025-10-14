from api_schemas import ServiceTagSolicitationDTO
from database_models import Solicitation
from database_access import DatabaseAccess
from sqlalchemy import func
from sqlalchemy.orm import joinedload, selectinload

db_access = DatabaseAccess()
session = db_access.session

def create_service_tag_solicitation(solicitation: ServiceTagSolicitationDTO):
    new_solicitation = Solicitation(
        creation_date=func.now(),
        is_approved=False,
        reviewed=False,
        start_date=solicitation.start_date,
        end_date=solicitation.end_date,
        solicited_tag_type='service',
        vehicle_id=solicitation.vehicle_id,
        user_id=solicitation.user_id
    )
    session.add(new_solicitation)
    session.commit()
    print(f"Solicitação criada com ID: {new_solicitation.solicitation_id}")
    return new_solicitation

def set_solicitation_approval_status(solicitation_id: int, approved: bool):
    solicitation = session.query(Solicitation).filter(Solicitation.solicitation_id == solicitation_id).first()
    if not solicitation:
        raise ValueError(f"Solicitação com ID {solicitation_id} não encontrada.")
    
    solicitation.is_approved = approved
    solicitation.reviewed = True
    session.commit()
    print(f" Solicitação ID {solicitation_id} atualizada para {'aprovada' if approved else 'rejeitada'}.")
    return solicitation

def get_all_solicitations():
    solicitations = session
        .query(Solicitation)
        .options(
            joinedload(Solicitation.vehicle), 
            joinedload(Solicitation.user))
        .all()
    session.commit()
    return solicitations