import pytest
from unittest.mock import MagicMock
from api.database_access import db_access, get_db

def test_database_initialization():
    assert db_access.engine is not None
    assert db_access.session is not None
    assert "sqlite" in str(db_access.engine.url)

def test_get_db_yields_session():
    generator = get_db()
    session = next(generator)
    
    assert session == db_access.session
    
    try:
        next(generator)
    except StopIteration:
        pass

def test_get_db_closes_session():
    mock_session = MagicMock()
    
    original_session = db_access.session
    db_access.session = mock_session
    
    try:
        generator = get_db()
        next(generator)
        
        with pytest.raises(StopIteration):
            next(generator)
            
        mock_session.close.assert_called_once()    
    finally:
        db_access.session = original_session