from fastapi import FastAPI
from .database_queries import create_service_tag_solicitation, get_all_solicitations, set_solicitation_approval_status
from .api_schemas import ServiceTagSolicitationDTO, SolicitationDTO, TagDTO,  ResponseDTO, SolicitationApproval
from fastapi.middleware.cors import CORSMiddleware

from .routes.solicitations import solicitations_router
from .routes.auth import auth_router

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

app.include_router(solicitations_router)
app.include_router(auth_router)

def success_response(data: any) -> ResponseDTO:
    return ResponseDTO(success=True, data=data, message="success")

def failed_response(message: str) -> ResponseDTO:
    return ResponseDTO(success=False, message=message, data=None)

@app.get('/api/tags')
def get_tags() -> list[TagDTO]: 
    pass

@app.post('/api/tags')
def post_tag(tag: TagDTO) -> None:
    pass
