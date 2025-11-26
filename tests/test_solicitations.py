from datetime import datetime
from unittest.mock import MagicMock, patch
from api.app import app
from api.utils.security import get_current_user, get_current_admin

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

        assert response.status_code == 201
        assert response.json()["message"] == "Solicitation Created Successfully"
        
        mock_create.assert_called_once()

    app.dependency_overrides = {}

def test_add_service_solicitation_error(client):
    app.dependency_overrides[get_current_user] = mock_user_common

    payload = {
        "vehicle_id": 10,
        "start_date": "2025-12-01T10:00:00",
        "end_date": "2025-12-01T09:00:00"
    }

    with patch("api.routes.solicitations.create_service_tag_solicitation") as mock_create:
        mock_create.side_effect = ValueError("Data invalida")
        
        response = client.post("/api/solicitations/service", json=payload)

        assert response.status_code == 400
        assert "Data invalida" in response.json()["detail"]

    app.dependency_overrides = {}

def test_get_solicitations_success(client):
    app.dependency_overrides[get_current_user] = mock_user_admin

    with patch("api.routes.solicitations.get_solicitations_filtered") as mock_get:
        mock_item = {
            "solicitation_id": 1,
            "creation_date": datetime.now(),
            "is_approved": False,
            "reviewed": False,
            "start_date": datetime.now(),
            "end_date": datetime.now(),
            "solicited_tag_type": "service",
            "vehicle_id": 10,
            "user_id": 2
        }
        
        mock_get.return_value = ([mock_item], 1)
        
        response = client.get("/api/solicitations/")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "data" in data
        assert "total" in data
        assert data["total"] == 1
        assert len(data["data"]) == 1

    app.dependency_overrides = {}

def test_update_solicitation_status_success(client):
    app.dependency_overrides[get_current_admin] = mock_user_admin
    
    payload = {"approval": True}

    with patch("api.routes.solicitations.set_solicitation_approval_status") as mock_set:
        mock_set.return_value = None

        response = client.patch("/api/solicitations/1", json=payload)
        
        assert response.status_code == 200
        assert response.json()["message"] == "Status Updated Successfully"
        
        mock_set.assert_called_once_with(1, True, session=python_any)

    app.dependency_overrides = {}

def test_update_solicitation_status_not_found(client):
    app.dependency_overrides[get_current_admin] = mock_user_admin
    payload = {"approval": True}

    with patch("api.routes.solicitations.set_solicitation_approval_status") as mock_set:
        mock_set.side_effect = ValueError("ID nao encontrado")

        response = client.patch("/api/solicitations/999", json=payload)

        assert response.status_code == 404
        assert "ID nao encontrado" in response.json()["detail"]

    app.dependency_overrides = {}
    
from unittest.mock import ANY as python_any

def test_update_solicitation_status_invalid_input(client):
    app.dependency_overrides[get_current_admin] = mock_user_admin
    payload = {"approval": "not_a_boolean"}

    response = client.patch("/api/solicitations/1", json=payload)

    assert response.status_code == 422

    app.dependency_overrides = {}

def test_update_solicitation_status_unauthorized(client):
    app.dependency_overrides[get_current_user] = mock_user_common
    payload = {"approval": True}

    response = client.patch("/api/solicitations/1", json=payload)

    assert response.status_code == 403

    app.dependency_overrides = {}