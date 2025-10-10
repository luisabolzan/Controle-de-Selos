from fastapi import FastAPI
from database_queries import create_solicitation, get_all_solicitations, update_solicitation_status
from api_schemas import SolicitationDTO, TagDTO,  ResponseDTO

# Run this file with:
# uvicorn routes:app --reload

app = FastAPI()

def success_response(data: any) -> ResponseDTO:
    return ResponseDTO(success=True, data=data, message="success")

def failed_response(message: str) -> ResponseDTO:
    return ResponseDTO(success=False, message=message, data=None)

@app.post('/api/solicitations') 
def add_solicitation(solicitation: SolicitationDTO) -> None:
    try:
        create_solicitation(solicitation)
        return success_response(message="Solicitação criada com sucesso.")
    except ValueError as e:
        print(f"Erro ao criar solicitação: {e}")
        return failed_response(message=str(e))

@app.get('/api/solicitations')
def get_solicitations() -> ResponseDTO[list[SolicitationDTO]]:
    try:
        result = get_all_solicitations()
        return success_response(data=result)
    except ValueError as e:
        print(f"Erro ao obter solicitações: {e}")
        return failed_response(message=str(e))

@app.patch('/api/solicitations')
def update_solicitation_status(solicitation_id: int, approved: bool) -> ResponseDTO[None]:
    try:
        update_solicitation_status(solicitation_id, approved)
        return success_response(message="Status da solicitação atualizado com sucesso.")
    except ValueError as e:
        print(f"Erro ao atualizar solicitação: {e}")
        return failed_response(message=str(e))

@app.get('/api/tags')
def get_tags() -> list[TagDTO]: 
    pass

@app.post('/api/tags')
def post_tag(tag: TagDTO) -> None:
    pass