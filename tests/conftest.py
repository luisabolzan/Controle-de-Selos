import os
import pytest
from unittest.mock import MagicMock
from fastapi.testclient import TestClient

# --- CONFIGURAÇÃO DE AMBIENTE (MOCK) ---
# Definimos valores falsos para tudo que o sistema tenta ler do .env ou ambiente
# Fazemos isso ANTES de importar o app para não quebrar na inicialização.
os.environ["DATABASE_URL"] = "sqlite:///./test.db"
os.environ["ACCESS_TOKEN_EXPIRE_HOURS"] = "24"  # Simula 24 horas
os.environ["SECRET_KEY"] = "teste_secret_key_123" # Chave falsa para testes
os.environ["ALGORITHM"] = "HS256" # Algoritmo padrão JWT

# Agora sim importamos o app
from api.app import app
from api.database_access import get_db

@pytest.fixture(scope="function")
def mock_db_session():
    """
    Cria um Mock para a sessão do banco de dados.
    """
    return MagicMock()

@pytest.fixture(scope="function")
def client(mock_db_session):
    """
    Cria um TestClient com a dependência do banco sobrescrita.
    """
    def override_get_db():
        try:
            yield mock_db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as c:
        yield c
    
    app.dependency_overrides.clear()