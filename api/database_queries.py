from models import Users, Vehicles, UsersVehicles, Tags, Solicitation, Loan, TagTypes
from database import DatabaseAccess
from sqlalchemy import func, or_
from sqlalchemy.orm import joinedload, selectinload

def create_solicitation( solicitation_id: int, vehicle_id: int, user_id: int):
    new_solicitation = Solicitation(
        solicitation_id=solicitation_id,
        vehicle_id=vehicle_id,
        user_id=user_id,
        creation_date=func.now(),
        is_approved=False,
        reviewed=False
    )
    session.add(new_solicitation)
    session.commit()
    print(f"✅ Solicitação criada com ID: {new_solicitation.solicitation_id}")
    return new_solicitation

def update_solicitation_status(solicitation_id: int, approved: bool):
    solicitation = session.query(Solicitation).filter(Solicitation.solicitation_id == solicitation_id).first()
    if not solicitation:
        raise ValueError(f"Solicitação com ID {solicitation_id} não encontrada.")
    
    solicitation.is_approved = approved
    solicitation.reviewed = True
    session.commit()
    print(f"✅ Solicitação ID {solicitation_id} atualizada para {'aprovada' if approved else 'rejeitada'}.")
    return solicitation

def get_all_solicitations():
    solicitations = session.query(Solicitation).options(
        joinedload(Solicitation.vehicle),
        joinedload(Solicitation.user)
    ).all()
    return solicitations