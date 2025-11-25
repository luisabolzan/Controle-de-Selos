from datetime import datetime
from unittest.mock import MagicMock, patch
from api.app import app
from api.utils.security import get_current_user

def mock_user_admin():
    user = MagicMock()
    user.user_id = 1
    user.is_admin = True
    return user

def mock_user_common():
    user = MagicMock()
    user.user_id = 2
    user.is_admin = False
    return user

def test_add_service_solicitation_success(client):
    app.dependency_overrides[get_current_user] = mock_user_common

    payload = {
        "vehicle_id": 10,
        "start_date": "2025-12-01T10:00:00",
        "end_date": "2025-12-02T10:00:00"
    }

    with patch("api.routes.solicitations.create_service_tag_solicitation") as mock_create:
        mock_create.return_value = None 
        
        response = client.post("/api/solicitations/service", json=payload)

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        
        mock_create.assert_called_once()
        args, _ = mock_create.call_args
        solicitation_dto = args[0]
        assert solicitation_dto.user_id == 2 

    app.dependency_overrides = {}

def test_add_service_solicitation_error(client):
    app.dependency_overrides[get_current_user] = mock_user_common

    payload = {
        "vehicle_id": 10,
        "start_date": "2025-12-01T10:00:00",
        "end_date": "2025-12-01T09:00:00" 
    }

    with patch("api.routes.solicitations.create_service_tag_solicitation") as mock_create:
        mock_create.side_effect = ValueError("Data final deve ser maior que inicial")
        
        response = client.post("/api/solicitations/service", json=payload)

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is False 
        assert "Data final deve ser maior que inicial" in data["message"]

    app.dependency_overrides = {}

def test_get_solicitations_as_admin(client):
    """
    Testa se um ADMIN consegue ver a lista de solicitações.
    """
    app.dependency_overrides[get_current_user] = mock_user_admin 

    with patch("api.routes.solicitations.get_all_solicitations") as mock_get:
        mock_get.return_value = [{
            "solicitation_id": 1,
            "creation_date": datetime.now(),
            "is_approved": False,
            "reviewed": False,
            "start_date": datetime.now(),
            "end_date": datetime.now(),
            "solicited_tag_type": "Selo Visitante",
            "vehicle_id": 10,
            "user_id": 2,
            "vehicle": None, 
            "user": {        
                "user_id": 2,
                "name": "Usuario Mock",
                "email": "teste@mock.com",
                "has_active_request": False
            }     
        }]
        
        response = client.get("/api/solicitations/solicitations")
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert isinstance(data["data"], list)
        assert len(data["data"]) == 1
        assert data["data"][0]["solicitation_id"] == 1
        assert data["data"][0]["user"]["name"] == "Usuario Mock"

    app.dependency_overrides = {}

def test_get_solicitations_access_denied(client):
    app.dependency_overrides[get_current_user] = mock_user_common 

    response = client.get("/api/solicitations/solicitations")

    assert response.status_code == 200 
    assert response.json()["success"] is False

    app.dependency_overrides = {}

def test_update_solicitation_status(client):
    payload = {"approval": True}

    with patch("api.routes.solicitations.set_solicitation_approval_status") as mock_set:
        mock_set.return_value = None

        response = client.patch("/api/solicitations/api/solicitations/1", json=payload)
        
        assert response.status_code == 200
        assert response.json()["success"] is True
        
        mock_set.assert_called_once_with(1, True)