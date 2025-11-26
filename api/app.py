from fastapi import FastAPI
from .api_schemas import TagDTO
from fastapi.middleware.cors import CORSMiddleware

from .routes.solicitations import solicitations_router
from .routes.auth import auth_router
from .routes.users import users_router
from .routes.tags import tags_router

# Run this file with:
# uvicorn routes:app --reload

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:3000/approve",
    "http://192.168.0.103:3000",
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
app.include_router(users_router)
app.include_router(tags_router)

@app.get('/api/tags')
def get_tags() -> list[TagDTO]: 
    return []

@app.post('/api/tags')
def post_tag(tag: TagDTO) -> None:
    pass
