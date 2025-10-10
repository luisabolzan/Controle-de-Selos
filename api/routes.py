from fastapi import FastAPI
from pydantic import BaseModel

# Run this file with:
# uvicorn routes:app --reload

app = FastAPI()


class SolicitationDTO(BaseModel):
    id: int
    date_time: str
    is_approved: bool
    reviewed: bool
    vehicle_id: int
    user_id: int

class TagDTO(BaseModel):
    id: int
    type: str
    available: bool
    register_date: str


@app.post('/api/solicitations') 
def add_solicitation(solicitation: SolicitationDTO) -> None:
    pass

@app.get('/api/solicitations')
def get_solicitations() -> list[SolicitationDTO]:
    pass
    
@app.patch('/api/solicitations/{id}')
def update_solicitation_status(approved: bool) -> None:
    pass

@app.get('/api/tags')
def get_tags() -> list[TagDTO]: 
    pass

@app.post('/api/tags')
def post_tag(tag: TagDTO) -> None:
    pass