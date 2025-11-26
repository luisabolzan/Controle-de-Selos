import pytest
from unittest.mock import MagicMock, ANY
from datetime import datetime

from api.database_queries import (
    create_service_tag_solicitation,
    set_solicitation_approval_status,
    get_all_solicitations,
    check_user_exists
)
from api.api_schemas import ServiceTagSolicitationDTO

@pytest.fixture
def mock_session():
    return MagicMock()

def test_create_service_tag_solicitation(mock_session):
    dto = ServiceTagSolicitationDTO(
        user_id=10,
        vehicle_id=5,
        start_date=datetime(2025, 12, 1),
        end_date=datetime(2025, 12, 2)
    )

    result = create_service_tag_solicitation(dto, mock_session)

    mock_session.add.assert_called_once()
    args, _ = mock_session.add.call_args
    solicitation_obj = args[0]
    
    assert solicitation_obj.user_id == 10
    assert solicitation_obj.vehicle_id == 5
    assert solicitation_obj.solicited_tag_type == 'service'
    assert solicitation_obj.is_approved is False

    mock_session.commit.assert_called_once()
    
    assert result == solicitation_obj

def test_set_solicitation_approval_status_success(mock_session):
    mock_solicitation = MagicMock()
    mock_solicitation.solicitation_id = 1
    mock_solicitation.is_approved = False
    mock_solicitation.reviewed = False

    mock_session.query.return_value.filter.return_value.first.return_value = mock_solicitation

    result = set_solicitation_approval_status(1, True, mock_session)

    assert result.is_approved is True
    assert result.reviewed is True
    mock_session.commit.assert_called_once()

def test_set_solicitation_approval_status_not_found(mock_session):
    mock_session.query.return_value.filter.return_value.first.return_value = None

    with pytest.raises(ValueError, match="Solicitação com ID 999 não encontrada"):
        set_solicitation_approval_status(999, True, mock_session)

    mock_session.commit.assert_not_called()

def test_get_all_solicitations(mock_session):
    expected_list = [MagicMock(id=1), MagicMock(id=2)]
    
    mock_query = mock_session.query.return_value
    mock_options = mock_query.options.return_value
    mock_options.all.return_value = expected_list

    result = get_all_solicitations(mock_session)

    assert result == expected_list
    mock_query.options.assert_called() 
    mock_session.commit.assert_called_once()

def test_check_user_exists_found(mock_session):
    mock_user = MagicMock()
    mock_user.email = "teste@teste.com"
    
    mock_session.query.return_value.filter.return_value.first.return_value = mock_user

    result = check_user_exists("teste@teste.com", mock_session)
    assert result == mock_user

def test_check_user_exists_not_found(mock_session):
    mock_session.query.return_value.filter.return_value.first.return_value = None

    result = check_user_exists("naoexiste@teste.com", mock_session)
    assert result is None