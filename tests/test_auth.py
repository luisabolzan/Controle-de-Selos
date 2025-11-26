from unittest.mock import MagicMock, patch

def test_login_success(client):
    mock_user = MagicMock()
    mock_user.name = "admin"
    mock_user.password_hash = "hash_da_senha_correta"
    mock_user.is_admin = True

    with patch("api.routes.auth.check_user_exists") as mock_check, \
         patch("api.routes.auth.verify_password") as mock_verify, \
         patch("api.routes.auth.create_access_token") as mock_token:
        
        mock_check.return_value = mock_user
        mock_verify.return_value = True
        mock_token.return_value = "token_jwt_fake"

        payload = {
            "username": "admin",
            "password": "senha123"
        }
        
        response = client.post("/api/auth/", data=payload)

        assert response.status_code == 200
        data = response.json()
        
        assert "isAdmin" in data
        assert data["isAdmin"] is True
        
        assert "access_token" in response.cookies
        assert "token_jwt_fake" in response.cookies["access_token"]

def test_login_user_not_found(client):
    with patch("api.routes.auth.check_user_exists") as mock_check:
        mock_check.return_value = None

        payload = {"username": "naoexiste", "password": "123"}
        response = client.post("/api/auth/", data=payload)

        assert response.status_code == 401
        assert response.json()["detail"] == "User Not Found"

def test_login_invalid_credentials(client):
    mock_user = MagicMock()
    mock_user.password_hash = "hash_real"

    with patch("api.routes.auth.check_user_exists") as mock_check, \
         patch("api.routes.auth.verify_password") as mock_verify:
        
        mock_check.return_value = mock_user
        mock_verify.return_value = False

        payload = {"username": "existe", "password": "senhaerrada"}
        response = client.post("/api/auth/", data=payload)

        assert response.status_code == 401
        assert response.json()["detail"] == "Invalid Credentials"