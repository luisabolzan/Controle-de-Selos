from datetime import datetime

def test_create_solicitation_route(client, setup_data):
    user = setup_data["user"]
    vehicle = setup_data["vehicle"]
    
    payload = {
        "user_id": user.user_id,
        "vehicle_id": vehicle.vehicle_id,
        "start_date": datetime.now().isoformat(),
        "end_date": datetime.now().isoformat()
    }
    
    response = client.post("/api/solicitations/service", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["message"] == "success"

def test_get_solicitations_route(client, setup_data):
    response = client.get("/api/solicitations")
    assert response.status_code == 200
    assert response.json()["data"] == []

    user = setup_data["user"]
    vehicle = setup_data["vehicle"]
    payload = {
        "user_id": user.user_id, "vehicle_id": vehicle.vehicle_id,
        "start_date": str(datetime.now()), "end_date": str(datetime.now())
    }
    client.post("/api/solicitations/service", json=payload)
    
    response_2 = client.get("/api/solicitations")
    data = response_2.json()["data"]
    assert len(data) == 1
    assert data[0]["user_id"] == user.user_id

def test_update_approval_route(client, setup_data):
    user = setup_data["user"]
    vehicle = setup_data["vehicle"]
    payload = {
        "user_id": user.user_id, "vehicle_id": vehicle.vehicle_id,
        "start_date": str(datetime.now()), "end_date": str(datetime.now())
    }
    client.post("/api/solicitations/service", json=payload)
    
    solicitation_id = 1
    
    approval_payload = {"approval": True}
    response = client.patch(f"/api/solicitations/{solicitation_id}", json=approval_payload)
    
    assert response.status_code == 200
    assert response.json()["success"] is True

def test_update_non_existent_solicitation(client):
    response = client.patch("/api/solicitations/999", json={"approval": True})
    
    assert response.status_code == 200
    assert response.json()["success"] is False
    assert "não encontrada" in response.json()["message"]