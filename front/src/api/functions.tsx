
const API_URL = 'http://localhost:8000/api';

const REQUEST_METHODS ={
    POST: 'POST',
    GET: 'GET',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH'
}


const apiFetch = async (endpoint: string, method: string, body?: object, useCredentials: boolean = true) => {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: useCredentials ? 'include' : 'omit',
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.detail || `Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error in request to ${endpoint}:`, error);
        throw error;
    }
};

export const createServiceTagRequest = async (data: { startDate: string; endDate: string;}) => {
    const requestData = {
        start_date: data.startDate,
        end_date: data.endDate,
    };
    return await apiFetch('/solicitations/service', REQUEST_METHODS.POST, requestData);
};


export const getAllSolicitations = async () => {
    const result = await apiFetch('/solicitations/', REQUEST_METHODS.GET);
    return result; 
};

export const updateSolicitationStatus = async (id: number, approval: boolean) => {
    const parsedId = Number(id);
    const data = { approval: approval };

    return await apiFetch(`/solicitations/${parsedId}`, REQUEST_METHODS.PATCH, data);
};

export const authenticateUser = async (username: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  try {
    const response = await fetch(`${API_URL}/auth/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData, 
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Falha na autenticação');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
};