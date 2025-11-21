import pytest
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool 
from unittest.mock import MagicMock
from routes import app
from fastapi.testclient import TestClient
from database_models import Base, Users, Vehicles, Solicitation, Tags, Loan

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}, 
    poolclass=StaticPool 
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    
    session = TestingSessionLocal()

    targets = [
        mod for name, mod in sys.modules.items() 
        if name.endswith("database_queries") and hasattr(mod, "session")
    ]
    
    original_values = {mod: mod.session for mod in targets}

    for mod in targets:
        mod.session = session

    yield session

    session.close()
    Base.metadata.drop_all(bind=engine)
    
    for mod, original in original_values.items():
        mod.session = original

@pytest.fixture(scope="function")
def client(db_session):
    with TestClient(app) as c:
        yield c

@pytest.fixture
def setup_data(db_session):
    user = Users(name="Test User", email="test@test.com", cpf="12345678900", password_hash="abc")
    vehicle = Vehicles(plate="ABC1234", model="Fusca", color="Azul")
    
    db_session.add(user)
    db_session.add(vehicle)
    db_session.commit()
    
    db_session.refresh(user)
    db_session.refresh(vehicle)
    
    return {"user": user, "vehicle": vehicle}