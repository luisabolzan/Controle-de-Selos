from unittest.mock import MagicMock, patch, ANY

def test_register_user_success(client):
    user_data = {
        "username": "joaoteste",
        "password": "senhaforte123"
    }

    with patch("api.routes.users.check_user_exists") as mock_check_user, \
         patch("api.routes.users.get_password_hash") as mock_hash:

        mock_check_user.return_value = None
        mock_hash.return_value = "hashed_password_123"

        response = client.post("/api/users/register", json=user_data)

        assert response.status_code == 201
        data = response.json()
        assert data["message"] == "User registered successfully"
        
        mock_check_user.assert_called_once_with("joaoteste", ANY)

def test_register_user_already_exists(client):
    user_data = {
        "username": "mariateste",
        "password": "123"
    }

    with patch("api.routes.users.check_user_exists") as mock_check_user:
        mock_check_user.return_value = {"id": 1, "name": "mariateste"}

        response = client.post("/api/users/register", json=user_data)

        assert response.status_code == 409
        assert response.json()["detail"] == "User already exists"