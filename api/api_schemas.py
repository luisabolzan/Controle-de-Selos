from pydantic import BaseModel

class SolicitationDTO(BaseModel):
    vehicle_id: int
    user_id: int

class TagDTO(BaseModel):
    tag_id: int
    tag_type: str

