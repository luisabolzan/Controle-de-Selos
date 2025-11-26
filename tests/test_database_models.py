import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError
from datetime import datetime
from api.database_models import Base, Users, Vehicles, Solicitation, Tags, TagTypes, Loan

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
        name="Luisa Model",
        email="luisa@inf.ufrgs.br",
        password_hash="hash123",
    )
    db_session.add(user)
    db_session.commit()

    assert user.user_id is not None
    assert user.is_admin is False

def test_user_unique_email(db_session):
    user1 = Users(name="U1", email="duplo@teste.com", password_hash="123")
    db_session.add(user1)
    db_session.commit()

    user2 = Users(name="U2", email="duplo@teste.com", password_hash="456")
    db_session.add(user2)

    with pytest.raises(IntegrityError):
        db_session.commit()
    
    db_session.rollback()

def test_create_vehicle_and_solicitation_relationship(db_session):
    user = Users(name="Solicitante", email="sol@teste.com", password_hash="123")
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

def test_create_user_with_missing_fields(db_session):
    user = Users(name="Incomplete User")
    db_session.add(user)

    with pytest.raises(IntegrityError):
        db_session.commit()
    
    db_session.rollback()

def test_vehicle_unique_plate_constraint(db_session):
    v1 = Vehicles(plate="UNQ-0001", model="Model1", color="White")
    db_session.add(v1)
    db_session.commit()

    v2 = Vehicles(plate="UNQ-0001", model="Model2", color="Black")
    db_session.add(v2)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_create_loan(db_session):
    user = Users(name="LoanUser", email="loan@teste.com", password_hash="pwd")
    vehicle = Vehicles(plate="LOAN-1234", model="Polo", color="Grey")
    tag = Tags(tag_type=TagTypes.temp)
    db_session.add_all([user, vehicle, tag])
    db_session.commit()

    loan = Loan(
        start_date=datetime.now(),
        end_date=datetime.now(),
        tag_id=tag.tag_id,
        vehicle_id=vehicle.vehicle_id,
        user_id=user.user_id,
    )
    db_session.add(loan)
    db_session.commit()

    assert loan.loan_id is not None
    assert loan.tag_id == tag.tag_id
    assert loan.vehicle_id == vehicle.vehicle_id
    assert loan.user_id == user.user_id