from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, TypeVar, Generic, List
from datetime import datetime
from enum import Enum

T = TypeVar('T')


class SolicitationStatusEnum(str, Enum):
    PENDING = "pendente"
    APPROVED = "aprovado"
    REJECTED = "rejeitado"

class SolicitationFilterParams(BaseModel):
    page: int = Field(1, ge=1, description="Número da página")
    size: int = Field(10, ge=1, le=100, description="Itens por página")
    
    name: Optional[str] = None
    plate: Optional[str] = None
    tag_type: Optional[str] = None # 'service', 'eventual', etc.
    status: Optional[SolicitationStatusEnum] = None

class TagFilterParams(BaseModel):
    page: int = Field(1, ge=1, description="Número da página")
    size: int = Field(10, ge=1, le=100, description="Itens por página")
    
    tag_type: Optional[str] = None
    user_name: Optional[str] = None 
    plate: Optional[str] = None # Vehicle plate
    
class LoginResponseDTO(BaseModel):
    message: Optional[str] = "Login successful"
    isAdmin: bool
    user: str

class PaginatedResponse(BaseModel, Generic[T]):
    data: List[T] 
    total: int
    page: int
    size: int
    pages: int

class SolicitationApproval(BaseModel):
    approval: bool

class ServiceTagDTO(BaseModel):
    vehicle_id: Optional[int] = None
    start_date: datetime
    end_date: datetime

class ServiceTagSolicitationDTO(ServiceTagDTO):
    user_id: int


class DriverDTO(BaseModel):
    name: str
    surname: str
    license_number: str

class SolicitationVehicleDTO(BaseModel):
    plate: str
    model: str
    color: str

class EventualTagDTO(BaseModel):
    start_date: datetime
    end_date: datetime
    driver: DriverDTO
    vehicle: SolicitationVehicleDTO

class EventualTagSolicitationDTO(EventualTagDTO):
    user_id: int

class TemporaryTagDTO(BaseModel):
    driver: DriverDTO
    vehicle: SolicitationVehicleDTO

class TemporaryTagSolicitationDTO(TemporaryTagDTO):
    user_id: int
    
class GenericTagDTO(BaseModel):
    tag_type: str
    tag_id: int
    vehicle_plate: Optional[str] = None
    current_user_email: Optional[str] = None
    end_date: Optional[datetime] = None
    
# More Generic DTO for visualization purposes
# Don't use this for creating or updating records
class SolicitationDTO(BaseModel):
    solicitation_id: int
    creation_date: datetime
    is_approved: bool
    reviewed: bool
    start_date: datetime
    end_date: datetime
    solicited_tag_type: str
    vehicle_id: Optional[int] = None
    user_id: int
    vehicle: Optional['VehicleDTO'] = None
    user: 'UserDTO' = None
    
    model_config = ConfigDict(from_attributes=True)


class VehicleDTO(BaseModel):
    vehicle_id: int
    plate: str
    model: Optional[str] = None
    color: Optional[str] = None

class TagDTO(BaseModel):
    tag_id: int
    tag_type: str
    vehicle: Optional[VehicleDTO] = None

class UserDTO(BaseModel):
    user_id: int
    name: str
    email: str
    has_active_request: Optional[bool] = False

class UserRegisterDTO(BaseModel):
    username: str
    password: str
    
