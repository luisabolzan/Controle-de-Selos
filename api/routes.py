from fastapi import FastAPI
from database_queries import create_service_tag_solicitation, get_all_solicitations, set_solicitation_approval_status
from api_schemas import ServiceTagSolicitationDTO, SolicitationDTO, TagDTO,  ResponseDTO, SolicitationApproval
from fastapi.middleware.cors import CORSMiddleware

# Run this file with:
# uvicorn routes:app --reload

app = FastAPI()

origins = [
    "localhost:3000/service",
    "http://localhost:3000/service",
    "http://localhost:3000",
    "http://localhost:3000",
    "http://192.168.0.103:3000",
    "http://192.168.0.103:3000/service",
    "http://localhost:3000/approve"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],    
    allow_headers=["*"] 
)

def success_response(data: any) -> ResponseDTO:
    return ResponseDTO(success=True, data=data, message="success")

def failed_response(message: str) -> ResponseDTO:
    return ResponseDTO(success=False, message=message, data=None)

@app.post('/api/solicitations/service')
def add_service_solicitation(solicitation: ServiceTagSolicitationDTO) -> ResponseDTO[None]:
    print(solicitation)
    try:
        create_service_tag_solicitation(solicitation)
        return success_response(data=None)
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

@app.patch('/api/solicitations/{solicitation_id}')
def update_solicitation_status(solicitation_id: int, body: SolicitationApproval) -> ResponseDTO[None]:
    try:
        result = set_solicitation_approval_status(solicitation_id, body.approval)
        return success_response(data=None)
    except ValueError as e:
        print(f"Erro ao atualizar solicitação: {e}")
        return failed_response(message=str(e))

@app.get('/api/tags')
def get_tags() -> list[TagDTO]: 
    pass

@app.post('/api/tags')
def post_tag(tag: TagDTO) -> None:
    pass