
const API_URL = 'http://localhost:8000/api';

const REQUEST_METHODS ={
    POST: 'POST',
    GET: 'GET',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH'
}

interface FilterOptions {
    page?: number;
    size?: number;
    name?: string;
    plate?: string;
    tag_type?: string;
    status?: 'pendente' | 'aprovado' | 'rejeitado' | '';
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

export const createEventualTagRequest = async (data: { startDate: string; endDate: string; driver: { name: string; surname: string; license_number: string; }; vehicle: { plate: string; model: string; color: string; }; }) => {
    const requestData = {
        start_date: data.startDate,
        end_date: data.endDate,
        driver: data.driver,
        vehicle: data.vehicle
    };
    return await apiFetch('/solicitations/eventual', REQUEST_METHODS.POST, requestData);
};


export const getAllSolicitations = async (filters: FilterOptions) => {
    const params = new URLSearchParams();

    // null fields are ignored
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.size) params.append('size', filters.size.toString());
    if (filters.name) params.append('name', filters.name);
    if (filters.plate) params.append('plate', filters.plate);
    if (filters.tag_type) params.append('tag_type', filters.tag_type);
    if (filters.status) params.append('status', filters.status);

    const result = await apiFetch(`/solicitations?${params.toString()}`, REQUEST_METHODS.GET);
    
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