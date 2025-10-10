from pydantic import BaseModel
from typing import Optional, TypeVar, Generic

T = TypeVar('T')

class ResponseDTO(BaseModel, Generic[T]):
    success: bool
    data: Optional[T] = None
    message: Optional[str] = None

class SolicitationDTO(BaseModel):
    vehicle_id: int
    user_id: int

class TagDTO(BaseModel):
    tag_id: int
    tag_type: str

