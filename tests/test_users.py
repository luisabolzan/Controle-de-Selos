from unittest.mock import MagicMock, patch, ANY

def test_register_user_success(client):
    user_data = {
        "user_id": 0,
        "name": "Joao Teste",
        "email": "joao@teste.com",
        "password": "senhaforte123",
        "cpf": "123.456.789-00",
        "phone_number": "51999999999"
    }

    with patch("api.routes.users.check_user_exists") as mock_check_user, \
         patch("api.routes.users.get_password_hash") as mock_hash, \
         patch("api.routes.users.create_access_token") as mock_token:

        mock_check_user.return_value = None
        mock_hash.return_value = "hashed_password_123"
        mock_token.return_value = "fake_jwt_token"

        response = client.post("/users/register", json=user_data)

        assert response.status_code == 200
        data = response.json()
        assert data["access_token"] == "fake_jwt_token"
        assert data["token_type"] == "bearer"
        
        mock_check_user.assert_called_once_with("joao@teste.com", ANY)

def test_register_user_already_exists(client):
    user_data = {
        "user_id": 0,
        "name": "Maria Teste",
        "email": "maria@teste.com",
        "password": "senha123",
        "cpf": "000.000.000-00",
        "phone_number": "11888888888"
    }

    with patch("api.routes.users.check_user_exists") as mock_check_user:
        mock_check_user.return_value = {"id": 1, "email": "maria@teste.com"}

        response = client.post("/users/register", json=user_data)

        assert response.status_code == 400
        assert response.json()["detail"] == "User already exists"