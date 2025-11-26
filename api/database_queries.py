from .api_schemas import ServiceTagSolicitationDTO, SolicitationFilterParams, SolicitationStatusEnum, EventualTagSolicitationDTO, TemporaryTagSolicitationDTO
from sqlalchemy.sql import text
from .database_models import Solicitation, Users, Vehicles
from sqlalchemy import func, or_, and_
from sqlalchemy.orm import joinedload, Session
from typing import List

def create_service_tag_solicitation(solicitation: ServiceTagSolicitationDTO, session: Session):
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

def set_solicitation_approval_status(solicitation_id: int, approved: bool, session: Session):
    solicitation = session.query(Solicitation).filter(Solicitation.solicitation_id == solicitation_id).first()
    if not solicitation:
        raise ValueError(f"Solicitação com ID {solicitation_id} não encontrada.")
    
    solicitation.is_approved = approved
    solicitation.reviewed = True
    session.commit()

    print(f" Solicitação ID {solicitation_id} atualizada para {'aprovada' if approved else 'rejeitada'}.")
    return solicitation

def get_solicitations_filtered(session: Session, filters: SolicitationFilterParams, current_user: Users = None):
    query = session.query(Solicitation).join(Users).outerjoin(Vehicles)

    # if user is not admin, get only their solicitations
    if current_user:
        query = query.filter(Solicitation.user_id == current_user.user_id) 

    # name filter
    if filters.name:
        query = query.filter(Users.name.ilike(f"%{filters.name}%"))

    # plate filter
    if filters.plate:
        query = query.filter(Vehicles.plate.ilike(f"%{filters.plate}%"))

    # tag_type filter
    if filters.tag_type:
        query = query.filter(Solicitation.solicited_tag_type == filters.tag_type)

    # status filter
    if filters.status:
        if filters.status == SolicitationStatusEnum.PENDING:
            query = query.filter(Solicitation.reviewed == False)
        
        elif filters.status == SolicitationStatusEnum.APPROVED:
            query = query.filter(and_(Solicitation.reviewed == True, Solicitation.is_approved == True))
            
        elif filters.status == SolicitationStatusEnum.REJECTED:
            query = query.filter(and_(Solicitation.reviewed == True, Solicitation.is_approved == False))

    total_filtered = query.count()

    skip = (filters.page - 1) * filters.size
    
    items = query.order_by(Solicitation.creation_date.desc())\
                 .options(joinedload(Solicitation.user), joinedload(Solicitation.vehicle))\
                 .offset(skip)\
                 .limit(filters.size)\
                 .all()

    return items, total_filtered

def check_user_exists(username, session: Session) -> Users:
    return session.query(Users).filter(Users.name == username).first()

def create_eventual_tag_solicitation(solicitation: EventualTagSolicitationDTO, session: Session):
    vehicle = Vehicles(
        plate=solicitation.vehicle.plate,
        model=solicitation.vehicle.model,
        color=solicitation.vehicle.color
    )

    session.add(vehicle)
    session.commit()

    new_solicitation = Solicitation(
        creation_date=func.now(),
        is_approved=False,
        reviewed=False,
        start_date=solicitation.start_date,
        end_date=solicitation.end_date,
        solicited_tag_type='eventual',
        vehicle_id=vehicle.vehicle_id,
        user_id=solicitation.user_id
    )
    session.add(new_solicitation)
    session.commit()

    print(f"Solicitação criada com ID: {new_solicitation.solicitation_id}")
    return new_solicitation

def create_temporary_tag_solicitation(solicitation: TemporaryTagSolicitationDTO, session: Session):
    vehicle = Vehicles(
        plate=solicitation.vehicle.plate,
        model=solicitation.vehicle.model,
        color=solicitation.vehicle.color
    )

    session.add(vehicle)
    session.commit()

    new_solicitation = Solicitation(
        creation_date=func.now(),
        is_approved=False,
        reviewed=False,
        start_date=func.now(),
        end_date=func.now() + text("interval '6 months'"),  # Assuming temporary tags last for one semester
        solicited_tag_type='temp',
        vehicle_id=vehicle.vehicle_id,
        user_id=solicitation.user_id
    )
    session.add(new_solicitation)
    session.commit()

    print(f"Solicitação criada com ID: {new_solicitation.solicitation_id}")
    return new_solicitation

def get_user_tags(user_id: int, session: Session) -> List[Solicitation]:
    tags = session.query(Solicitation).options(
        joinedload(Solicitation.vehicle), # Pre-loads vehicle data
        joinedload(Solicitation.user)     # Pre-loads user data
    ).filter(
        Solicitation.user_id == user_id,
        Solicitation.is_approved == True,
        Solicitation.reviewed == True,
        or_(
            and_(Solicitation.start_date <= func.now(), Solicitation.end_date >= func.now())
        )
    ).all()
    
    return tags