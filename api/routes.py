from fastapi import FastAPI
from pydantic import BaseModel
from api.database_queries import create_solicitation

# Run this file with:
# uvicorn routes:app --reload

app = FastAPI()


class SolicitationDTO(BaseModel):
    solicitation_id: int
    vehicle_id: int
    user_id: int

class TagDTO(BaseModel):
    tag_id: int
    tag_type: str

@app.post('/api/solicitations') 
def add_solicitation(solicitation: SolicitationDTO) -> None:
    try:
        create_solicitation(solicitation)
        return {"message": "Solicitação criada com sucesso."}, 201
    except ValueError as e:
        print(f"Erro ao criar solicitação: {e}")
        return {"error": str(e)}, 400

@app.get('/api/solicitations')
def get_solicitations() -> list[SolicitationDTO]:
    pass
    
@app.patch('/api/solicitations')
def update_solicitation_status(solicitation_id: int, approved: bool) -> None:
    try:
        update_solicitation_status(solicitation_id, approved)
        return {"message": "Status da solicitação atualizado com sucesso."}, 200
    except ValueError as e:
        print(f"Erro ao atualizar solicitação: {e}")
        return {"error": str(e)}, 400

@app.get('/api/tags')
def get_tags() -> list[TagDTO]: 
    pass

@app.post('/api/tags')
def post_tag(tag: TagDTO) -> None:
    pass