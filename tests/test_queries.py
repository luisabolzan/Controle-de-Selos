from api_schemas import ServiceTagSolicitationDTO
from database_queries import create_service_tag_solicitation, set_solicitation_approval_status, get_all_solicitations
from database_models import TagTypes 
from datetime import datetime, timedelta

def test_create_solicitation(db_session, setup_data):
    user = setup_data["user"]
    vehicle = setup_data["vehicle"]
    
    solicitation_dto = ServiceTagSolicitationDTO(
        user_id=user.user_id,
        vehicle_id=vehicle.vehicle_id,
        start_date=datetime.now(),
        end_date=datetime.now() + timedelta(days=1)
    )
    
    new_solicitation = create_service_tag_solicitation(solicitation_dto)
    
    assert new_solicitation.solicitation_id is not None
    assert new_solicitation.user_id == user.user_id
    assert new_solicitation.is_approved is False
    assert new_solicitation.solicited_tag_type.value == "service"

def test_approve_solicitation(db_session, setup_data):
    user = setup_data["user"]
    vehicle = setup_data["vehicle"]
    
    solicitation_dto = ServiceTagSolicitationDTO(
        user_id=user.user_id, vehicle_id=vehicle.vehicle_id,
        start_date=datetime.now(), end_date=datetime.now()
    )

    created = create_service_tag_solicitation(solicitation_dto)
    updated = set_solicitation_approval_status(created.solicitation_id, True)
    
    assert updated.is_approved is True
    assert updated.reviewed is True

def test_get_all_solicitations(db_session, setup_data):
    user = setup_data["user"]
    vehicle = setup_data["vehicle"]
    dto = ServiceTagSolicitationDTO(user_id=user.user_id, vehicle_id=vehicle.vehicle_id, start_date=datetime.now(), end_date=datetime.now())
    
    create_service_tag_solicitation(dto)
    create_service_tag_solicitation(dto)
    
    results = get_all_solicitations()
    
    assert len(results) >= 2
    assert results[0].user.email == "test@test.com"