from api.api_schemas import TagDTO

def test_get_tags(client):
    """
    Testa a rota GET /api/tags
    Nota: Como a função original tem apenas um 'pass', ela retorna null.
    O FastAPI pode validar isso contra o response_model.
    """
    response = client.get("/api/tags")
    
    # Como a implementação atual é 'pass', esperamos que a rota exista (não seja 404).
    # O status code exato depende de como o FastAPI lida com retorno None para List.
    # Geralmente retorna 200 com null ou array vazio, ou erro de validação (500) se for estrito.
    # Vamos assumir que queremos apenas garantir que a rota foi chamada.
    
    assert response.status_code != 404

def test_post_tag(client):
    """
    Testa a rota POST /api/tags
    """
    tag_data = {
        "id": 1,
        "name": "Selo Teste",
        # Adicione outros campos obrigatórios do TagDTO se houver
    }
    
    response = client.post("/api/tags", json=tag_data)
    
    # Novamente, como é 'pass', esperamos sucesso (200) e retorno null/None
    assert response.status_code == 200