import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError
from datetime import datetime
from api.database_models import Base, Users, Vehicles, Solicitation, Tags, TagTypes

@pytest.fixture(scope="module")
def engine():
    return create_engine("sqlite:///:memory:")

@pytest.fixture(scope="function")
def db_session(engine):
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    yield session
    
    session.close()
    Base.metadata.drop_all(engine)


def test_create_user_success(db_session):
    user = Users(
        name="Model Test",
        email="model@teste.com",
        cpf="111.222.333-44",
        password_hash="hash123"
    )
    db_session.add(user)
    db_session.commit()

    assert user.user_id is not None
    assert user.is_admin is False 

def test_user_unique_constraints(db_session):
    user1 = Users(name="U1", email="duplo@teste.com", cpf="000.000.000-01", password_hash="123")
    db_session.add(user1)
    db_session.commit()

    user2 = Users(name="U2", email="duplo@teste.com", cpf="999.999.999-99", password_hash="456")
    db_session.add(user2)

    with pytest.raises(IntegrityError):
        db_session.commit()
    
    db_session.rollback()

def test_create_vehicle_and_solicitation_relationship(db_session):
    user = Users(name="Solicitante", email="sol@teste.com", cpf="123", password_hash="123")
    db_session.add(user)
    
    vehicle = Vehicles(plate="ABC-1234", model="Fusca", color="Azul")
    db_session.add(vehicle)
    db_session.commit()

    solicitation = Solicitation(
        user_id=user.user_id,
        vehicle_id=vehicle.vehicle_id,
        start_date=datetime.now(),
        end_date=datetime.now(),
        solicited_tag_type=TagTypes.service
    )
    db_session.add(solicitation)
    db_session.commit()

    assert solicitation.solicitation_id is not None
    assert solicitation.user.name == "Solicitante"
    assert solicitation.vehicle.plate == "ABC-1234"
    assert solicitation.solicited_tag_type == TagTypes.service

def test_enum_handling(db_session):
    tag = Tags(tag_type=TagTypes.eventual, available=True)
    db_session.add(tag)
    db_session.commit()

    saved_tag = db_session.query(Tags).first()
    assert saved_tag.tag_type == TagTypes.eventual