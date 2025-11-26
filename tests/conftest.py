import os
import pytest
from unittest.mock import MagicMock
from fastapi.testclient import TestClient

os.environ["DATABASE_URL"] = "sqlite:///./test.db"
os.environ["ACCESS_TOKEN_EXPIRE_HOURS"] = "24" 
os.environ["SECRET_KEY"] = "teste_secret_key_123" 
os.environ["ALGORITHM"] = "HS256" 

from api.app import app
from api.database_access import get_db

@pytest.fixture(scope="function")
def mock_db_session():
    return MagicMock()

@pytest.fixture(scope="function")
def client(mock_db_session):
    def override_get_db():
        try:
            yield mock_db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as c:
        yield c
    
    app.dependency_overrides.clear()