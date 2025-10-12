from pydantic import BaseModel
from typing import Optional, TypeVar, Generic

T = TypeVar('T')

class ResponseDTO(BaseModel, Generic[T]):
    success: bool
    data: Optional[T] = None
    message: Optional[str] = None

class ServiceTagSolicitationDTO(BaseModel):
    vehicle_id: Optional[int] = None
    user_id: int
    start_date: str
    end_date: str

# More Generic DTO for visualization purposes
# Don't use this for creating or updating records
class SolicitationDTO(BaseModel):
    solicitation_id: int
    creation_date: str
    is_approved: bool
    reviewed: bool
    start_date: str
    end_date: str
    solicited_tag_type: str
    vehicle_id: Optional[int] = None
    user_id: int

class TagDTO(BaseModel):
    tag_id: int
    tag_type: str

