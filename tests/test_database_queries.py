import pytest
from unittest.mock import MagicMock, ANY
from datetime import datetime


from api.database_queries import (
    create_service_tag_solicitation,
    set_solicitation_approval_status,
    get_solicitations_filtered, 
    check_user_exists,
    create_eventual_tag_solicitation, 
    create_temporary_tag_solicitation 
)
from api.api_schemas import (
    ServiceTagSolicitationDTO, 
    SolicitationFilterParams, 
    SolicitationStatusEnum
)


@pytest.fixture
def mock_session():
    return MagicMock()



def test_create_service_tag_solicitation(mock_session):
    
    dto = MagicMock()
    dto.user_id = 10
    dto.vehicle_id = 5
    dto.start_date = datetime(2025, 12, 1)
    dto.end_date = datetime(2025, 12, 2)

    result = create_service_tag_solicitation(dto, mock_session)

    mock_session.add.assert_called_once()
    mock_session.commit.assert_called_once()
    
    args, _ = mock_session.add.call_args
    solicitation_obj = args[0]
    
    assert solicitation_obj.user_id == 10
    assert solicitation_obj.solicited_tag_type == 'service'



def test_create_eventual_tag_solicitation(mock_session): 
    dto = MagicMock()
    dto.user_id = 2
    dto.start_date = datetime.now()
    dto.end_date = datetime.now()
    dto.vehicle.plate = "ABC-1234"
    dto.vehicle.model = "Fusca"
    dto.vehicle.color = "Branco"

    result = create_eventual_tag_solicitation(dto, mock_session)

    assert mock_session.add.call_count == 2
    assert mock_session.commit.call_count == 2
    
    args, _ = mock_session.add.call_args
    solicitation_obj = args[0]
    assert solicitation_obj.solicited_tag_type == 'eventual'



def test_set_solicitation_approval_status_success(mock_session):
    mock_solicitation = MagicMock()
    mock_session.query.return_value.filter.return_value.first.return_value = mock_solicitation

    result = set_solicitation_approval_status(1, True, mock_session)

    assert result.is_approved is True
    assert result.reviewed is True
    mock_session.commit.assert_called_once()

def test_set_solicitation_approval_status_not_found(mock_session):
    mock_session.query.return_value.filter.return_value.first.return_value = None

    with pytest.raises(ValueError):
        set_solicitation_approval_status(999, True, mock_session)



def test_get_solicitations_filtered_admin_no_filters(mock_session):
    mock_user = MagicMock()
    mock_user.is_admin = True

    filters = SolicitationFilterParams(page=1, size=10)
    
    mock_query = mock_session.query.return_value.join.return_value.outerjoin.return_value
    mock_query.count.return_value = 50
    
    expected_list = [MagicMock(), MagicMock()]
    mock_query.order_by.return_value.options.return_value.offset.return_value.limit.return_value.all.return_value = expected_list

    
    items, total = get_solicitations_filtered(mock_session, mock_user, filters)

    
    assert items == expected_list
    assert total == 50
    
def test_get_solicitations_filtered_common_user(mock_session):
    mock_user = MagicMock()
    mock_user.is_admin = False
    mock_user.user_id = 99

    filters = SolicitationFilterParams(page=1, size=10)
    
    mock_query = mock_session.query.return_value.join.return_value.outerjoin.return_value
    mock_query.filter.return_value = mock_query 

    get_solicitations_filtered(mock_session, mock_user, filters)

    
    assert mock_query.filter.called is True

def test_get_solicitations_filter_by_status(mock_session):
    mock_user = MagicMock()
    mock_user.is_admin = True
    
    filters = SolicitationFilterParams(page=1, size=10, status=SolicitationStatusEnum.PENDING)

    mock_query = mock_session.query.return_value.join.return_value.outerjoin.return_value
    mock_query.filter.return_value = mock_query 

    get_solicitations_filtered(mock_session, mock_user, filters)

    assert mock_query.filter.called is True

def test_check_user_exists_by_name(mock_session):
    mock_user = MagicMock()
    mock_user.name = "usuario_teste"
    
    mock_session.query.return_value.filter.return_value.first.return_value = mock_user

    result = check_user_exists("usuario_teste", mock_session)
    assert result == mock_user