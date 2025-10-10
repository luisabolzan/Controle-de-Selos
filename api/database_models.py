from sqlalchemy import (Column, Integer, String, Boolean, DateTime, ForeignKey, Enum)
from sqlalchemy.orm import declarative_base
from datetime import datetime
import enum

Base = declarative_base()

class Users(Base):

    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    password_hash = Column(String(128), nullable=False)

    cpf = Column(String(11), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    phone_number = Column(String(20), nullable=True)
    is_admin = Column(Boolean, default=False)
    UFRGS_number = Column(String(50), nullable=True)
    has_active_request = Column(Boolean, default=False)

class Vehicles(Base):

    __tablename__ = 'vehicles'

    vehicle_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    plate = Column(String(10), unique=True, nullable=False, index=True)
    model = Column(String(50), nullable=True)
    color = Column(String(30), nullable=True)

class UsersVehicles(Base):
    __tablename__ = 'users_vehicles'
    user_id = Column(Integer, ForeignKey('users.user_id'), primary_key=True)
    vehicle_id = Column(Integer, ForeignKey('vehicles.vehicle_id'), primary_key=True)

class TagTypes(enum.Enum):
    temp = "temp"
    eventual = "eventual"
    service = "service"

class Tags(Base):

    __tablename__ = 'tags'

    tag_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tag_type = Column(Enum(TagTypes), nullable=False)
    available = Column(Boolean, default=True)
    register_date = Column(DateTime, default=datetime.now())

class Solicitation(Base):

    __tablename__ = 'solicitations'

    solicitation_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    creation_date = Column(DateTime, default=datetime.now())
    is_approved = Column(Boolean, nullable=True)
    reviewed = Column(Boolean, default=False)

    vehicle_id = Column(Integer, ForeignKey('vehicles.vehicle_id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)

class Loan(Base):
    __tablename__ = 'loans'
    
    loan_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    expired = Column(Boolean, default=False)
    creation_date = Column(DateTime, default=datetime.now())

    tag_id = Column(Integer, ForeignKey('tags.tag_id'), nullable=False)
    vehicle_id = Column(Integer, ForeignKey('vehicles.vehicle_id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
